import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { UsersIcon, EyeIcon, PrintIcon } from "../components/icons";

export default function Family() {
    const data = useMemo(
        () => [
            {
                id: 1,
                name: "Juzar Fakhruddin Anjarwala",
                its: "23058631",
                hof_its: "23058631",
                sector: "MOHAMMEDI",
                mobile: "+91 78457889564",
                sabeel: 4236,
                sabeel_due: 1256,
                sabeel_overdue: 1000,
                establishments: [
                    { id: 1, name: "ALFA ENTERPRISES", due: 600 },
                    { id: 2, name: "ARBEN TOOLS CO.", due: 1000 },
                ],
                avatarUrl: "https://i.pravatar.cc/160?img=12",
                sabeelYearWise: [
                    { year: "2025-26", sabeel: 4236, due: 1256 },
                    { year: "2024-25", sabeel: 4236, due: 1256 },
                    { year: "2023-24", sabeel: 4236, due: 1256 },
                ],
            },
            {
                id: 2,
                name: "Juzar Fakhruddin Anjarwala",
                its: "23058632",
                hof_its: "23058631",
                sector: "MOHAMMEDI",
                mobile: "+91 78457889564",
                sabeel: 4236,
                sabeel_due: 1212,
                sabeel_overdue: 1000,
                establishments: [{ id: 3, name: "ZED INDUSTRIES", due: 800 }],
                avatarUrl: "https://i.pravatar.cc/160?img=14",
                sabeelYearWise: [
                    { year: "2025-26", sabeel: 4236, due: 1212 },
                    { year: "2024-25", sabeel: 4236, due: 1212 },
                ],
            },
            {
                id: 3,
                name: "Juzar Fakhruddin Anjarwala",
                its: "23058633",
                hof_its: "23058631",
                sector: "SAIFI",
                mobile: "+91 78457889564",
                sabeel: 4236,
                sabeel_due: 1220,
                sabeel_overdue: 1000,
                establishments: [],
                avatarUrl: "https://i.pravatar.cc/160?img=18",
                sabeelYearWise: [{ year: "2025-26", sabeel: 4236, due: 1220 }],
            },
            {
                id: 4,
                name: "Juzar Fakhruddin Anjarwala",
                its: "23058633",
                hof_its: "23058631",
                sector: "SAIFI",
                mobile: "+91 78457889564",
                sabeel: 4236,
                sabeel_due: 1220,
                sabeel_overdue: 1000,
                establishments: [],
                avatarUrl: "https://i.pravatar.cc/160?img=18",
                sabeelYearWise: [{ year: "2025-26", sabeel: 4236, due: 1220 }],
            },
            {
                id: 5,
                name: "Juzar Fakhruddin Anjarwala",
                its: "23058633",
                hof_its: "23058631",
                sector: "SAIFI",
                mobile: "+91 78457889564",
                sabeel: 4236,
                sabeel_due: 1220,
                sabeel_overdue: 1000,
                establishments: [],
                avatarUrl: "https://i.pravatar.cc/160?img=18",
                sabeelYearWise: [{ year: "2025-26", sabeel: 4236, due: 1220 }],
            },
        ],
        []
    );
    const sabeelColumns = useMemo(
        () => [
            { key: "year", header: "Year", width: 90 },
            {
                key: "sabeel",
                header: "Sabeel",
                render: (r) => <span className="font-semibold text-sky-700">{r.sabeel}</span>,
            },
            {
                key: "due",
                header: "Due",
                render: (r) => `₹ ${r.due}`,
            },
        ],
        []
    );

    const establishmentColumns = useMemo(
        () => [
            {
                key: "name",
                header: "Establishment",
                render: (r) => <span className="font-semibold text-sky-800">{r.name}</span>,
            },
            {
                key: "due",
                header: "Due",
                width: 90,
                render: (r) => `₹ ${r.due}`,
            },
            {
                key: "action",
                header: "Action",
                width: 70,
                render: () => (
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
                        <EyeIcon className="w-4 h-4" />
                    </button>
                ),
            },
        ],
        []
    );


    const sectorOptions = useMemo(() => {
        const set = new Set(data.map((d) => d.sector));
        return ["All", ...Array.from(set)];
    }, [data]);

    const [search, setSearch] = useState("");
    const [sector, setSector] = useState("All");
    const [sort, setSort] = useState("az");
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    const handleSectorChange = (val) => {
        setSector(val);
        setPage(1);
    };

    const handleSortChange = (val) => {
        setSort(val);
        setPage(1);
    };

    const [page, setPage] = useState(2);
    const pageSize = 10;

    const [selectedId, setSelectedId] = useState(data?.[0]?.id ?? null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let rows = data.filter((r) => {
            const matchSearch =
                !q ||
                r.name.toLowerCase().includes(q) ||
                r.its.toLowerCase().includes(q) ||
                r.mobile.toLowerCase().includes(q);

            const matchSector = sector === "All" ? true : r.sector === sector;

            return matchSearch && matchSector;
        });

        rows.sort((a, b) => {
            if (sort === "az") return a.name.localeCompare(b.name);
            if (sort === "za") return b.name.localeCompare(a.name);
            return 0;
        });

        return rows;
    }, [data, search, sector, sort]);

    useEffect(() => {
        setPage(1);
    }, [search, sector, sort]);


    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

    const selected = useMemo(() => {
        const found = filtered.find((x) => x.id === selectedId);
        return found || filtered[0] || null;
    }, [filtered, selectedId]);

    const columns = useMemo(
        () => [
            {
                key: "check",
                header: <input type="checkbox" />,
                width: 40,
                render: () => (
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                ),
            },
            {
                key: "name",
                header: "Name",
                render: (r) => (
                    <div className="flex items-start gap-3">
                        <img
                            src={r.avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                            <div className="font-semibold text-slate-800">{r.name}</div>
                            <div className="text-xs text-slate-600">
                                ITS: {r.its}
                                <br />
                                HOF: {r.hof_its}
                                <br />
                                Sector: {r.sector}
                                <br />
                                Mobile: {r.mobile}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "sabeel",
                header: "Sabeel",
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div>
                            <span className="font-semibold">Sabeel:</span>{" "}
                            <span className="text-sky-700 font-semibold">{r.sabeel}</span>
                        </div>
                        <div>
                            Due:{" "}
                            <span className="text-slate-900 font-semibold">
                                ₹ {r.sabeel_due}
                            </span>
                        </div>
                        <div>
                            Overdue:{" "}
                            <span className="text-rose-600 font-semibold">
                                ₹ {r.sabeel_overdue}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                key: "est",
                header: "Establishment",
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div>
                            <span className="font-semibold">Establishment:</span>{" "}
                            <span className="text-sky-700 font-semibold">
                                {r.establishments?.length || 0}
                            </span>
                        </div>
                        <div>Due: ₹ {sumDue(r.establishments)}</div>
                        <div>Overdue: ₹ 00</div>
                    </div>
                ),
            },
            {
                key: "action",
                header: "Action",
                render: (r) => (
                    <button
                        className="inline-flex items-center gap-2 rounded-full bg-sky-700 hover:bg-sky-800 text-white px-3 py-1.5 text-xs font-semibold"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(r.id);
                        }}
                    >
                        <EyeIcon className="w-4 h-4" />
                        Quick View
                    </button>
                ),
            },
        ],
        [setSelectedId]
    );

    return (
        <DashboardLayout title="Family">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Mumeneen</div>

                        <button className="inline-flex items-center gap-2 rounded-lg bg-sky-900/60 hover:bg-sky-900/70 text-white px-3 py-2 text-xs font-semibold">
                            <UsersIcon className="w-4 h-4" />
                            Add New family
                        </button>
                    </div>

                    {/* Reusable filters */}
                    <FilterBar
                        search={search}
                        onSearchChange={handleSearchChange}
                        selects={[
                            {
                                value: sector,
                                onChange: handleSectorChange,
                                width: 180,
                                options: sectorOptions.map((s) => ({
                                    label: s === "All" ? "Select Sector" : s,
                                    value: s,
                                })),
                            },
                            {
                                value: sort,
                                onChange: handleSortChange,
                                width: 220,
                                options: [
                                    { label: "Sort by Alphabetic (A-Z)", value: "az" },
                                    { label: "Sort by Alphabetic (Z-A)", value: "za" },
                                ],
                            },
                        ]}
                    />

                    {/* Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 px-4 pb-4">
                        {/* Left table */}
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={pagedData}
                                rowKey="id"
                                onRowClick={(row) => setSelectedId(row.id)}
                                selectedRowKey={selected?.id}
                                stickyHeader={true}
                                height="520px"   // ✅ adjust once (try 560px if needed)
                                footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0"
                            style={{ height: "520px" }}>
                            {/* ✅ Profile (fixed) */}
                            <div className="p-4 shrink-0">
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                        <img
                                            src={selected?.avatarUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-semibold text-slate-900 leading-tight">
                                            {selected?.name || "No Selection"}
                                        </div>

                                        <div className="text-xs text-slate-600 mt-1">
                                            Email:{" "}
                                            <span className="text-sky-700 font-semibold">
                                                {selected ? `Hof.mail.${selected.its}@Gmail.Com` : "-"}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                                                <PrintIcon className="w-4 h-4" />
                                                Print Profile
                                            </button>

                                            <button className="inline-flex items-center gap-2 rounded-lg bg-sky-700 text-white px-3 py-2 text-xs font-semibold hover:bg-sky-800">
                                                <EyeIcon className="w-4 h-4" />
                                                View full Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {/* ✅ ONLY THIS PART SCROLLS */}
                            <div className="flex-1 overflow-auto min-h-0 p-4 space-y-6 scroll-hover">
                                {/* Sabeel Details */}
                                <div>
                                    <div className="font-semibold text-slate-800 mb-2">Sabeel Details</div>

                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        <DataTable
                                            columns={sabeelColumns}
                                            data={selected?.sabeelYearWise || []}
                                            rowKey={(row) => row.year}
                                            stickyHeader={false}
                                            tableClassName="border-0 shadow-none rounded-none"
                                        />
                                    </div>
                                </div>

                                {/* Establishment Details */}
                                <div>
                                    <div className="font-semibold text-slate-800 mb-2">Establishment Details</div>

                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        {(selected?.establishments || []).length === 0 ? (
                                            <div className="px-3 py-3 text-xs text-slate-500 bg-white">
                                                No establishments
                                            </div>
                                        ) : (
                                            <DataTable
                                                columns={establishmentColumns}
                                                data={selected?.establishments || []}
                                                rowKey="id"
                                                stickyHeader={false}
                                                tableClassName="border-0 shadow-none rounded-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end grid */}
                </div>
            </div>
        </DashboardLayout>
    );
}

/* ===== helpers ===== */
function Divider() {
    return <div className="h-px bg-slate-100" />;
}

function sumDue(list = []) {
    return (list || []).reduce((s, x) => s + (Number(x.due) || 0), 0);
}
