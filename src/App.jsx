
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

const products = [
  {
    id: 1,
    name: "Running Shoes",
    category: "Footwear",
    price: 1999,
    stock: 25,
  },
  {
    id: 2,
    name: "Backpack",
    category: "Bags",
    price: 1299,
    stock: 15,
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    stock: 8,
  },
  {
    id: 4,
    name: "Water Bottle",
    category: "Accessories",
    price: 499,
    stock: 40,
  },
  {
    id: 5,
    name: "Headphones",
    category: "Electronics",
    price: 2499,
    stock: 12,
  },
];

export default function App() {
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
      onClick={() => alert("Add Product feature coming soon!")}
      className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-violet-700"
    >
      + Add Product
    </button>
  </div>

  <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-white shadow-sm">
    <table className="w-full min-w-[650px] text-left text-sm">
      <thead className="bg-violet-100 text-slate-700">
        <tr>
          <th className="px-5 py-4">ID</th>
          <th className="px-5 py-4">Product Name</th>
          <th className="px-5 py-4">Category</th>
          <th className="px-5 py-4">Price</th>
          <th className="px-5 py-4">Stock</th>
          <th className="px-5 py-4">Status</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
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

            <td className="px-5 py-4">
              {product.stock}
            </td>

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
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <p className="mt-3 text-sm text-slate-500">
    Showing {products.length} products
  </p>
</div>
        </section>
      </main>
    </div>
  )
}