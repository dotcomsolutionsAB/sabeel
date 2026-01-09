import { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { retrieveDepositsApi } from "../services/depositService";
import { PrintIcon } from "../components/icons";

function formatINR(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function joinReceiptNos(details) {
    const list = Array.isArray(details) ? details : [];
    return list.map((x) => x?.receipt_no).filter(Boolean);
}

export default function Deposits() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // filters
    const [receiptNo, setReceiptNo] = useState("");

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({ limit: 10, offset: 0, count: 0, total: 0 });

    // ✅ selection
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const selectedCount = selectedIds.size;

    const pageIds = useMemo(() => (rows || []).map((r) => r.id), [rows]);
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

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            setApiError("");

            const payload = {
                limit: pageSize,
                offset,
                receipt_no: receiptNo?.trim() || "",
            };

            const json = await retrieveDepositsApi(payload);
            console.log("DEPOSITS API JSON =>", json);
            const apiRows = Array.isArray(json?.data)
                ? json.data
                : Array.isArray(json)
                    ? json
                    : [];

            setRows(apiRows.map((r) => ({ ...r, id: String(r.id) })));
            setSelectedIds(new Set());
            const pag = json?.pagination || {};
            setPagination({
                limit: pag?.limit ?? pageSize,
                offset: pag?.offset ?? offset,
                count: pag?.count ?? apiRows.length,
                total: pag?.total ?? apiRows.length,
            });

        } catch (e) {
            setApiError(e?.message || "Failed to fetch deposits");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, receiptNo]);

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));
    // ✅ Print handler (simple version)
    // const handlePrint = (deposit) => {
    //     // Option A: route to print page (recommended later)
    //     // navigate(`/deposits/${deposit?.id}/print`);

    //     // Option B: quick print popup (simple now)
    //     const receiptNos = joinReceiptNos(deposit?.receipt_details);

    //     const html = `
    //         <html>
    //         <head>
    //           <title>Deposit Print</title>
    //           <style>
    //             body { font-family: Arial, sans-serif; padding: 24px; }
    //             h2 { margin: 0 0 8px; }
    //             .meta { margin: 0 0 16px; color: #334155; font-size: 13px; }
    //             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    //             th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 13px; text-align: left; }
    //             th { background: #f1f5f9; }
    //           </style>
    //         </head>
    //         <body>
    //           <h2>Deposit</h2>
    //           <div class="meta">
    //             <div><b>Deposit ID:</b> ${deposit?.deposit_id || "-"}</div>
    //             <div><b>Date:</b> ${deposit?.date || "-"}</div>
    //             <div><b>Amount:</b> ₹ ${formatINR(deposit?.amount)}</div>
    //             <div><b>Created By:</b> ${deposit?.created_by?.name || "-"}</div>
    //             <div><b>Remarks:</b> ${deposit?.remarks || "-"}</div>
    //           </div>

    //           <table>
    //             <thead>
    //               <tr>
    //                 <th>#</th>
    //                 <th>Receipt No</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               ${receiptNos
    //             .map(
    //                 (no, idx) => `
    //                   <tr>
    //                     <td>${idx + 1}</td>
    //                     <td>${no}</td>
    //                   </tr>
    //                 `
    //             )
    //             .join("")}
    //             </tbody>
    //           </table>

    //           <script>
    //             window.onload = function() {
    //               window.print();
    //             }
    //           </script>
    //         </body>
    //         </html>
    //     `;

    //     const w = window.open("", "_blank", "width=900,height=650");
    //     if (!w) return;
    //     w.document.open();
    //     w.document.write(html);
    //     w.document.close();
    // };

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

    // columns
    const columns = useMemo(
        () => [
            // ✅ Checkbox
            {
                key: "check",
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
                width: 40,
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

            // ✅ SL No (based on pagination)
            // {
            //     key: "sl",
            //     header: "SL",
            //     width: 60,
            //     render: (_r, idx) => (
            //         <div className="text-xs text-slate-700 font-semibold">
            //             {offset + idx + 1}
            //         </div>
            //     ),
            // },

            {
                key: "deposit_id",
                header: "Deposit",
                width: 140,
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-900">#{r?.deposit_id || "-"}</div>
                        <div className="text-slate-600">{formatIndianDate(r?.date)}</div>
                    </div>
                ),
            },

            {
                key: "receipts",
                header: "Receipts",
                width: 260,
                render: (r) => {
                    const receiptNos = joinReceiptNos(r?.receipt_details);
                    const first = receiptNos.slice(0, 2);
                    const more = receiptNos.length - first.length;

                    return (
                        <div className="text-xs text-slate-700">
                            <div className="flex flex-wrap gap-1">
                                {first.map((no) => (
                                    <span
                                        key={no}
                                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                                    >
                                        {no}
                                    </span>
                                ))}
                                {more > 0 ? (
                                    <span className="text-[11px] font-semibold text-slate-500">
                                        +{more}
                                    </span>
                                ) : null}
                            </div>

                            <div className="text-[11px] text-slate-500 mt-1">
                                Total: <span className="font-semibold">{receiptNos.length}</span>
                            </div>
                        </div>
                    );
                },
            },

            {
                key: "amount",
                header: "Amount",
                width: 120,
                render: (r) => <div className="text-xs font-semibold">₹ {formatINR(r?.amount)}</div>,
            },

            {
                key: "created_by",
                header: "By",
                width: 160,
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div className="font-semibold line-clamp-1">{r?.created_by?.name || "-"}</div>
                        <div className="text-slate-500 text-[11px]">ID: {r?.created_by?.id ?? "-"}</div>
                    </div>
                ),
            },

            {
                key: "remarks",
                header: "Remarks",
                width: 220,
                render: (r) => (
                    <div className="text-xs text-slate-700 line-clamp-2">{r?.remarks || "-"}</div>
                ),
            },

            {
                key: "actions",
                header: "Print",
                width: 90,
                render: (r) => (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("PRINT CLICK", r);
                            }}
                            title="Print"
                        >
                            {/* ✅ Use PrintIcon if you have */}
                            {/* <PrintIcon className="w-5 h-5" /> */}

                            {/* ✅ Fallback if no PrintIcon */}
                            <PrintIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rows, selectedIds, allCheckedOnPage, someCheckedOnPage, offset]
    );


    return (
        <>
            <div className="px-3 pb-0">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden h-[calc(100vh-110px)] flex flex-col">
                    {/* top header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Deposits</div>
                    </div>

                    {apiError ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

                    <FilterBar
                        search={receiptNo}
                        onSearchChange={(v) => {
                            setReceiptNo(v);
                            setPage(1);
                        }}
                        // no selects needed now
                        selects={[]}
                        rightSlot={
                            <div className="text-xs text-slate-700 flex items-center gap-3">
                                <div>
                                    Total: <span className="font-semibold">{pagination.total || 0}</span>
                                </div>
                                <div>
                                    Selected: <span className="font-semibold">{selectedCount}</span>
                                </div>
                            </div>
                        }

                    />

                    <div className="flex-1 min-h-0 px-4 pb-4">
                        <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden h-full">
                            {loading ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                    <Loader fullScreen={false} text="Loading deposits..." />
                                </div>
                            ) : null}

                            <DataTable
                                columns={columns}
                                data={rows}
                                rowKey="id"
                                stickyHeader={true}
                                height="100%"
                                footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
