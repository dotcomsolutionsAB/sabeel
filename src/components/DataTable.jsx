import PropTypes from "prop-types";

export default function DataTable({
    title, columns = [], data = [], rowKey = "id", onRowClick, selectedRowKey, tableClassName = "", headerRight,
    stickyHeader = true, headerVariant, height, footer,
}) {
    const headerClass =
        headerVariant === "blue"
            ? "bg-gradient-to-r from-[#6aaedd] to-[#4f90c7] text-white"
            : headerVariant === "navy"
                ? "bg-gradient-to-r from-[#1f5f9a] to-[#13446f] text-white"
                : "bg-slate-50 text-slate-800";

    return (
        <div
            className={`w-full rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0 ${tableClassName}`}
            style={height ? { height } : undefined}
        >
            {(title || headerRight) && (
                <div
                    className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0 ${headerClass}`}
                >
                    <div className="font-semibold text-sm">{title}</div>
                    <div>{headerRight}</div>
                </div>
            )}

            {/* body */}
            <div className="flex-1 overflow-auto min-h-0 scroll-hover">
                <table className="w-full text-sm table-fixed">
                    <thead className={stickyHeader ? "sticky top-0 z-10 bg-slate-50" : "bg-slate-50"}>
                        <tr className="text-slate-600">
                            {columns.map((col, i) => (
                                <th
                                    key={`${col.key ?? "col"}-${i}`}
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
                                <td
                                    className="px-3 py-6 text-center text-sm text-slate-500"
                                    colSpan={columns.length || 1}
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rIndex) => {
                                const rawKey = typeof rowKey === "function" ? rowKey(row) : row?.[rowKey];
                                const key = rawKey ?? `row-${rIndex}`;
                                const active = selectedRowKey === rawKey;

                                return (
                                    <tr
                                        key={key}
                                        onClick={() => onRowClick?.(row)}
                                        className={`border-t border-slate-100 ${active ? "bg-sky-50" : "bg-white"
                                            } ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}`}
                                    >
                                        {columns.map((col, i) => (
                                            <td
                                                key={`${col.key ?? "col"}-${i}`}
                                                className={`px-3 py-3 align-top ${col.tdClassName || ""}`}
                                            >
                                                {col.render ? col.render(row) : row?.[col.key]}
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

DataTable.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.any, // string/number
            header: PropTypes.node,
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            thClassName: PropTypes.string,
            tdClassName: PropTypes.string,
            render: PropTypes.func,
        })
    ),
    data: PropTypes.array,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onRowClick: PropTypes.func,
    selectedRowKey: PropTypes.any,
    tableClassName: PropTypes.string,
    headerRight: PropTypes.node,
    stickyHeader: PropTypes.bool,
    headerVariant: PropTypes.oneOf(["blue", "navy"]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    footer: PropTypes.node,
};

DataTable.defaultProps = {
    columns: [],
    data: [],
    rowKey: "id",
    tableClassName: "",
    stickyHeader: true,
};
