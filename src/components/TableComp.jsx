export default function TableComp({ columns, data, className = "" }) {
  return (
    <div className={`w-full ${className}`}>

      {/* ================= TABLE (ALL SCREEN) ================= */}
      <div className="rounded-2xl shadow-sm bg-white overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          
          <thead>
            <tr className="bg-primary text-white">
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{ width: column.width }}
                  className="px-6 py-5 font-semibold text-sm whitespace-nowrap
                  first:rounded-tl-2xl last:rounded-tr-2xl"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50/50 transition-colors border border-primary/20"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      style={{ width: column.width }}
                      className={`px-6 py-4 text-sm font-medium text-text-main whitespace-nowrap
                        ${column.align === "center" ? "text-center" : ""}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-text-muted italic"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}