export default function DataTable({
    // ✅ old props (dashboard)
    title,
    headVariant = "blue",
    rows = [],
    onExport,

    // ✅ new props (generic mode)
    columns,
    data,
    rowKey = "id",
    onRowClick,
    selectedRowKey,
    tableClassName = "",
    headerRight,
    stickyHeader = true,
}) {
    // ---------- GENERIC MODE ----------
    if (Array.isArray(columns) && Array.isArray(data)) {
        return (
            <div className={`rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden ${tableClassName}`}>
                {(title || headerRight) && (
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="font-semibold text-slate-800 text-sm">{title}</div>
                        <div>{headerRight}</div>
                    </div>
                )}

                <div className="max-h-[520px] overflow-auto">
                    <table className="w-full text-sm">
                        <thead className={stickyHeader ? "sticky top-0 z-10 bg-slate-50" : "bg-slate-50"}>
                            <tr className="text-slate-600">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-3 py-3 text-left font-semibold ${col.thClassName || ""}`}
                                        style={col.width ? { width: col.width } : undefined}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((row) => {
                                const key = typeof rowKey === "function" ? rowKey(row) : row[rowKey];
                                const active = selectedRowKey === key;

                                return (
                                    <tr
                                        key={key}
                                        onClick={() => onRowClick?.(row)}
                                        className={`border-t border-slate-100 ${active ? "bg-sky-50" : "bg-white"
                                            } ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}`}
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className={`px-3 py-3 align-top ${col.tdClassName || ""}`}>
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // ---------- OLD MODE (your existing dashboard table) ----------
    return (
        <div className="table-card">
            <div className={`table-head ${headVariant}`}>{title}</div>

            <table>
                <thead>
                    <tr>
                        <th style={{ width: "30%" }}>Year</th>
                        <th>Due</th>
                        <th style={{ width: "22%", textAlign: "center" }}>Excel Export</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r, idx) => (
                        <tr key={idx}>
                            <td>{r.year}</td>
                            <td>{r.due}</td>
                            <td className="export">
                                <div className="dl" title="Export" onClick={() => onExport?.(r)}>
                                    {/* keep existing icon styling */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 3v12" />
                                        <path d="M7 10l5 5 5-5" />
                                        <path d="M5 21h14" />
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
