// src/sections/establishmentDetails/Partners.jsx
import { useMemo } from "react";
import PropTypes from "prop-types";

import DataTable from "../../components/DataTable";
import { TrashIcon } from "../../components/icons";
import { UserPlusIcon } from "lucide-react";

function toStr(v) {
    return v == null ? "" : String(v);
}

export default function PartnersTab({
    partners = [],
    selectedCount = 0,
    // onAddOrUpdateOtherJamiat = () => { },
    onAddOrUpdatePartner = () => { },
    onDeletePartner = () => { },
}) {
    const rows = useMemo(() => {
        return (partners || []).map((p, idx) => ({
            ...p,
            _sn: idx + 1, // ✅ used for SL No. (no NaN)
            _rowId: String(p?.id ?? p?.partner_id ?? p?.its ?? `row-${idx}`), // ✅ stable key
        }));
    }, [partners]);

    const columns = useMemo(
        () => [
            {
                key: "sn",
                header: "SL No.",
                width: 60,
                render: (r) => <div className="text-xs text-slate-700">{r?._sn}</div>,
            },
            {
                key: "name",
                header: "Name",
                width: 320,
                render: (r) => (
                    <div className="text-xs font-semibold text-sky-800">
                        {r?.name || "-"}
                    </div>
                ),
            },
            {
                key: "sector",
                header: "Sector",
                width: 180,
                render: (r) => <div className="text-xs text-slate-700">{r?.sector || "-"}</div>,
            },
            {
                key: "action",
                header: "Action",
                width: 120,
                render: (r) => (
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white"
                            title="Delete"
                            onClick={() => onDeletePartner?.(r)}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
            },
        ],
        [onDeletePartner]
    );

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            {/* top buttons like your screenshot */}
            <div className="px-5 py-4 flex items-center justify-end gap-3">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-800 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-900"
                    onClick={onAddOrUpdatePartner}
                >
                    <UserPlusIcon className="w-4 h-4" />
                    Add / Update Partner
                </button>
            </div>

            {/* table */}
            <div className="px-4 pb-4">
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={rows}
                        rowKey="_rowId"
                        stickyHeader={true}
                        height="520px"
                        footer={
                            <div className="px-4 py-3 flex items-center justify-end">
                                <div className="text-xs text-slate-600">
                                    Selected: <span className="font-semibold">{toStr(selectedCount)}</span>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

PartnersTab.propTypes = {
    partners: PropTypes.array,
    selectedCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // onAddOrUpdateOtherJamiat: PropTypes.func,
    onAddOrUpdatePartner: PropTypes.func,
    onDeletePartner: PropTypes.func,
};
