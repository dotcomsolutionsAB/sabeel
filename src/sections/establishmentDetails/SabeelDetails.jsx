import PropTypes from "prop-types";

function money(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}

export default function SabeelDetailsTab({ sabeelDetails }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="text-sm font-extrabold text-slate-800 mb-3">Sabeel Details</div>

            <div className="rounded-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-xs">
                    <thead className="bg-sky-50">
                        <tr>
                            <th className="text-left px-3 py-2">Year</th>
                            <th className="text-left px-3 py-2">Sabeel</th>
                            <th className="text-left px-3 py-2">Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sabeelDetails || []).map((r, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-3 py-2">{r?.year || "-"}</td>
                                <td className="px-3 py-2 text-sky-700 font-semibold">{money(r?.sabeel)}</td>
                                <td className="px-3 py-2">{money(r?.due)}</td>
                            </tr>
                        ))}
                        {(!sabeelDetails || sabeelDetails.length === 0) ? (
                            <tr><td colSpan={3} className="px-3 py-3 text-slate-500">No data</td></tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

SabeelDetailsTab.propTypes = {
    sabeelDetails: PropTypes.array,
};
