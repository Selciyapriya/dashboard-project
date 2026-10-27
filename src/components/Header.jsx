
export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-violet-100 bg-white/90 px-6 py-5 shadow-sm backdrop-blur">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome to your workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-36 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500 sm:w-52"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
          S
        </div>
      </div>
    </header>
  )
}