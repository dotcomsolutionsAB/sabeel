import PropTypes from "prop-types";
import { AddIcon, EyeIcon, TrashIcon } from "../../components/icons";

function money(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}

export default function SabeelDetailsTab({
    rows = [],
    onAdd,
    onView,
    onDelete,
}) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            {/* Top right button */}
            <div className="p-4 flex items-center justify-end">
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-900 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-950"
                >
                    <AddIcon className="w-4 h-4" />
                    Add Sabeel
                </button>
            </div>

            {/* Table */}
            <div className="px-4 pb-4">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-sky-100">
                            <tr className="text-slate-700">
                                <th className="text-left px-4 py-3 font-bold">Year</th>
                                <th className="text-left px-4 py-3 font-bold">Sabeel</th>
                                <th className="text-left px-4 py-3 font-bold">Due</th>
                                <th className="text-right px-4 py-3 font-bold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows?.length ? (
                                rows.map((r, idx) => (
                                    <tr key={`${r?.year || "y"}-${idx}`} className="border-t">
                                        <td className="px-4 py-3">{r?.year || "-"}</td>

                                        <td className="px-4 py-3 text-sky-700 font-semibold">
                                            {money(r?.sabeel)}
                                        </td>

                                        <td className="px-4 py-3">₹ {money(r?.due)}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onView?.(r)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-sky-200 bg-white hover:bg-sky-50 text-sky-700"
                                                    title="View"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete?.(r)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-6 text-slate-500" colSpan={4}>
                                        No sabeel details found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

SabeelDetailsTab.propTypes = {
    rows: PropTypes.array,
    onAdd: PropTypes.func,
    onView: PropTypes.func,
    onDelete: PropTypes.func,
};
