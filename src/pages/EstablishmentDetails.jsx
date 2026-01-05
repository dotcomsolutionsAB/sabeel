import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";

import { EyeIcon } from "../components/icons"; // if you have, else remove
import { retrieveReceiptsApi } from "../services/receiptService";
import { retrieveEstablishmentOverviewApi } from "../services/establishmentService";

function formatINR(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function EstablishmentDetails() {
    const { id } = useParams(); // ✅ /establishments/:id
    const navigate = useNavigate();

    // tabs
    const [tab, setTab] = useState("overview");

    // right panel overview data
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [overviewError, setOverviewError] = useState("");
    const [overview, setOverview] = useState(null);

    // receipts table
    const [rows, setRows] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableError, setTableError] = useState("");

    // filters
    const [q, setQ] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({
        limit: pageSize,
        offset: 0,
        count: 0,
        total: 0,
    });

    // selection
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const selectedCount = selectedIds.size;

    // ------------------- Fetch Overview (Right panel + cards) -------------------
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setOverviewLoading(true);
                setOverviewError("");

                const res = await retrieveEstablishmentOverviewApi(id);

                // your response: { data: { data: { ... } } }
                const obj = res?.data?.data || res?.data || null;

                setOverview(obj);
            } catch (e) {
                setOverview(null);
                setOverviewError(e?.message || "Failed to fetch establishment overview");
            } finally {
                setOverviewLoading(false);
            }
        })();
    }, [id]);

    // ------------------- Fetch Receipts (Table) -------------------
    const fetchReceipts = async () => {
        try {
            setTableLoading(true);
            setTableError("");

            const res = await retrieveReceiptsApi({
                type: "establishment",
                establishment_id: id, // ✅ as you asked (route param)
                date_from: dateFrom || "",
                date_to: dateTo || "",
                limit: pageSize,
                offset,
            });

            const apiRows = Array.isArray(res?.data) ? res.data : [];
            setRows(apiRows.map((r) => ({ ...r, id: String(r.id) })));

            setPagination({
                limit: res?.pagination?.limit ?? pageSize,
                offset: res?.pagination?.offset ?? offset,
                count: res?.pagination?.count ?? apiRows.length,
                total: res?.pagination?.total ?? apiRows.length,
            });

            setSelectedIds(new Set());
        } catch (e) {
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
            setSelectedIds(new Set());
            setTableError(e?.message || "Failed to fetch receipts");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        if (tab !== "overview") return;
        fetchReceipts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, tab, page, dateFrom, dateTo]);

    // local search (client-side) for current page
    const viewRows = useMemo(() => {
        const list = [...(rows || [])];
        const s = q.trim().toLowerCase();
        if (!s) return list;

        return list.filter((r) => {
            const text = `${r?.receipt_no || ""} ${r?.name || ""} ${r?.mode || ""} ${r?.year || ""}`.toLowerCase();
            return text.includes(s);
        });
    }, [rows, q]);

    // selection helpers
    const pageIds = useMemo(() => (viewRows || []).map((r) => r.id), [viewRows]);
    const allCheckedOnPage = pageIds.length > 0 && pageIds.every((x) => selectedIds.has(x));
    const someCheckedOnPage = pageIds.some((x) => selectedIds.has(x));

    const toggleAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allCheckedOnPage) pageIds.forEach((x) => next.delete(x));
            else pageIds.forEach((x) => next.add(x));
            return next;
        });
    };

    const toggleOne = (id2) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id2)) next.delete(id2);
            else next.add(id2);
            return next;
        });
    };

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

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
                width: 320,
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
                width: 140,
                render: () => (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700">
                        Establishment
                    </span>
                ),
            },
            {
                key: "amount",
                header: "Amount",
                width: 120,
                render: (r) => <div className="text-xs font-semibold">₹ {formatINR(r?.amount)}</div>,
            },
            {
                key: "actions",
                header: "Actions",
                width: 110,
                render: (r) => (
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("VIEW RECEIPT", r);
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

    const stats = overview?.establishment || {};
    const sabeelDetails = Array.isArray(overview?.sabeel_details) ? overview.sabeel_details : [];
    const partners = Array.isArray(overview?.partners) ? overview.partners : [];

    return (
        <DashboardLayout title="Establishment Details">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* top header bar */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
                            title="Back"
                        >
                            ←
                        </button>
                        <div className="text-white font-semibold">Establishment Details</div>
                    </div>

                    {(overviewError || tableError) ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {overviewError || tableError}
                        </div>
                    ) : null}

                    {/* main content */}
                    <div className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
                            {/* LEFT */}
                            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                                {/* title strip */}
                                <div className="px-4 py-3 bg-gradient-to-r from-sky-800 to-sky-500 text-white font-semibold">
                                    Establishment Details
                                </div>

                                {/* tabs */}
                                <div className="px-4 pt-3">
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { key: "overview", label: "Overview" },
                                            { key: "details", label: "Establishment Details" },
                                            { key: "partners", label: "Partners" },
                                            { key: "sabeel", label: "Sabeel Details" },
                                        ].map((t) => (
                                            <button
                                                key={t.key}
                                                type="button"
                                                onClick={() => setTab(t.key)}
                                                className={[
                                                    "px-4 py-2 text-xs font-bold rounded-t-xl border",
                                                    tab === t.key
                                                        ? "bg-sky-800 text-white border-sky-800"
                                                        : "bg-white text-sky-800 border-slate-200 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* OVERVIEW TAB ONLY */}
                                {tab === "overview" ? (
                                    <>
                                        {/* stats cards */}
                                        <div className="px-4 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="rounded-xl bg-gradient-to-b from-sky-200 to-sky-600 text-white p-5 shadow-sm">
                                                    <div className="text-2xl font-extrabold">{formatINR(stats?.sabeel)}</div>
                                                    <div className="text-xs font-semibold mt-1">Establishment Sabeel</div>
                                                </div>

                                                <div className="rounded-xl bg-gradient-to-b from-sky-200 to-sky-600 text-white p-5 shadow-sm">
                                                    <div className="text-2xl font-extrabold">₹ {formatINR(stats?.due)}</div>
                                                    <div className="text-xs font-semibold mt-1">Establishment Due</div>
                                                </div>

                                                <div className="rounded-xl bg-gradient-to-b from-sky-200 to-sky-600 text-white p-5 shadow-sm">
                                                    <div className="text-2xl font-extrabold">₹ {formatINR(stats?.prev_due)}</div>
                                                    <div className="text-xs font-semibold mt-1">Establishment Overdue</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* filters row */}
                                        <div className="px-4 pb-3">
                                            <div className="flex flex-wrap items-end gap-3">
                                                <div className="w-full md:w-[260px]">
                                                    <div className="text-xs font-semibold text-slate-700 mb-1">Search</div>
                                                    <input
                                                        value={q}
                                                        onChange={(e) => {
                                                            setQ(e.target.value);
                                                            setSelectedIds(new Set());
                                                        }}
                                                        placeholder="Search..."
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="text-xs font-semibold text-slate-700 mb-1">Date From</div>
                                                    <input
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => {
                                                            setDateFrom(e.target.value);
                                                            setPage(1);
                                                        }}
                                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="text-xs font-semibold text-slate-700 mb-1">Date To</div>
                                                    <input
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => {
                                                            setDateTo(e.target.value);
                                                            setPage(1);
                                                        }}
                                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDateFrom("");
                                                        setDateTo("");
                                                        setPage(1);
                                                    }}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    Clear Dates
                                                </button>

                                                <div className="ml-auto flex items-center gap-3">
                                                    <div className="text-xs text-slate-700">
                                                        Selected: <span className="font-semibold">{selectedCount}</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-lg bg-sky-800 hover:bg-sky-900 text-white px-4 py-2 text-xs font-semibold"
                                                        onClick={() => console.log("ADD RECEIPT")}
                                                    >
                                                        + Add Receipt
                                                    </button>
                                                </div>
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
                                                    footer={
                                                        <div className="flex items-center justify-between px-4 py-3">
                                                            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                                                            <div className="text-xs text-slate-600">
                                                                {tableLoading ? "Loading..." : (
                                                                    <>
                                                                        Total: <span className="font-semibold">{pagination.total || 0}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-6 text-sm text-slate-600">
                                        This tab will be implemented next: <span className="font-semibold">{tab}</span>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT */}
                            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4">
                                    {/* profile card */}
                                    <div className="rounded-xl border border-slate-100 bg-white shadow-sm p-4">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 border">
                                                {overview?.url ? (
                                                    <img src={overview.url} alt="" className="w-full h-full object-cover" />
                                                ) : null}
                                            </div>

                                            <div className="mt-3 font-extrabold text-slate-900">
                                                {overview?.name || (overviewLoading ? "Loading..." : "-")}
                                            </div>

                                            <div className="mt-2 text-xs text-slate-600">
                                                {overview?.address || "-"}
                                            </div>

                                            <div className="mt-3 w-full text-left text-xs text-slate-700 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Establishment ID</span>
                                                    <span>{overview?.establishment_id || id || "-"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Total Sabeel</span>
                                                    <span>{formatINR(stats?.sabeel)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Due</span>
                                                    <span>₹ {formatINR(stats?.due)}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="mt-4 w-full rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold py-2"
                                                onClick={() => console.log("CLOSE ESTABLISHMENT")}
                                            >
                                                ✕ Close Establishment
                                            </button>
                                        </div>
                                    </div>

                                    {/* sabeel details mini table */}
                                    <div className="mt-4 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 flex items-center justify-between">
                                            <div className="font-bold text-sm text-slate-900">Sabeel Details</div>
                                            <button
                                                type="button"
                                                onClick={() => setTab("sabeel")}
                                                className="text-xs font-semibold text-sky-700 hover:underline"
                                            >
                                                View All
                                            </button>
                                        </div>

                                        <div className="px-4 pb-3">
                                            <div className="grid grid-cols-3 text-xs font-bold text-slate-700 border-b py-2">
                                                <div>Year</div>
                                                <div className="text-center">Sabeel</div>
                                                <div className="text-right">Due</div>
                                            </div>

                                            {(sabeelDetails || []).slice(0, 3).map((x, idx) => (
                                                <div key={idx} className="grid grid-cols-3 text-xs text-slate-700 py-2 border-b last:border-b-0">
                                                    <div>{x?.year || "-"}</div>
                                                    <div className="text-center text-sky-700 font-semibold">{formatINR(x?.sabeel)}</div>
                                                    <div className="text-right">₹ {formatINR(x?.due)}</div>
                                                </div>
                                            ))}

                                            {!sabeelDetails?.length ? (
                                                <div className="py-3 text-xs text-slate-500">No data</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* partners mini table */}
                                    <div className="mt-4 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 font-bold text-sm text-slate-900">Partners</div>

                                        <div className="px-4 pb-3">
                                            <div className="grid grid-cols-[1fr_120px_60px] text-xs font-bold text-slate-700 border-b py-2">
                                                <div>Name</div>
                                                <div className="text-center">Sector</div>
                                                <div className="text-right">Action</div>
                                            </div>

                                            {(partners || []).slice(0, 3).map((p, idx) => (
                                                <div key={idx} className="grid grid-cols-[1fr_120px_60px] text-xs text-slate-700 py-2 border-b last:border-b-0 items-center">
                                                    <div className="line-clamp-1">{p?.name || "-"}</div>
                                                    <div className="text-center">{p?.sector || "-"}</div>
                                                    <div className="text-right">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-100 text-sky-700"
                                                            onClick={() => console.log("VIEW PARTNER", p)}
                                                            title="View"
                                                        >
                                                            👁
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {!partners?.length ? (
                                                <div className="py-3 text-xs text-slate-500">No partners</div>
                                            ) : null}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {(overviewLoading || tableLoading) ? (
                            <div className="mt-3 text-xs text-slate-600">
                                Loading...
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
