import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import { createReceiptApi, retrieveReceiptsApi } from "../../services/receiptService";
import { AddIcon } from "../../components/icons";
import AddReceiptModal from "../../components/modals/AddReceiptModal"; // Import your AddReceiptModal component
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";

function formatINR(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function money(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}
function unwrap(res) {
    return res?.data && res?.data?.code !== undefined ? res.data : res;
}

export default function OverviewTab({ id, overview }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // top search (only UI search like screenshot)
    const [q, setQ] = useState("");

    // selection like screenshot
    const [selected, setSelected] = useState(() => new Set());

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [openAddReceipt, setOpenAddReceipt] = useState(false);
    const [toastOk, setToastOk] = useState({ show: false, message: "" });
    const [toastErr, setToastErr] = useState({ show: false, message: "" });

    // Function to open the modal when "Add Receipt" is clicked
    const handleAddReceipt = () => {
        setOpenAddReceipt(true); // Set the modal state to true to open it
    };
    const handleCloseAddReceipt = () => {
        setOpenAddReceipt(false); // Set the modal state to false to close it
    };
    const handleSaveReceipt = async (payload) => {
        console.log("Saving receipt with payload:", payload);
        if (payload?.__error) {
            setToastErr({ show: true, message: payload.__error });
            return;
        }

        try {
            const res = await createReceiptApi(payload);

            if (res?.code === 200) {
                setToastOk({ show: true, message: res?.message || "Receipt created successfully" });

                // ✅ refresh receipts list
                await fetchReceipts({ limit: setPagination.limit || 10, offset: 0 });
            } else {
                setToastErr({ show: true, message: res?.message || "Failed to create receipt" });
            }
        } catch (e) {
            setToastErr({ show: true, message: e?.message || "Failed to create receipt" });
        }
    };

    const [pagination, setPagination] = useState({ limit: pageSize, offset: 0, count: 0, total: 0 });

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            setApiError("");

            const res = await retrieveReceiptsApi({
                type: "establishment",
                establishment_id: id,
                date_from: "",
                date_to: "",
                limit: pageSize,
                offset,
            });

            const json = unwrap(res);

            const apiRows = Array.isArray(json?.data) ? json.data : [];
            setRows(apiRows.map((r) => ({ ...r, id: String(r.id) })));

            setPagination({
                limit: json?.pagination?.limit ?? pageSize,
                offset: json?.pagination?.offset ?? offset,
                count: json?.pagination?.count ?? apiRows.length,
                total: json?.pagination?.total ?? apiRows.length,
            });

            // reset selection on page fetch
            setSelected(new Set());
        } catch (e) {
            setApiError(e?.message || "Failed to fetch receipts");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
            setSelected(new Set());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchReceipts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, page]);

    // client-side search
    const viewRows = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;
        return rows.filter((r) => {
            const text = `${r?.receipt_no || ""} ${r?.mode || ""} ${r?.year || ""} ${r?.date || ""}`.toLowerCase();
            return text.includes(s);
        });
    }, [rows, q]);

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    const toggleOne = (rowId, checked) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (checked) next.add(rowId);
            else next.delete(rowId);
            return next;
        });
    };

    const isAllOnPageSelected = viewRows.length > 0 && viewRows.every((r) => selected.has(r.id));
    const toggleAll = (checked) => {
        setSelected(() => {
            if (!checked) return new Set();
            return new Set(viewRows.map((r) => r.id));
        });
    };

    const columns = useMemo(
        () => [
            {
                key: "_sel",
                header: (
                    <input
                        type="checkbox"
                        checked={isAllOnPageSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                    />
                ),
                width: 60,
                render: (r) => (
                    <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={(e) => toggleOne(r.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
            },
            {
                key: "receipt_details",
                header: "Receipt Details",
                width: 260,
                render: (r) => (
                    <div className="text-xs text-slate-700 space-y-0.5">
                        <div>
                            <span className="font-semibold">Receipt No:</span> {r?.receipt_no || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Date:</span> {r?.date || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Year:</span> {r?.year || "-"}
                        </div>
                    </div>
                ),
            },
            {
                key: "payment_details",
                header: "Payment Details",
                width: 360,
                render: (r) => (
                    <div className="text-xs text-slate-700 space-y-0.5">
                        <div>
                            <span className="font-semibold">Type:</span> {(r?.mode || "-").toUpperCase()}
                        </div>

                        {r?.bank ? (
                            <div><span className="font-semibold">Bank Name:</span> {r.bank}</div>
                        ) : null}

                        {r?.cheque_no ? (
                            <div><span className="font-semibold">Cheque No:</span> {r.cheque_no}</div>
                        ) : null}

                        {r?.ifsc ? (
                            <div><span className="font-semibold">IFSC:</span> {r.ifsc}</div>
                        ) : null}

                        {r?.cheque_date ? (
                            <div><span className="font-semibold">Cheque Date:</span> {r.cheque_date}</div>
                        ) : null}

                        {r?.trans_id ? (
                            <div><span className="font-semibold">Transaction ID:</span> {r.trans_id}</div>
                        ) : null}

                        {r?.trans_date ? (
                            <div><span className="font-semibold">Transaction Date:</span> {r.trans_date}</div>
                        ) : null}
                    </div>
                ),
            },
            {
                key: "type",
                header: "Type",
                width: 160,
                render: () => (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700">
                        Establishment
                    </span>
                ),
            },
            {
                key: "amount",
                header: "Amount",
                width: 140,
                render: (r) => <div className="text-xs font-semibold">₹ {formatINR(r?.amount)}</div>,
            },
            {
                key: "actions",
                header: "Actions",
                width: 120,
                render: (r) => (
                    <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-800 text-white hover:bg-sky-900"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("ACTION", r);
                        }}
                        title="Action"
                    >
                        ⤓
                    </button>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selected, viewRows, isAllOnPageSelected]
    );

    const cardSabeel = overview?.establishment?.sabeel || 0;
    const cardDue = overview?.establishment?.due || 0;
    const cardOverdue = overview?.establishment?.prev_due || 0;

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            {/* Cards */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-gradient-to-b from-sky-300 to-sky-700 text-white p-5 text-center">
                        <div className="text-2xl font-extrabold">{money(cardSabeel)}</div>
                        <div className="text-xs font-semibold mt-1">Establishment Sabeel</div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-b from-sky-300 to-sky-700 text-white p-5 text-center">
                        <div className="text-2xl font-extrabold">₹ {money(cardDue)}</div>
                        <div className="text-xs font-semibold mt-1">Establishment Due</div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-b from-sky-300 to-sky-700 text-white p-5 text-center">
                        <div className="text-2xl font-extrabold">₹ {money(cardOverdue)}</div>
                        <div className="text-xs font-semibold mt-1">Establishment Overdue</div>
                    </div>
                </div>
            </div>

            {apiError ? (
                <div className="mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
                    {apiError}
                </div>
            ) : null}

            {/* Search + Selected + Add Receipt row */}
            <div className="px-4 pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-full max-w-sm">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="text-xs text-slate-600">
                            Selected: <span className="font-semibold">{selected.size}</span>
                        </div>

                        {/* Add Receipt Button - Opens the Modal */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-800 text-white px-4 py-2 text-xs font-semibold"
                            onClick={handleAddReceipt} // Calls handleAddReceipt to open the modal
                        >
                            <AddIcon className="w-4 h-4" />
                            Add Receipt
                        </button>

                        {/* AddReceiptModal component - This is where you pass props to the modal */}
                        <AddReceiptModal
                            open={openAddReceipt}             // Controls whether the modal is open
                            onClose={handleCloseAddReceipt}   // Controls closing the modal
                            hofName={overview?.establishment?.name || "-"} // Pass HOF name
                            type="establishment"              // Set type to "establishment" (could be "family" if needed)
                            establishmentId={id}             // Pass the establishment ID to the modal
                            onSave={handleSaveReceipt}        // Function to handle saving the receipt data
                        />
                    </div>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                    {loading ? "Loading..." : null}
                </div>
            </div>

            {/* Table */}
            <div className="px-4 pb-4">
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={viewRows}
                        rowKey="id"
                        stickyHeader
                        height="520px"
                        footer={
                            <div className="flex items-center justify-between px-4 py-3">
                                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                                <div className="text-xs text-slate-600">
                                    Total: <span className="font-semibold">{pagination.total || 0}</span>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>

            <SuccessToast
                show={toastOk.show}
                message={toastOk.message}
                onClose={() => setToastOk({ show: false, message: "" })}
            />

            <ErrorToast
                show={toastErr.show}
                message={toastErr.message}
                onClose={() => setToastErr({ show: false, message: "" })}
            />
        </div>

    );
    // onAddReceipt: PropTypes.func,
}

OverviewTab.propTypes = {
    id: PropTypes.string,
    overview: PropTypes.object,
};
