
const menuItems = [
  "Dashboard",
  "Analytics",
  "Projects",
  "Tasks",
  "Messages",
  "Settings",
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-violet-950 p-6 text-white">
      <h2 className="mb-10 text-2xl font-bold">
        NovaDash
      </h2>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            className={`block rounded-lg px-4 py-3 transition ${
              item === "Dashboard"
                ? "bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg shadow-indigo-950/30"
                : "hover:bg-slate-800"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  )
}