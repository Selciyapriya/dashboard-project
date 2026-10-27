
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
        </section>
      </main>
    </div>
  )
}