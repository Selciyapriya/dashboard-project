
import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import StatCard from "./components/StatCard"
import DataTable from "./components/DataTable"
import Modal from "./components/Modal"
import Form from "./components/Form"

const stats = [
  {
    title: "Total Projects",
    value: "12",
    color: "bg-violet-100 text-violet-900 border-violet-200",
  },
  {
    title: "Completed Tasks",
    value: "28",
    color: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  {
    title: "Messages",
    value: "7",
    color: "bg-rose-100 text-rose-900 border-rose-200",
  },
  {
    title: "Team Members",
    value: "4",
    color: "bg-sky-100 text-sky-900 border-sky-200",
  },
]

const initialProducts = [
  { id: 1, name: "Running Shoes", category: "Footwear", price: 1999, stock: 25 },
  { id: 2, name: "Backpack", category: "Bags", price: 1299, stock: 15 },
  { id: 3, name: "Smart Watch", category: "Electronics", price: 3499, stock: 8 },
  { id: 4, name: "Water Bottle", category: "Accessories", price: 499, stock: 40 },
  { id: 5, name: "Headphones", category: "Electronics", price: 2499, stock: 12 },
]

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
}

export default function App() {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] =useState(true)
  const [apiError, setApiError] = useState("")
  const [actionError, setActionError] = useState("")
  const [saving, setSaving] = useState(false)
  useEffect(() => {
  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://dummyjson.com/products"
      )

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()

      const apiProducts = data.products.map((product) => ({
        id: product.id,
        name: product.title,
        category: product.category,
        price: product.price,
        stock: product.stock,
      }))

      setProducts(apiProducts)
    } catch (error) {
      setApiError(error.message)
    } finally {
      setLoading(false)
    }
  }

  fetchProducts()
}, [])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortBy, setSortBy] = useState("name-asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const categories = [...new Set(products.map((p) => p.category))].sort()
  const productColumns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Product Name",
    render: (product) => (
      <span className="font-semibold text-slate-800">
        📦 {product.name}
      </span>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (product) => (
      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
        {product.category}
      </span>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (product) => (
      <span className="font-medium">
        ₹{product.price.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    key: "stock",
    label: "Stock",
  },
  {
    key: "status",
    label: "Status",
    render: (product) => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          product.stock < 10
            ? "bg-orange-100 text-orange-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {product.stock < 10 ? "Low Stock" : "In Stock"}
      </span>
    ),
  },
]

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (product) =>
        categoryFilter === "All" || product.category === categoryFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        default:
          return a.name.localeCompare(b.name)
      }
    })

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    })
    setIsModalOpen(true)
  }
  function validateForm() {
  const newErrors = {}

  if (form.name.trim().length < 2) {
    newErrors.name = "Product name must have at least 2 characters"
  }

  if (!form.category.trim()) {
    newErrors.category = "Category is required"
  }

  if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
    newErrors.price = "Enter a valid price greater than 0"
  }

  if (
    form.stock === "" ||
    !Number.isInteger(Number(form.stock)) ||
    Number(form.stock) < 0
  ) {
    newErrors.stock = "Enter a valid whole number (0 or more)"
  }

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0
  }
  
async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const productData = {
    title: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    stock: Number(form.stock),
  };

  const isLocalProduct = products.some(
    (product) => product.id === editingId && product.isLocal
  );

  try {
    setSaving(true);
    setActionError("");

    if (editingId !== null) {
      // Update the product in the local React state
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: productData.title,
                category: productData.category,
                price: productData.price,
                stock: productData.stock,
              }
            : product
        )
      );

      // Only call PUT for products originally loaded from the API
      if (!isLocalProduct) {
        const response = await fetch(
          `https://dummyjson.com/products/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );

        if (!response.ok) {
          throw new Error("Product updated locally, but API update failed.");
        }

        await response.json();
      }
    } else {
      // Add the product locally first
      const temporaryId = Date.now();

      const newProduct = {
        id: temporaryId,
        name: productData.title,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        isLocal: true,
      };

      setProducts((current) => [newProduct, ...current]);

      try {
        const response = await fetch(
          "https://dummyjson.com/products/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );

        if (!response.ok) {
          throw new Error("API add request failed.");
        }

        const savedProduct = await response.json();

        setProducts((current) =>
          current.map((product) =>
            product.id === temporaryId
              ? { ...product, id: savedProduct.id }
              : product
          )
        );
      } catch {
        setActionError(
          "Product added locally, but the API request failed."
        );
      }
    }

    setIsModalOpen(false);
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  } catch (error) {
    setActionError(error.message);
  } finally {
    setSaving(false);
  }
}

async function deleteProduct(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  const productToDelete = products.find(
    (product) => product.id === id
  );

  // Remove the product from the dashboard
  setProducts((current) =>
    current.filter((product) => product.id !== id)
  );

  setActionError("");

  // Skip API deletion for locally created products
  if (productToDelete?.isLocal) {
    return;
  }

  try {
    const response = await fetch(
      `https://dummyjson.com/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("API deletion failed.");
    }

    await response.json();

  } catch (error) {
    setActionError(
      "Product was removed from the dashboard, but API deletion failed."
    );
  }
}

 return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-rose-50 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1">
        <Header />

        <section className="p-6">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                color={stat.color}
              />
            ))}
          </div>

          {/* Product List */}
          <div className="mt-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Product List
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your store products
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700"
              >
                + Add Product
              </button>
            </div>

            {/* Search, Filter and Sort */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-violet-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            {actionError && (
              <p className="mb-4 rounded-lg bg-rose-100 p-3 text-sm text-rose-700">
                {actionError}
                </p>
            )}
            {/* Reusable DataTable Component */}

            <DataTable
            columns={productColumns}
            data={filteredProducts}
            loading={loading}
            error={apiError}
            onEdit={openEditModal}
            onDelete={deleteProduct}
            />

            <p className="mt-3 text-sm text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </section>
      </main>

     {/* Reusable Modal and Form Components */}
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={editingId !== null ? "Edit Product" : "Add Product"}
  description="Enter the product details below."
>
  <Form
    onSubmit={handleSubmit}
    onCancel={() => setIsModalOpen(false)}
    saving={saving}
    submitText={editingId !== null ? "Save Changes" : "Add Product"}
  >
    {/* Product Name */}
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Product Name
      </label>

      <input
        required
        type="text"
        value={form.name}
        onChange={(event) =>
          setForm({ ...form, name: event.target.value })
        }
        placeholder="e.g. Laptop"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />

      {errors.name && (
        <p className="mt-1 text-sm text-rose-600">
          {errors.name}
        </p>
      )}
    </div>

    {/* Category */}
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Category
      </label>

      <input
        required
        type="text"
        value={form.category}
        onChange={(event) =>
          setForm({ ...form, category: event.target.value })
        }
        placeholder="e.g. Electronics"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />

      {errors.category && (
        <p className="mt-1 text-sm text-rose-600">
          {errors.category}
        </p>
      )}
    </div>

    {/* Price and Stock */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Price (₹)
        </label>

        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: event.target.value })
          }
          placeholder="999"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        {errors.price && (
          <p className="mt-1 text-sm text-rose-600">
            {errors.price}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Stock
        </label>

        <input
          required
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={(event) =>
            setForm({ ...form, stock: event.target.value })
          }
          placeholder="10"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        {errors.stock && (
          <p className="mt-1 text-sm text-rose-600">
            {errors.stock}
          </p>
        )}
      </div>
    </div>
  </Form>
</Modal>
    </div>
  )
}