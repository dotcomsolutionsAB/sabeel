export default function DataTable({ columns, rows, height = "h-72" }) {
    return (
        <div className={`border rounded-xl overflow-hidden bg-white ${height}`}>
            <div className="h-full overflow-auto">
                <table className="w-full text-sm sabeel-table">
                    <thead className="sticky top-0 z-10">
                        <tr>
                            {columns.map((c) => (
                                <th key={c} className="text-left px-3 py-2 border-b">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, idx) => (
                            <tr key={idx} className="odd:bg-white even:bg-gray-50">
                                {r.map((cell, i) => (
                                    <td key={i} className="px-3 py-2 border-b">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
