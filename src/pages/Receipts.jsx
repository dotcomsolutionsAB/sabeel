import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { EditIcon, TrashIcon, PrintIcon } from "../components/icons";
import EditReceiptModal from "../components/modals/EditReceiptModal";
import { retrieveReceiptsApi, printReceiptApi } from "../services/receiptService";
import { createDepositApi } from "../services/depositService";
import CreateDepositModal from "../components/modals/CreateDepositModal";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";

function formatINR(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Receipts() {
    // const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // ✅ Filters
    const [q, setQ] = useState(""); // local search (API doesn't support search)
    const [type, setType] = useState("family"); // default family
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({ limit: 10, offset: 0, count: 0, total: 0 });

    // ✅ selection
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const selectedCount = selectedIds.size;

    const [depositOpen, setDepositOpen] = useState(false);
    const [depositLoading, setDepositLoading] = useState(false);

    const [successToast, setSuccessToast] = useState({ show: false, message: "" });
    const [errorToast, setErrorToast] = useState({ show: false, message: "" });

    // total amount of SELECTED rows (from rows in current page data)
    const selectedTotalAmount = useMemo(() => {
        if (!rows?.length || selectedIds.size === 0) return 0;
        let sum = 0;
        for (const r of rows) {
            if (selectedIds.has(String(r.id))) sum += Number(r?.amount || 0);
        }
        return sum;
    }, [rows, selectedIds]);

    const formatIndianDate = (v) => {
        if (!v) return "-";
        const d = new Date(v); // works for "YYYY-MM-DD" or ISO strings
        if (Number.isNaN(d.getTime())) return "-";
        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(d); // dd/mm/yyyy
    };

    const handlePrintReceipt = async (row) => {
        try {
            const id = row?.id; // already string in your mapping
            if (!id) throw new Error("Invalid receipt id");

            const res = await printReceiptApi(id);

            const url = res?.data?.pdf_url;
            if (!url) throw new Error("PDF URL not found in response");

            window.open(url, "_blank", "noopener,noreferrer");
        } catch (e) {
            setErrorToast({
                show: true,
                message: e?.message || "Failed to print receipt",
            });
        }
    };


    const fetchReceipts = async () => {

        try {
            setLoading(true);
            setApiError("");

            const res = await retrieveReceiptsApi({
                type: type || "family",
                date_from: dateFrom || "",
                date_to: dateTo || "",
                limit: pageSize,
                offset,
            });

            // ✅ handle both cases:
            const json = res;
            const apiRows = Array.isArray(json?.data) ? json.data : [];
            setRows(apiRows.map(r => ({ ...r, id: String(r.id) })));

            setPagination({
                limit: json?.pagination?.limit ?? pageSize,
                offset: json?.pagination?.offset ?? offset,
                count: json?.pagination?.count ?? apiRows.length,
                total: json?.pagination?.total ?? apiRows.length,
            });

            console.log("res type:", Array.isArray(res) ? "ARRAY" : typeof res, res);
            setSelectedIds(new Set());
        } catch (e) {
            setApiError(e?.message || "Failed to fetch receipts");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
            setSelectedIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, dateFrom, dateTo, page]);

    // ✅ client-side search in current page results (since API has no search)
    const viewRows = useMemo(() => {
        const list = [...(rows || [])];

        const s = q.trim().toLowerCase();
        if (!s) return list;

        return list.filter((r) => {
            const text = `${r?.name || ""} ${r?.its || ""} ${r?.receipt_no || ""} ${r?.mode || ""} ${r?.year || ""}`.toLowerCase();
            return text.includes(s);
        });
    }, [rows, q]);

    // ✅ selection helpers
    const pageIds = useMemo(() => (viewRows || []).map((r) => r.id), [viewRows]);
    const allCheckedOnPage = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const someCheckedOnPage = pageIds.some((id) => selectedIds.has(id));

    const toggleAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allCheckedOnPage) pageIds.forEach((id) => next.delete(id));
            else pageIds.forEach((id) => next.add(id));
            return next;
        });
    };

    const toggleOne = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // ✅ Columns (fixed widths so they do NOT change)
    const columns = useMemo(
        () => [
            {
                key: "check",
                width: 40,
                header: (
                    <input
                        type="checkbox"
                        checked={allCheckedOnPage}
                        ref={(el) => {
                            if (el) el.indeterminate = !allCheckedOnPage && someCheckedOnPage;
                        }}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleAllOnPage();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
                render: (r) => (
                    <input
                        type="checkbox"
                        checked={selectedIds.has(r.id)}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleOne(r.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
            },
            {
                key: "name",
                header: "Name",
                width: 160,
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{r?.name || "-"}</div>
                        <div className="text-slate-600">ITS : {r?.its || "-"}</div>
                    </div>
                ),
            },
            {
                key: "receipt_details",
                header: "Receipt Details",
                width: 180,
                render: (r) => (
                    <div className="text-xs text-slate-700 space-y-0.5">
                        <div>
                            <span className="font-semibold">Receipt No:</span> {r?.receipt_no || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Date:</span> {formatIndianDate(r?.date)}
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
                width: 220,
                render: (r) => (
                    <div className="text-xs text-slate-700 space-y-0.5">
                        <div>
                            <span className="font-semibold">Type:</span> {(r?.mode || "-").toUpperCase()}
                        </div>

                        {r?.bank ? (
                            <div>
                                <span className="font-semibold">Bank Name:</span> {r.bank}
                            </div>
                        ) : null}

                        {r?.cheque_no ? (
                            <div>
                                <span className="font-semibold">Cheque No:</span> {r.cheque_no}
                            </div>
                        ) : null}

                        {r?.ifsc ? (
                            <div>
                                <span className="font-semibold">IFSC:</span> {r.ifsc}
                            </div>
                        ) : null}

                        {r?.cheque_date ? (
                            <div>
                                <span className="font-semibold">Cheque Date:</span> {formatIndianDate(r.cheque_date)}
                            </div>
                        ) : null}

                        {r?.trans_id ? (
                            <div>
                                <span className="font-semibold">Transaction ID:</span> {r.trans_id}
                            </div>
                        ) : null}

                        {r?.trans_date ? (
                            <div>
                                <span className="font-semibold">Transaction Date:</span> {formatIndianDate(r.trans_date)}
                            </div>
                        ) : null}
                    </div>
                ),
            },
            {
                key: "type",
                header: "Type",
                width: 120,
                render: (r) => (
                    <span
                        className={[
                            "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold",
                            r?.type === "family"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-sky-100 text-sky-700",
                        ].join(" ")}
                    >
                        {r?.type === "family" ? "Personal" : "Establishment"}
                    </span>
                ),
            },
            {
                key: "amount",
                header: "Amount",
                width: 110,
                render: (r) => <div className="text-xs font-semibold">₹ {formatINR(r?.amount)}</div>,
            },
            {
                key: "actions",
                header: "Actions",
                width: 120,
                render: (r) => (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-sky-200 bg-white hover:bg-sky-50 text-sky-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditRow(r);
                                setEditOpen(true);

                            }}
                            title="Edit"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("DELETE", r);
                            }}
                            title="Delete"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrintReceipt(r);
                            }}
                            title="Print"
                        >
                            <PrintIcon className="w-5 h-5" />
                        </button>

                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [allCheckedOnPage, someCheckedOnPage, selectedIds, viewRows]
    );

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    return (
        <>
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden h-[calc(100vh-110px)] flex flex-col">
                    {/* top header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Receipts</div>
                    </div>

                    {apiError ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

                    {/* Filter bar: Search + Type */}
                    <FilterBar
                        search={q}
                        onSearchChange={(v) => {
                            setQ(v);
                            setSelectedIds(new Set());
                        }}
                        selects={[
                            {
                                value: type,
                                onChange: (v) => {
                                    setType(v);
                                    setPage(1);
                                    setSelectedIds(new Set());
                                },
                                width: 220,
                                options: [
                                    { label: "Select Type", value: "" },
                                    { label: "Family", value: "family" },
                                    { label: "Establishment", value: "establishment" },
                                ],
                            },
                        ]}
                        rightSlot={
                            <div className="flex items-center gap-1">
                                {/* date range row */}
                                <div className="px-4 pb-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-xs font-semibold text-slate-700">From</div>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e.target.value);
                                                setPage(1);
                                                setSelectedIds(new Set());
                                            }}
                                        />


                                        <div className="text-xs font-semibold text-slate-700">To</div>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => {
                                                setDateTo(e.target.value);
                                                setPage(1);
                                                setSelectedIds(new Set());
                                            }}
                                        />


                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDateFrom("");
                                                setDateTo("");
                                                setPage(1);
                                            }}
                                            className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Clear Dates
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-700">
                                    Selected: <span className="font-semibold">{selectedCount}</span>
                                </div>

                                {selectedCount > 0 ? (
                                    <>
                                        <button
                                            type="button"
                                            className="rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                            onClick={() => setDepositOpen(true)}
                                        >
                                            Create Deposite
                                        </button>

                                        <button
                                            type="button"
                                            className="rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                            onClick={() => console.log("Download Visible (selected ids)", Array.from(selectedIds))}
                                        >
                                            Download Visible
                                        </button>

                                        <button
                                            type="button"
                                            className="rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                            onClick={() => console.log("Download All")}
                                        >
                                            Download All
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-xs text-slate-600">{loading ? "Loading..." : ""}</div>
                                )}
                            </div>
                        }
                    />

                    {/* table */}
                    <div className="flex-1 min-h-0 px-4 pb-4">
                        <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden h-full">
                            {loading ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                    <Loader fullScreen={false} text="Loading receipts..." />
                                </div>
                            ) : null}
                            <DataTable
                                columns={columns}
                                data={viewRows}
                                rowKey="id"
                                stickyHeader={true}
                                height="100%"
                                footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <EditReceiptModal
                open={editOpen}
                receipt={editRow}
                onClose={() => {
                    setEditOpen(false);
                    setEditRow(null);
                }}
                onSave={async (payload) => {
                    // ✅ for now just log (next step we connect API update)
                    console.log("SAVE PAYLOAD", payload);

                    setEditOpen(false);
                    setEditRow(null);

                    // refresh list (optional)
                    fetchReceipts();
                }}
            />

            <CreateDepositModal
                open={depositOpen}
                onClose={() => setDepositOpen(false)}
                receiptIds={Array.from(selectedIds)}
                totalAmount={selectedTotalAmount}
                loading={depositLoading}
                onConfirm={async ({ remarks }) => {
                    try {
                        if (selectedIds.size === 0) return;

                        setDepositLoading(true);
                        setErrorToast({ show: false, message: "" });

                        const payload = {
                            date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
                            receipt_ids: Array.from(selectedIds).join(","),
                            amount: Number(selectedTotalAmount || 0),
                            remarks: remarks || "",
                        };

                        const res = await createDepositApi(payload);

                        // success toast
                        setSuccessToast({
                            show: true,
                            message: res?.message || "Deposit created successfully.",
                        });

                        setDepositOpen(false);
                        setSelectedIds(new Set());

                        // refresh
                        fetchReceipts();
                    } catch (e) {
                        setErrorToast({
                            show: true,
                            message: e?.response?.data?.message || e?.message || "Failed to create deposit",
                        });
                    } finally {
                        setDepositLoading(false);
                    }
                }}
            />

            <SuccessToast
                show={successToast.show}
                message={successToast.message}
                onClose={() => setSuccessToast({ show: false, message: "" })}
            />
            <ErrorToast
                show={errorToast.show}
                message={errorToast.message}
                onClose={() => setErrorToast({ show: false, message: "" })}
            />
        </>
    );
}
