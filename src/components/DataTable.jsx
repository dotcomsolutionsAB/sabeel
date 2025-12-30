export default function DataTable({
    title,
    headVariant = "blue", // "blue" | "navy"
    rows = [],
    onExport = () => alert("Excel Export (demo)"),
}) {
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
                                <div className="dl" title="Export" onClick={() => onExport(r)}>
                                    <DownloadIcon />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DownloadIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12"></path>
            <path d="M7 10l5 5 5-5"></path>
            <path d="M5 21h14"></path>
        </svg>
    );
}
