import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { UsersIcon, EyeIcon } from "../components/icons";
import Loader from "../components/Loader";
import { retrieveFamilyApi } from "../services/familyService";

import AddFamilyModal from "../components/modals/AddFamilyModal";
import SuccessToast from "../components/SuccessToast";  // Success Toast
import ErrorToast from "../components/ErrorToast";    // Error Toast
import { createFamilyApi } from "../services/familyService"; // Service to create family
import { retrieveSectorsApi } from "../services/sectorService";

export default function Family() {
    const { search: qs } = useLocation();
    const queryFilter = useMemo(() => {
        const p = new URLSearchParams(qs);
        return (p.get("filter") || "").trim();
    }, [qs]);

    // API state
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        count: 0,
        total: 0,
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // Filters + paging
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(""); // due/prev_due/new_takhmeen_pending/not_tagged/service

    const [sector, setSector] = useState("All");
    const [sectorOptions, setSectorOptions] = useState(["All"]);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const offset = (page - 1) * pageSize;

    // Selected (right-side details)
    const [selectedId, setSelectedId] = useState(null);

    const [openAddFamily, setOpenAddFamily] = useState(false); // to open/close modal
    const [toastOk, setToastOk] = useState({ show: false, message: "" });
    const [toastErr, setToastErr] = useState({ show: false, message: "" });

    const handleSaveFamily = async (payload) => {
        try {
            // Call the create family API service
            const res = await createFamilyApi(payload);

            if (res?.code === 200) {
                setToastOk({ show: true, message: "Family created successfully!" });

                // Optionally, re-fetch the family list or update the local state with the new data

                // Close the modal
                setOpenAddFamily(false);
            } else {
                setToastErr({ show: true, message: res?.message || "Failed to create family" });
                setOpenAddFamily(true);
            }
        } catch (e) {
            setToastErr({ show: true, message: e?.message || "Failed to create family" });
        }
    };

    const allowed = new Set(["due", "prev_due", "new_takhmeen_pending", "not_tagged", "service"]);
    useEffect(() => {
        if (!allowed.has(queryFilter)) return;
        setFilter(queryFilter);
        setPage(1);
        setSelectedId(null);
        setSearch("");
    }, [queryFilter]);


    // Fetch API
    const fetchFamilies = async () => {
        try {
            setLoading(true);
            setApiError("");

            const res = await retrieveFamilyApi({
                search: search.trim(),
                sector: sector === "All" ? "" : sector,
                filter: filter || "",
                limit: pageSize,
                offset,
            });

            // res example:
            // { code, status, message, data:[...], pagination:{limit,offset,count,total} }

            const apiRows = Array.isArray(res?.data) ? res.data : [];
            setRows(apiRows);

            setPagination({
                limit: res?.pagination?.limit ?? pageSize,
                offset: res?.pagination?.offset ?? offset,
                count: res?.pagination?.count ?? apiRows.length,
                total: res?.pagination?.total ?? apiRows.length,
            });

            // select first row by default if none selected
            if (apiRows.length && !selectedId) {
                setSelectedId(apiRows[0]?.id ?? null);
            }
        } catch (e) {
            setApiError(e?.message || "Failed to fetch family list");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await retrieveSectorsApi();

                // res.data = [{id, name}, ...]
                const names = (Array.isArray(res?.data) ? res.data : [])
                    .map((x) => String(x?.name || "").trim())
                    .filter(Boolean);

                // unique + sorted (optional)
                const unique = Array.from(new Set(names));

                setSectorOptions(["All", ...unique]);
            } catch (e) {
                // fallback (keep All only)
                setSectorOptions(["All"]);
                console.error("Sector fetch failed:", e?.message);
            }
        };

        fetchSectors();
    }, []);

    // Fetch when filters/page changes
    useEffect(() => {
        fetchFamilies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, sector, filter, page]);

    const selected = useMemo(() => {
        const found = (rows || []).find((x) => String(x.id) === String(selectedId));
        return found || rows[0] || null;
    }, [rows, selectedId]);

    // Client-side sort (optional)
    const viewRows = useMemo(() => rows || [], [rows]);

    // Columns
    const sabeelColumns = useMemo(
        () => [
            { key: "year", header: "Year", width: 90 },
            {
                key: "sabeel",
                header: "Sabeel",
                render: (r) => <span className="font-semibold text-sky-700"> ₹{r.sabeel}</span>,
            },
            {
                key: "due",
                header: "Due",
                render: (r) => `₹${r.due}`,
            },
        ],
        []
    );
    const establishmentColumns = useMemo(
        () => [
            {
                key: "name",
                header: "Establishment",
                render: (r) => <span className="font-semibold text-sky-800">{r.name || "-"}</span>,
            },
            {
                key: "due",
                header: "Due",
                width: 90,
                render: (r) => `₹${r.due}`,
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
    const columns = useMemo(
        () => [
            {
                key: "check",
                header: <input type="checkbox" />,
                width: 40,
                render: () => <input type="checkbox" onClick={(e) => e.stopPropagation()} />,
            },
            {
                key: "name",
                header: "Name",
                render: (r) => (
                    <div className="flex items-start gap-3">
                        <img
                            src={r.url || "https://i.pravatar.cc/160?img=12"}
                            alt=""
                            className="w-12 h-16 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                            <div className="font-semibold text-slate-800">{r.name}</div>
                            <div className="text-xs text-slate-600">
                                ITS: {r.its}
                                <br />
                                {/* API doesn’t send hof_its separately - if you need HOF, add it in API */}
                                Sector: {r.sector}
                                <br />
                                Mobile: {r.mobile || "-"}
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
                            <span className="text-sky-700 font-semibold"> ₹{r?.sabeel?.sabeel ?? 0}</span>
                        </div>
                        <div>
                            Due:{" "}
                            <span className="text-slate-900 font-semibold">₹{r?.sabeel?.due ?? 0}</span>
                        </div>
                        <div>
                            Prev Due:{" "}
                            <span className="text-rose-600 font-semibold">₹{r?.sabeel?.prev_due ?? 0}</span>
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
                                ₹{(r.establishment?.sabeel ?? 0)}
                            </span>
                        </div>
                        <div>Due: ₹{r?.establishment?.due ?? 0}</div>
                        <div>Prev Due: ₹{r?.establishment?.prev_due ?? 0}</div>
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

    // Pagination derived from API total
    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    // Handlers
    const handleSearchChange = (val) => {
        setSearch(val);
        setFilter("");     // ✅ optional
        setPage(1);
    };
    const handleSectorChange = (val) => {
        setSector(val);
        setFilter("");     // ✅ optional
        setPage(1);
    };
    const handleFilterChange = (val) => {
        setFilter(val);
        setPage(1);
    };

    return (
        <DashboardLayout title="Family">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Mumeneen</div>

                        <button className="inline-flex items-center gap-2 rounded-lg bg-sky-900/60 hover:bg-sky-900/70 text-white px-3 py-2 text-xs font-semibold"
                            onClick={() => setOpenAddFamily(true)}
                        >
                            <UsersIcon className="w-4 h-4" />
                            Add New family
                        </button>
                    </div>

                    {/* API error (simple) */}
                    {apiError ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

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
                                value: filter,
                                onChange: handleFilterChange,
                                width: 220,
                                options: [
                                    { label: "All Filters", value: "" },
                                    { label: "Due", value: "due" },
                                    { label: "Prev Due", value: "prev_due" },
                                    { label: "New Takhmeen Pending", value: "new_takhmeen_pending" },
                                    { label: "Not Tagged", value: "not_tagged" },
                                    { label: "Service", value: "service" },
                                ],
                            },
                        ]}
                        rightSlot={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => alert("Download Visible (demo)")}
                                    className="inline-flex items-center justify-center rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                >
                                    Download Visible
                                </button>

                                <button
                                    type="button"
                                    onClick={() => alert("Download All (demo)")}
                                    className="inline-flex items-center justify-center rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                >
                                    Download All
                                </button>
                            </div>
                        }
                    />

                    {/* Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 px-4 pb-4">
                        {/* Left table */}
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                    <Loader fullScreen={false} text="Loading receipts..." />
                                </div>
                            ) : null}
                            <DataTable
                                columns={columns}
                                data={viewRows}
                                rowKey={(r) => `${r.id}-${r.family_id || r.its}`}
                                onRowClick={(row) => setSelectedId(row.id)}
                                selectedRowKey={selected?.id}
                                stickyHeader={true}
                                height="520px"
                                footer={
                                    <div className="flex items-center justify-between gap-3 px-3 py-2">
                                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />

                                        <div className="text-xs text-slate-600 whitespace-nowrap">
                                            {loading ? "Loading..." : `Showing ${pagination.count || 0} of ${pagination.total || 0}`}
                                        </div>
                                    </div>
                                }
                            />
                        </div>

                        {/* Right: Details */}
                        <div
                            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0"
                            style={{ height: "520px" }}
                        >
                            {/* Profile (fixed) */}
                            <div className="p-4 shrink-0">
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                        <img
                                            src={selected?.url || "../src/assets/images/placeholder.png"}
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
                                                {selected?.email || "-"}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            {/* <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                                                <PrintIcon className="w-4 h-4" />
                                                Print Profile
                                            </button> */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!selected?.id) return;
                                                    navigate(`/family/${selected.family_id}`); // ✅ go to details page
                                                }}
                                                className="inline-flex items-center gap-2 rounded-lg bg-sky-700 text-white px-3 py-2 text-xs font-semibold hover:bg-sky-800"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                View full Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {/* ONLY THIS PART SCROLLS */}
                            <div className="flex-1 overflow-auto min-h-0 p-4 space-y-6 scroll-hover">
                                {/* Sabeel Details */}
                                <div>
                                    <div className="font-semibold text-slate-800 mb-2">Sabeel Details</div>

                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        <DataTable
                                            columns={sabeelColumns}
                                            data={selected?.sabeel_details || []}
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
                                        {(selected?.establishment_details || []).length === 0 ? (
                                            <div className="px-3 py-3 text-xs text-slate-500 bg-white">No establishments</div>
                                        ) : (
                                            <DataTable
                                                columns={establishmentColumns}
                                                data={selected?.establishment_details || []}
                                                rowKey={(r) => `${r.establishment_id}-${r.name || ""}-${r.due || 0}`}
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
            <AddFamilyModal
                open={openAddFamily}
                onClose={() => setOpenAddFamily(false)}
                onSave={handleSaveFamily} // This will trigger the save logic
                sectorOptions={sectorOptions.filter((s) => s !== "All")}
            />
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
        </DashboardLayout>
    );
}

/* ===== helpers ===== */
function Divider() {
    return <div className="h-px bg-slate-100" />;
}
