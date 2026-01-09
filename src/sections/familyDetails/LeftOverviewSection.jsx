import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import StatTile from "../../components/StatTile";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import { SearchIcon, AddIcon, EyeIcon } from "../../components/icons";

export default function LeftOverviewSection({ stats = [], receipts = [], onAddReceipt }) {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filteredReceipts = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return receipts;
        return receipts.filter((r) =>
            `${r.receiptNo} ${r.date} ${r.year} ${r.type} ${r.mode}`.toLowerCase().includes(s)
        );
    }, [q, receipts]);

    const totalPages = Math.max(1, Math.ceil(filteredReceipts.length / pageSize));
    const paged = filteredReceipts.slice((page - 1) * pageSize, page * pageSize);
    // ✅ Selection state (for checkbox + "Selected" count)
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const selectedCount = selectedIds.size;

    const toggleOne = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const pageIds = useMemo(() => paged.map((r) => r.id), [paged]);

    const allCheckedOnPage = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const someCheckedOnPage = pageIds.some((id) => selectedIds.has(id));

    const toggleAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allCheckedOnPage) {
                pageIds.forEach((id) => next.delete(id));
            } else {
                pageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    };

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

    const receiptColumns = [
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
            key: "receipt",
            header: "Receipt Details",
            render: (r) => (
                <div className="text-xs">
                    <div className="font-semibold text-slate-800">
                        Receipt No: <span className="font-bold">{r.receiptNo}</span>
                    </div>
                    <div className="text-slate-600">Date: {formatIndianDate(r.date)}</div>
                    <div className="text-slate-600">Year: {r.year}</div>
                </div>
            ),
        },
        {
            key: "payment",
            header: "Payment Details",
            render: (r) => (
                <div className="text-xs text-slate-700 space-y-0.5">
                    <div>
                        <span className="font-semibold">Type:</span> {r.mode}
                    </div>
                    {r.bank ? (
                        <div>
                            <span className="font-semibold">Bank Name:</span> {r.bank}
                        </div>
                    ) : null}
                    {r.chequeNo ? (
                        <div>
                            <span className="font-semibold">Cheque No:</span> {r.chequeNo}
                        </div>
                    ) : null}
                    {r.ifsc ? (
                        <div>
                            <span className="font-semibold">IFSC:</span> {r.ifsc}
                        </div>
                    ) : null}
                    {r.chequeDate ? (
                        <div>
                            <span className="font-semibold">Cheque Date:</span> {r.chequeDate}
                        </div>
                    ) : null}
                    {r.txnId ? (
                        <div>
                            <span className="font-semibold">Transaction ID:</span> {r.txnId}
                        </div>
                    ) : null}
                </div>
            ),
        },
        {
            key: "type",
            header: "Type",
            width: 110,
            render: (r) => (
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {r.type}
                </span>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            width: 110,
            render: (r) => <div className="text-xs font-semibold">₹ {r.amount}</div>,
        },
        {
            key: "actions",
            header: "Actions",
            width: 90,
            render: () => (
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
                    <EyeIcon className="w-5 h-5" />
                </button>
            ),
        },
    ];

    return (
        <>
            {/* Stat tiles */}
            <div className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((s, idx) => (
                        <StatTile key={idx} value={s.value} label={s.label} />
                    ))}
                </div>
            </div>

            {/* Search + actions row */}
            <div className="px-4 pb-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                        <input
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setPage(1);
                                setSelectedIds(new Set());
                            }}
                            placeholder="Search ..."
                            className="w-full outline-none text-sm text-slate-700"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-3">

                        <button
                            type="button"
                            onClick={onAddReceipt}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-900 text-white px-3 py-2 text-xs font-semibold hover:bg-sky-950"
                        >
                            <AddIcon className="w-4 h-4" />
                            Add Receipt
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipts table */}
            <div className="px-4 pb-4">
                <DataTable
                    title={null}
                    columns={receiptColumns}
                    data={paged}
                    rowKey="id"
                    stickyHeader={true}
                    height="100%"
                    footer={
                        <div className="flex items-center justify-between gap-3">
                            <Pagination page={page} totalPages={totalPages} onChange={setPage} />

                            <div className="text-xs text-slate-600">
                                Selected: <span className="font-semibold">{selectedCount}</span>
                            </div>
                        </div>
                    }
                />
            </div>
        </>
    );
}

LeftOverviewSection.propTypes = {
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
        })
    ),
    receipts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            receiptNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            date: PropTypes.string,
            year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            type: PropTypes.string,
            mode: PropTypes.string,
            bank: PropTypes.string,
            chequeNo: PropTypes.string,
            ifsc: PropTypes.string,
            chequeDate: PropTypes.string,
            txnId: PropTypes.string,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    onAddReceipt: PropTypes.func,
};

LeftOverviewSection.defaultProps = {
    stats: [],
    receipts: [],
    onAddReceipt: () => { },
};