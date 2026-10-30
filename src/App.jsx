
import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import StatCard from "./components/StatCard"

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

  function handleSubmit(event) {
  event.preventDefault()

  if (!validateForm()) {
    return
  }

  const productData = {
    name: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    stock: Number(form.stock),
  }

  if (editingId !== null) {
    setProducts((current) =>
      current.map((product) =>
        product.id === editingId
          ? { ...product, ...productData }
          : product
      )
    )
  } else {
    const newId =
      Math.max(0, ...products.map((product) => product.id)) + 1

    setProducts((current) => [
      ...current,
      { id: newId, ...productData },
    ])
  }

  setIsModalOpen(false)
  setForm(emptyForm)
  setErrors({})
  setEditingId(null)
}

  function deleteProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (confirmed) {
      setProducts((current) =>
        current.filter((product) => product.id !== id)
      )
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
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.name}
                  </p>
                )}
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

            {/* Products Table */}
            {loading && (
              <p className="py-6 text-center text-violet-600 font-semibold">
               Loading products...
              </p>
            )}

            {apiError && (
              <p className="py-6 text-center text-rose-600">
                {apiError}
              </p>
            )}
            <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-violet-100 text-slate-700">
                  <tr>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 transition hover:bg-violet-50"
                    >
                      <td className="px-5 py-4 text-slate-500">
                        {product.id}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        📦 {product.name}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">{product.stock}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.stock < 10
                              ? "bg-orange-100 text-orange-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.stock < 10 ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No products found. Try another search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </section>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="product-modal-title"
                  className="text-xl font-bold text-slate-800"
                >
                  {editingId !== null ? "Edit Product" : "Add Product"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                
              </div>

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
                  {errors.stocky && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.stock}
                  </p>
                )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-violet-700"
                >
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}