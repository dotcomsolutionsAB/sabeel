import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

import { EyeIcon, EditIcon, TrashIcon } from "../components/icons";
import { retrieveReceiptsApi } from "../services/receiptService";

function formatINR(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Receipts() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // ✅ Filters
    const [q, setQ] = useState(""); // local search (API doesn't support search)
    const [type, setType] = useState("family"); // default family
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({ limit: 10, offset: 0, count: 0, total: 0 });

    // ✅ selection
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const selectedCount = selectedIds.size;

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
                width: 220,
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
                width: 230,
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
                width: 280,
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
                                <span className="font-semibold">Cheque Date:</span> {r.cheque_date}
                            </div>
                        ) : null}

                        {r?.trans_id ? (
                            <div>
                                <span className="font-semibold">Transaction ID:</span> {r.trans_id}
                            </div>
                        ) : null}

                        {r?.trans_date ? (
                            <div>
                                <span className="font-semibold">Transaction Date:</span> {r.trans_date}
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
                width: 130,
                render: (r) => (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-sky-200 bg-white hover:bg-sky-50 text-sky-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("EDIT", r);
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
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                // ✅ open details page
                                // if family receipt -> go family details; if establishment -> go establishment details
                                if (r?.type === "family") navigate(`/family/${r?.family_id || r?.id}`);
                                else navigate(`/establishments/${r?.establishment_id || r?.id}`);
                            }}
                            title="View"
                        >
                            <EyeIcon className="w-5 h-5" />
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
        <DashboardLayout title="Receipts">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
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
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-slate-700">
                                    Selected: <span className="font-semibold">{selectedCount}</span>
                                </div>

                                {selectedCount > 0 ? (
                                    <>
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

                    {/* date range row */}
                    <div className="px-4 pb-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="text-xs font-semibold text-slate-700">Date From</div>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                            />

                            <div className="text-xs font-semibold text-slate-700">Date To</div>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
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

                    {/* table */}
                    <div className="px-4 pb-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">

                            <DataTable
                                columns={columns}
                                data={viewRows}
                                rowKey="id"
                                stickyHeader={true}
                                height="520px"
                                footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
