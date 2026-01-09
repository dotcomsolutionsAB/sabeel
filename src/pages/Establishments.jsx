import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import DashboardLayout from "../layout/DashboardLayout";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import placeholderImg from "../assets/images/placeholder.png";
import { EyeIcon, AddIcon } from "../components/icons";

import { retrieveEstablishmentsApi } from "../services/establishmentService";
import AllPartnersModal from "../components/modals/AllPartnersModal";
import AddEstablishmentModal from "../components/modals/AddEstablishmentModal";
import PropTypes from "prop-types";

export default function Establishments() {
    const navigate = useNavigate();
    const { search: qs } = useLocation();

    const queryFilter = useMemo(() => {
        const p = new URLSearchParams(qs);
        return (p.get("filter") || "").trim();
    }, [qs]);

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({ limit: 10, offset: 0, count: 0, total: 0 });

    // ✅ selection
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const selectedCount = selectedIds.size;

    // ✅ partners modal
    const [openPartners, setOpenPartners] = useState(false);
    const [partnersList, setPartnersList] = useState([]);

    // ✅ add establishment modal
    const [openAddEst, setOpenAddEst] = useState(false);
    const [estForm, setEstForm] = useState({ name: "", address: "" });

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

            const apiRows = Array.isArray(res?.data) ? res.data : [];
            setRows(apiRows);

            setPagination({
                limit: res?.pagination?.limit ?? pageSize,
                offset: res?.pagination?.offset ?? offset,
                count: res?.pagination?.count ?? apiRows.length,
                total: res?.pagination?.total ?? apiRows.length,
            });

            // clear selection on new load
            setSelectedIds(new Set());
        } catch (e) {
            setApiError(e?.message || "Failed to fetch establishments");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
            setSelectedIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    const allowed = useMemo(
        () => new Set(["due", "prev_due", "new_takhmeen_pending", "not_tagged", "manufacturer"]),
        []
    );

    // ✅ apply query filter (?filter=...)
    useEffect(() => {
        if (!allowed.has(queryFilter)) return;

        setFilter(queryFilter);
        setPage(1);
        setSearch(""); // recommended (reset search)
        setSelectedIds(new Set());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryFilter]);

    // ✅ fetch when search/filter/page changes
    useEffect(() => {
        fetchEstablishments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter, page]);

    const viewRows = useMemo(() => rows || [], [rows]);

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

    function PartnersCell({ partners = [] }) {
        const list = Array.isArray(partners) ? partners : [];
        const show = list.slice(0, 2);
        const extra = Math.max(0, list.length - show.length);

        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-4">
                    {show.length === 0 ? (
                        <div className="text-xs text-slate-500">No partners</div>
                    ) : (
                        show.map((p, idx) => (
                            <div key={`${p?.its || "na"}-${idx}`} className="flex items-start gap-2">
                                <img
                                    src={p?.url || placeholderImg}
                                    onError={(e) => (e.currentTarget.src = placeholderImg)}
                                    alt=""
                                    className="w-10 h-15 rounded-lg object-cover border border-slate-200 bg-slate-50"
                                />
                                <div className="min-w-0 text-[11px] leading-tight">
                                    <div className="font-semibold text-slate-800 truncate">{p?.name || "-"}</div>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            setPartnersList(list);
                            setOpenPartners(true);
                        }}
                    >
                        +{String(extra).padStart(2, "0")} Partner
                    </button>
                ) : null}
            </div>
        );
    }
    PartnersCell.propTypes = { partners: PropTypes.array };
    PartnersCell.defaultProps = { partners: [] };

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
                header: "Establishment",
                width: 280,
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-900">{r?.name || "-"}</div>
                        <div className="text-slate-600">{r?.address || "-"}</div>
                        <div className="text-slate-600">Est. ID: {r?.establishment_id || "-"}</div>
                    </div>
                ),
            },
            {
                key: "partners",
                header: "Partner",
                width: 500,
                render: (r) => <PartnersCell partners={r?.partners || []} />,
            },
            {
                key: "est",
                header: "Establishment",
                width: 220,
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        <div>
                            Establishment:{" "}
                            <span className="text-sky-700 font-semibold">{r?.establishment?.sabeel ?? 0}</span>
                        </div>
                        <div>Due: ₹ {r?.establishment?.due ?? 0}</div>
                        <div>Overdue: ₹ {r?.establishment?.prev_due ?? 0}</div>
                    </div>
                ),
            },
            {
                key: "action",
                header: "Action",
                width: 90,
                render: (r) => (
                    <button
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = r?.establishment_id;
                            if (!id) return;
                            navigate(`/establishments/${id}`);
                        }}
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [allCheckedOnPage, someCheckedOnPage, selectedIds, navigate, viewRows]
    );

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    return (
        <>
            <div className="px-3 pb-4">
                {/* ✅ full available height + flex column */}
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden h-[calc(100vh-110px)] flex flex-col">
                    {/* ✅ Header (fixed height) */}
                    <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Establishments</div>

                        <button
                            type="button"
                            onClick={() => {
                                setEstForm({ name: "", address: "" });
                                setOpenAddEst(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-900/60 hover:bg-sky-900/70 text-white px-3 py-2 text-xs font-semibold"
                        >
                            <AddIcon className="w-4 h-4" />
                            Add New Establishments
                        </button>
                    </div>

                    {/* ✅ error (fixed height) */}
                    {apiError ? (
                        <div className="shrink-0 px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

                    {/* ✅ FilterBar (fixed height) */}
                    <div className="shrink-0">
                        <FilterBar
                            search={search}
                            onSearchChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            selects={[
                                {
                                    value: filter,
                                    onChange: (v) => {
                                        setFilter(v);
                                        setPage(1);
                                    },
                                    width: 220,
                                    options: [
                                        { label: "All Filters", value: "" },
                                        { label: "Due", value: "due" },
                                        { label: "Prev Due", value: "prev_due" },
                                        { label: "New Takhmeen Pending", value: "new_takhmeen_pending" },
                                        { label: "Not Tagged", value: "not_tagged" },
                                        { label: "Manufacturer", value: "manufacturer" },
                                    ],
                                },
                            ]}
                            rightSlot={
                                selectedCount > 0 ? (
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs text-slate-700">
                                            Selected: <span className="font-semibold">{selectedCount}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                                            onClick={() => console.log("Download Visible")}
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
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-600">{loading ? "Loading..." : ""}</div>
                                )
                            }
                        />
                    </div>

                    {/* ✅ Table area takes remaining height */}
                    <div className="flex-1 min-h-0 px-4 pb-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm h-full overflow-hidden relative">
                            {/* ✅ loader overlay */}
                            {loading ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                    <Loader fullScreen={false} text="Loading establishments..." />
                                </div>
                            ) : null}

                            {/* ✅ scroll container */}
                            <div className="h-full overflow-auto scroll-hover">
                                <DataTable
                                    columns={columns}
                                    data={viewRows}
                                    rowKey={(r) => r.id}
                                    stickyHeader={true}
                                    height="100%"
                                    footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Partners Popup */}
            <AllPartnersModal
                open={openPartners}
                onClose={() => setOpenPartners(false)}
                partners={partnersList}
                placeholderImg={placeholderImg}
            />

            {/* ✅ Add Establishment Popup */}
            <AddEstablishmentModal
                open={openAddEst}
                onClose={() => setOpenAddEst(false)}
                value={estForm}
                onChange={setEstForm}
                onSave={() => {
                    if (!estForm.name.trim()) return alert("Establishment name is required");
                    if (!estForm.address.trim()) return alert("Establishment address is required");

                    console.log("SAVE ESTABLISHMENT:", estForm);
                    setOpenAddEst(false);
                }}
            />
        </>
    );
}
