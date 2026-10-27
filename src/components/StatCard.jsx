
export default function StatCard({ title, value, color }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${color}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold opacity-80">
          {title}
        </p>

        <span className="text-2xl">✦</span>
      </div>

      <h2 className="text-4xl font-bold">
        {value}
      </h2>

      <p className="mt-3 text-sm font-medium opacity-80">
        ↑ Updated this week
      </p>
    </div>
  )
}