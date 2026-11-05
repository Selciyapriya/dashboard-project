
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = "",
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <p className="py-6 text-center font-semibold text-violet-600">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-6 text-center text-rose-600">
        {error}
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p className="rounded-xl bg-white px-5 py-10 text-center text-slate-500">
        No products available. Try another search or filter.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-white shadow-sm">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-violet-100 text-slate-700">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4">
                {column.label}
              </th>
            ))}

            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-t border-slate-100 transition hover:bg-violet-50"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4">
                  {column.render
                    ? column.render(item)
                    : item[column.key]}
                </td>
              ))}

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(item)}
                    className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete?.(item.id)}
                    className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
