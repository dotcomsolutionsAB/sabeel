import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layout/DashboardLayout";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { retrieveDepositsApi } from "../services/depositService";

// If you don’t have PrintIcon, replace with any icon or plain text
import { EyeIcon } from "../components/icons"; // <- replace this with PrintIcon if you have

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

            const apiRows = Array.isArray(json?.data) ? json.data : [];
            setRows(apiRows.map((r) => ({ ...r, id: String(r.id) })));

            setPagination({
                limit: json?.pagination?.limit ?? pageSize,
                offset: json?.pagination?.offset ?? offset,
                count: json?.pagination?.count ?? apiRows.length,
                total: json?.pagination?.total ?? apiRows.length,
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
    const handlePrint = (deposit) => {
        // Option A: route to print page (recommended later)
        // navigate(`/deposits/${deposit?.id}/print`);

        // Option B: quick print popup (simple now)
        const receiptNos = joinReceiptNos(deposit?.receipt_details);

        const html = `
            <html>
            <head>
              <title>Deposit Print</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 24px; }
                h2 { margin: 0 0 8px; }
                .meta { margin: 0 0 16px; color: #334155; font-size: 13px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 13px; text-align: left; }
                th { background: #f1f5f9; }
              </style>
            </head>
            <body>
              <h2>Deposit</h2>
              <div class="meta">
                <div><b>Deposit ID:</b> ${deposit?.deposit_id || "-"}</div>
                <div><b>Date:</b> ${deposit?.date || "-"}</div>
                <div><b>Amount:</b> ₹ ${formatINR(deposit?.amount)}</div>
                <div><b>Created By:</b> ${deposit?.created_by?.name || "-"}</div>
                <div><b>Remarks:</b> ${deposit?.remarks || "-"}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Receipt No</th>
                  </tr>
                </thead>
                <tbody>
                  ${receiptNos
                .map(
                    (no, idx) => `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${no}</td>
                      </tr>
                    `
                )
                .join("")}
                </tbody>
              </table>

              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
            </html>
        `;

        const w = window.open("", "_blank", "width=900,height=650");
        if (!w) return;
        w.document.open();
        w.document.write(html);
        w.document.close();
    };

    // columns
    const columns = useMemo(
        () => [
            {
                key: "deposit_id",
                header: "Deposit",
                width: 220,
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-900">#{r?.deposit_id || "-"}</div>
                        <div className="text-slate-600">Date: {r?.date || "-"}</div>
                    </div>
                ),
            },
            {
                key: "receipts",
                header: "Receipts",
                width: 360,
                render: (r) => {
                    const receiptNos = joinReceiptNos(r?.receipt_details);
                    const first = receiptNos.slice(0, 3);
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
                                        +{more} more
                                    </span>
                                ) : null}
                            </div>

                            <div className="text-[11px] text-slate-500 mt-1">
                                Total receipts: <span className="font-semibold">{receiptNos.length}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                key: "amount",
                header: "Amount",
                width: 130,
                render: (r) => <div className="text-xs font-semibold">₹ {formatINR(r?.amount)}</div>,
            },
            {
                key: "created_by",
                header: "Created By",
                width: 180,
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div className="font-semibold">{r?.created_by?.name || "-"}</div>
                        <div className="text-slate-500">ID: {r?.created_by?.id ?? "-"}</div>
                    </div>
                ),
            },
            {
                key: "remarks",
                header: "Remarks",
                width: 260,
                render: (r) => (
                    <div className="text-xs text-slate-700 line-clamp-2">{r?.remarks || "-"}</div>
                ),
            },
            {
                key: "actions",
                header: "Actions",
                width: 120,
                render: (r) => (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrint(r);
                            }}
                            title="Print"
                        >
                            {/* Replace EyeIcon with PrintIcon if you have */}
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pagination]
    );

    return (
        <DashboardLayout title="Deposites">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* top header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Deposites</div>
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
                            <div className="text-xs text-slate-700">
                                Total: <span className="font-semibold">{pagination.total || 0}</span>
                            </div>
                        }
                    />

                    <div className="px-4 pb-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden relative">
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
