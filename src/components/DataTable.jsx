export default function DataTable({
    title,
    columns = [],
    data = [],
    rowKey = "id",
    onRowClick,
    selectedRowKey,
    tableClassName = "",
    headerRight,
    stickyHeader = true,

    // ✅ NEW
    headerVariant, // "blue" | "navy" | undefined

    height,
    footer,
}) {
    const headerClass =
        headerVariant === "blue"
            ? "bg-gradient-to-r from-[#6aaedd] to-[#4f90c7] text-white"
            : headerVariant === "navy"
                ? "bg-gradient-to-r from-[#1f5f9a] to-[#13446f] text-white"
                : "bg-slate-50 text-slate-800";

    return (
        <div
            className={`rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0 ${tableClassName}`}
            style={height ? { height } : undefined}
        >
            {(title || headerRight) && (
                <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0 ${headerClass}`}>
                    <div className="font-semibold text-sm">{title}</div>
                    <div>{headerRight}</div>
                </div>
            )}

            {/* body */}
            <div className="flex-1 overflow-auto min-h-0 scroll-hover">
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
                        {data.length === 0 ? (
                            <tr>
                                <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={columns.length || 1}>
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => {
                                const key = typeof rowKey === "function" ? rowKey(row) : row[rowKey];
                                const active = selectedRowKey === key;

                                return (
                                    <tr
                                        key={key}
                                        onClick={() => onRowClick?.(row)}
                                        className={`border-t border-slate-100 ${active ? "bg-sky-50" : "bg-white"} ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                                            }`}
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className={`px-3 py-3 align-top ${col.tdClassName || ""}`}>
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {footer ? <div className="shrink-0 bg-white">{footer}</div> : null}
        </div>
    );
}
