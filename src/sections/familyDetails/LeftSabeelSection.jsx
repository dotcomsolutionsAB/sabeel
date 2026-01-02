import { useMemo } from "react";
import PropTypes from "prop-types";
import DataTable from "../../components/DataTable";
import { AddIcon, EyeIcon, TrashIcon } from "../../components/icons";

export default function LeftSabeelSection({ data = [], onAdd, onView, onDelete }) {
    const columns = useMemo(
        () => [
            { key: "year", header: "Year", width: 140 },
            {
                key: "sabeel",
                header: "Sabeel",
                render: (r) => (
                    <span className="font-semibold text-sky-700">{r.sabeel}</span>
                ),
            },
            {
                key: "due",
                header: "Due",
                render: (r) => <span>₹ {r.due}</span>,
            },
            {
                key: "actions",
                header: "Actions",
                width: 140,
                render: (r) => (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onView?.(r)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-sky-700 text-sky-700 hover:bg-sky-50"
                            title="View"
                        >
                            <EyeIcon className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete?.(r)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white hover:bg-red-700"
                            title="Delete"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [onView, onDelete]
    );

    return (
        <div className="p-4">
            {/* Top-right add button */}
            <div className="flex items-center justify-end mb-4">
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0A4D7A] text-white px-4 py-2 text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                    <AddIcon className="w-4 h-4" />
                    Add Sabeel
                </button>
            </div>

            {/* Table card like screenshot */}
            <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={data}
                    rowKey={(r) => `${r.year}-${r.id ?? r.sabeel}`}
                    stickyHeader={false}
                    tableClassName="border-0 shadow-none rounded-none"
                />
            </div>
        </div>
    );
}

LeftSabeelSection.propTypes = {
    data: PropTypes.array,
    onAdd: PropTypes.func,
    onView: PropTypes.func,
    onDelete: PropTypes.func,
};

LeftSabeelSection.defaultProps = {
    data: [],
    onAdd: () => { },
    onView: () => { },
    onDelete: () => { },
};
