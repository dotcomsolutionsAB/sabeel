import PropTypes from "prop-types";

export default function PartnersTab({ partners }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="text-sm font-extrabold text-slate-800 mb-3">Partners</div>

            <div className="rounded-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-xs">
                    <thead className="bg-sky-50">
                        <tr>
                            <th className="text-left px-3 py-2">Name</th>
                            <th className="text-left px-3 py-2">ITS</th>
                            <th className="text-left px-3 py-2">Sector</th>
                            <th className="text-left px-3 py-2">Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(partners || []).map((p, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-3 py-2">{p?.name || "-"}</td>
                                <td className="px-3 py-2">{p?.its || "-"}</td>
                                <td className="px-3 py-2">{p?.sector || "-"}</td>
                                <td className="px-3 py-2">{p?.mobile || "-"}</td>
                            </tr>
                        ))}
                        {(!partners || partners.length === 0) ? (
                            <tr><td colSpan={4} className="px-3 py-3 text-slate-500">No partners</td></tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

PartnersTab.propTypes = {
    partners: PropTypes.array,
};
