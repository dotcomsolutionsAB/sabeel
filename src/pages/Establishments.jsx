import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { UsersIcon, EyeIcon } from "../components/icons";
import { retrieveEstablishmentsApi } from "../services/establishmentService";
import placeholderImg from "../assets/images/placeholder.png"; // ✅ adjust path if yours differs
import PropTypes from "prop-types";

export default function Establishments() {
    // =========================
    // API state
    // =========================
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        count: 0,
        total: 0,
    });

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // =========================
    // Filters + paging
    // =========================
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(""); // due/prev_due/new_takhmeen_pending/not_tagged/manufacturer
    const [sort, setSort] = useState("az"); // UI sort (client-side)

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    // =========================
    // Selected (checkboxes)
    // =========================
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const selectedCount = selectedIds.size;

    const pageIds = useMemo(() => (rows || []).map((r) => r.id), [rows]);

    const allCheckedOnPage =
        pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const someCheckedOnPage = pageIds.some((id) => selectedIds.has(id));

    const toggleOne = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

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

    // =========================
    // Fetch API
    // =========================
    const fetchEstablishments = async () => {
        try {
            setLoading(true);
            setApiError("");

            const res = await retrieveEstablishmentsApi({
                search: search.trim(),
                filter: filter || "",
                limit: pageSize,
                offset,
            });

            // res: { code, status, message, data:[...], pagination:{...} }
            const apiRows = Array.isArray(res?.data) ? res.data : [];

            // map api -> ui rows
            const mapped = apiRows.map((r) => ({
                id: r?.id,
                establishment_id: r?.establishment_id,
                name: r?.name || "-",
                address: r?.address || "-",
                establishment: {
                    sabeel: r?.establishment?.sabeel ?? "0",
                    due: r?.establishment?.due ?? "0",
                    prev_due: r?.establishment?.prev_due ?? "0",
                },
                partners: Array.isArray(r?.partners) ? r.partners : [],
            }));

            setRows(mapped);

            setPagination({
                limit: res?.pagination?.limit ?? pageSize,
                offset: res?.pagination?.offset ?? offset,
                count: res?.pagination?.count ?? mapped.length,
                total: res?.pagination?.total ?? mapped.length,
            });

            // optional: reset selection on new page/filter search
            setSelectedIds(new Set());
        } catch (e) {
            setApiError(e?.message || "Failed to fetch establishment list");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
            setSelectedIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstablishments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter, page]);

    // =========================
    // Client-side sort (optional)
    // =========================
    const viewRows = useMemo(() => {
        const list = [...(rows || [])];
        list.sort((a, b) => {
            const an = (a?.name || "").toLowerCase();
            const bn = (b?.name || "").toLowerCase();
            if (sort === "az") return an.localeCompare(bn);
            if (sort === "za") return bn.localeCompare(an);
            return 0;
        });
        return list;
    }, [rows, sort]);

    // =========================
    // Columns
    // =========================
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
                key: "establishment",
                header: "Establishment",
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-800 uppercase">
                            {r.name}
                        </div>
                        <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">Address:</span>{" "}
                            {r.address}
                        </div>
                        <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">
                                Establishment ID:
                            </span>{" "}
                            {r.establishment_id || "-"}
                        </div>
                    </div>
                ),
            },

            {
                key: "partner",
                header: "Partner",
                render: (r) => (
                    <PartnersCell partners={r.partners} placeholderImg={placeholderImg} />
                ),
            },

            {
                key: "stats",
                header: "Establishment",
                width: 220,
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div>
                            <span className="font-semibold">Sabeel:</span>{" "}
                            <span className="text-sky-700 font-semibold">
                                {formatINR(r?.establishment?.sabeel ?? 0)}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold">Due:</span> ₹{" "}
                            {formatINR(r?.establishment?.due ?? 0)}
                        </div>
                        <div>
                            <span className="font-semibold">Prev Due:</span> ₹{" "}
                            {formatINR(r?.establishment?.prev_due ?? 0)}
                        </div>
                    </div>
                ),
            },

            {
                key: "action",
                header: "Action",
                width: 90,
                render: () => (
                    <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                ),
            },
        ],
        [allCheckedOnPage, someCheckedOnPage, selectedIds, pageIds]
    );

    // =========================
    // Pagination derived
    // =========================
    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    // =========================
    // Handlers
    // =========================
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };
    const handleFilterChange = (val) => {
        setFilter(val);
        setPage(1);
    };
    const handleSortChange = (val) => setSort(val);

    return (
        <DashboardLayout title="Establishments">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-800 to-sky-500">
                        <div className="text-white font-semibold">Establishments</div>

                        <button className="inline-flex items-center gap-2 rounded-lg bg-sky-900/70 hover:bg-sky-900/80 text-white px-3 py-2 text-xs font-semibold">
                            <UsersIcon className="w-4 h-4" />
                            Add New Establishments
                        </button>
                    </div>

                    {/* Error */}
                    {apiError ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

                    {/* Filters */}
                    <FilterBar
                        search={search}
                        onSearchChange={handleSearchChange}
                        selects={[
                            {
                                value: filter,
                                onChange: handleFilterChange,
                                width: 230,
                                options: [
                                    { label: "All Filters", value: "" },
                                    { label: "Due", value: "due" },
                                    { label: "Prev Due", value: "prev_due" },
                                    { label: "New Takhmeen Pending", value: "new_takhmeen_pending" },
                                    { label: "Not Tagged", value: "not_tagged" },
                                    { label: "Manufacturer", value: "manufacturer" },
                                ],
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
                        rightSlot={
                            <div className="text-xs text-slate-600">
                                Selected: <span className="font-semibold">{selectedCount}</span>
                            </div>
                        }
                    />

                    {/* Table */}
                    <div className="px-4 pb-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={viewRows}
                                rowKey={(r) => `${r.id}-${r.establishment_id || ""}`}
                                stickyHeader={true}
                                height="520px"
                                footer={
                                    <div className="flex items-center justify-between gap-3">
                                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                                        <div className="text-xs text-slate-600">
                                            {loading
                                                ? "Loading..."
                                                : `Showing ${pagination.count || 0} of ${pagination.total || 0}`}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

/*  Partners Cell */
function PartnersCell({ partners = [], placeholderImg }) {
    const list = Array.isArray(partners) ? partners : [];
    const show = list.slice(0, 2);
    const extra = Math.max(0, list.length - show.length);

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
                {show.length === 0 ? (
                    <div className="text-xs text-slate-500">No partners</div>
                ) : (
                    show.map((p, idx) => (
                        <div key={`${p.its || "na"}-${idx}`} className="flex items-start gap-2">
                            <img
                                src={p?.url || placeholderImg}
                                onError={(e) => {
                                    e.currentTarget.src = placeholderImg;
                                }}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50"
                            />
                            <div className="text-[11px] leading-tight">
                                <div className="font-semibold text-slate-800">{p?.name || "-"}</div>
                                <div className="text-slate-600">ITS : {p?.its || "-"}</div>
                                <div className="text-slate-600">Sector : {p?.sector || "-"}</div>
                                <div className="text-slate-600">Mobile : {p?.mobile || "-"}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {extra > 0 ? (
                <button
                    type="button"
                    className="shrink-0 inline-flex items-center rounded-full bg-sky-700 text-white px-3 py-1 text-[11px] font-semibold hover:bg-sky-800"
                    title="View all partners"
                >
                    +{String(extra).padStart(2, "0")} Partner
                </button>
            ) : null}
        </div>
    );
}

/* helpers */
function formatINR(v) {
    const n = Number(String(v ?? "0").replace(/,/g, ""));
    if (!Number.isFinite(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN");
}

PartnersCell.propTypes = {
    partners: PropTypes.array,
    placeholderImg: PropTypes.string,
};

PartnersCell.defaultProps = {
    partners: [],
    placeholderImg: "",
};

