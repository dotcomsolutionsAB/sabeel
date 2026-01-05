import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import TabsSlash from "../components/TabsSlash";
import LeftPanel from "../components/LeftPanel";
import DataTable from "../components/DataTable";

import AddReceiptModal from "../components/modals/AddReceiptModal";
import AddFamilyModal from "../components/modals/AddFamilyModal";
import AddSabeelModal from "../components/modals/AddSabeelModal";
import SabeelViewEditModal from "../components/modals/SabeelViewEditModal";

import { BackIcon, MailIcon, CallIcon, IdCardIcon, EstablishmentIcon, EyeIcon } from "../components/icons";
import { LeftOverviewSection, LeftHofSection, LeftFamilySection, LeftSabeelSection } from "../sections/familyDetails";

import { retrieveFamilyDetailsApi } from "../services/familyService";
import { retrieveReceiptsApi, createReceiptApi } from "../services/receiptService";
import { createFamilySabeelApi } from "../services/sabeelService";
import { createFamilyApi } from "../services/familyService";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

function toStr(v) {
    return v == null ? "" : String(v);
}
function money(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}

export default function FamilyDetails() {
    const { id } = useParams(); // ✅ /family/:id (or your route)
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");

    const [loadingFamily, setLoadingFamily] = useState(false);
    const [familyError, setFamilyError] = useState("");
    const [family, setFamily] = useState(null);

    const [loadingReceipts, setLoadingReceipts] = useState(false);
    const [receiptsError, setReceiptsError] = useState("");
    const [receipts, setReceipts] = useState([]);
    const [receiptPagination, setReceiptPagination] = useState({ limit: 10, offset: 0, count: 0, total: 0 });

    const [openAddReceipt, setOpenAddReceipt] = useState(false);
    const [openAddFamily, setOpenAddFamily] = useState(false);
    const [openAddSabeel, setOpenAddSabeel] = useState(false);
    const [toastOk, setToastOk] = useState({ show: false, message: "" });
    const [toastErr, setToastErr] = useState({ show: false, message: "" });

    // ✅ Your sabeel tab rows (year-wise). If you later add retrieve endpoint, you can fetch too.
    const [sabeelRows, setSabeelRows] = useState([]);
    const [sabeelModalKey, setSabeelModalKey] = useState(0);
    const [openSabeelView, setOpenSabeelView] = useState(false);
    const [selectedSabeelRow, setSelectedSabeelRow] = useState(null);

    const viewSabeel = (row) => {
        setSelectedSabeelRow(row);
        setSabeelModalKey((k) => k + 1);
        setOpenSabeelView(true);
    };

    const handleUpdateSabeel = (updatedRow) => {
        setSabeelRows((prev) =>
            prev.map((r) => (String(r.year) === String(updatedRow.year) ? updatedRow : r))
        );
    };

    const handleCreateReceipt = async (payload) => {
        // modal might send {__error}
        if (payload?.__error) {
            setToastErr({ show: true, message: payload.__error });
            return;
        }

        try {
            const res = await createReceiptApi(payload);

            if (res?.code === 200) {
                setToastOk({ show: true, message: res?.message || "Receipt created successfully" });

                // ✅ refresh receipts list
                await fetchReceipts({ limit: receiptPagination.limit || 10, offset: 0 });
            } else {
                setToastErr({ show: true, message: res?.message || "Failed to create receipt" });
            }
        } catch (e) {
            setToastErr({ show: true, message: e?.message || "Failed to create receipt" });
        }
    };

    const handleSaveFamily = async (payload) => {
        if (payload?.__error) {
            setToastErr({ show: true, message: payload.__error });
            return;
        }

        try {
            const res = await createFamilyApi(payload);

            if (res?.code === 200) {
                setToastOk({ show: true, message: res?.message || "Family created successfully" });

                // ✅ Refresh family list (pick ONE):
                // 1) If you have a "fetchFamilyMembers()" function for family tab, call it:
                // await fetchFamilyMembers();

                // 2) If you don’t have API yet for family tab list, you can at least close modal
                // and later you'll plug the fetch here.

            } else {
                setToastErr({ show: true, message: res?.message || "Failed to create family" });
            }
        } catch (e) {
            setToastErr({ show: true, message: e?.message || "Failed to create family" });
        }
    };


    const tabs = useMemo(
        () => [
            { key: "overview", label: "Overview" },
            { key: "hof", label: "HOF Details" },
            { key: "family", label: "Family Details" },
            { key: "sabeel", label: "Sabeel Details" },
        ],
        []
    );

    // ✅ Fetch family details
    const fetchFamily = async () => {
        if (!id) return;
        try {
            setLoadingFamily(true);
            setFamilyError("");

            // api.js usually returns JSON already
            const res = await retrieveFamilyDetailsApi(id);
            const d = res?.data?.data || null; // ✅ response: { data: { data: {...} } }
            setFamily(d);
        } catch (e) {
            setFamilyError(e?.message || "Failed to fetch family details");
            setFamily(null);
        } finally {
            setLoadingFamily(false);
        }
    };

    // ✅ Fetch receipts (family)
    const fetchReceipts = async ({ limit = 10, offset = 0 } = {}) => {
        if (!id) return;
        try {
            setLoadingReceipts(true);
            setReceiptsError("");

            const res = await retrieveReceiptsApi({
                type: "family",
                family_id: id,
                establishment_id: null,
                date_from: "",
                date_to: "",
                limit,
                offset,
            });

            const rows = Array.isArray(res?.data) ? res.data : [];
            setReceipts(rows);

            setReceiptPagination({
                limit: res?.pagination?.limit ?? limit,
                offset: res?.pagination?.offset ?? offset,
                count: res?.pagination?.count ?? rows.length,
                total: res?.pagination?.total ?? rows.length,
            });
        } catch (e) {
            setReceiptsError(e?.message || "Failed to fetch receipts");
            setReceipts([]);
            setReceiptPagination({ limit, offset, count: 0, total: 0 });
        } finally {
            setLoadingReceipts(false);
        }
    };

    useEffect(() => {
        fetchFamily();
        fetchReceipts({ limit: 10, offset: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ✅ Right profile card data (dynamic)
    const profile = useMemo(() => {
        return {
            name: family?.name || "-",
            email: family?.email || "-",
            phone: family?.mobile || "-",
            its: family?.its || "-",
            sector: family?.sector || "-",
            avatarUrl: family?.url || "",
        };
    }, [family]);

    // ✅ Top stats (dynamic)
    const stats = useMemo(() => {
        return [
            { value: money(family?.sabeel?.sabeel), label: "Personal Sabeel" },
            { value: `₹ ${money(family?.sabeel?.due)}`, label: "Personal Due" },
            { value: `₹ ${money(family?.sabeel?.prev_due)}`, label: "Personal Prev Due" },

            { value: money(family?.establishment?.sabeel), label: "Establishment Sabeel" },
            { value: `₹ ${money(family?.establishment?.due)}`, label: "Establishment Due" },
            { value: `₹ ${money(family?.establishment?.prev_due)}`, label: "Establishment Prev Due" },
        ];
    }, [family]);

    // ✅ receipts mapping if your LeftOverviewSection expects your old keys
    const receiptsForUI = useMemo(() => {
        return (receipts || []).map((r) => ({
            id: r.id,
            receiptNo: r.receipt_no,
            date: r.date,
            year: r.year,
            mode: r.mode,
            bank: r.bank,
            chequeNo: r.cheque_no,
            ifsc: r.ifsc,
            chequeDate: r.cheque_date,
            txnId: r.trans_id,
            type: "Personal",
            amount: r.amount,
            _raw: r,
        }));
    }, [receipts]);

    // Right panel mini tables (you can connect later to real endpoints)
    const sabeelYearWise = useMemo(() => [], []);
    const establishments = useMemo(() => [], []);

    const sabeelColumns = useMemo(
        () => [
            { key: "year", header: "Year", width: 120 },
            { key: "sabeel", header: "Sabeel", render: (r) => <span className="font-semibold text-sky-700">{r.sabeel}</span> },
            { key: "due", header: "Due", render: (r) => `₹ ${r.due}` },
        ],
        []
    );

    const estColumns = useMemo(
        () => [
            {
                key: "name",
                header: "Establishment",
                render: (r) => <span className="font-semibold text-sky-900">{r.name}</span>,
            },
            { key: "due", header: "Due", width: 120, render: (r) => `₹ ${r.due}` },
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
        []
    );

    return (
        <DashboardLayout title="Family Details">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-900 to-sky-500">
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <button
                                type="button"
                                onClick={() => navigate("/family")}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/20"
                            >
                                <BackIcon className="w-5 h-5" />
                            </button>
                            Family Details
                        </div>
                    </div>

                    {/* Inner card */}
                    <div className="px-4 pt-4">
                        <div className="rounded-xl overflow-hidden border border-sky-200 bg-white">
                            <div className="p-4">
                                <TabsSlash tabs={tabs} value={activeTab} onChange={setActiveTab} />

                                {(familyError || receiptsError) ? (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {familyError || receiptsError}
                                    </div>
                                ) : null}

                                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
                                    {/* LEFT */}
                                    <LeftPanel>
                                        {loadingFamily && !family ? (
                                            <div className="p-6 text-sm text-slate-600">Loading...</div>
                                        ) : activeTab === "overview" ? (
                                            <LeftOverviewSection
                                                stats={stats}
                                                receipts={receiptsForUI}
                                                onAddReceipt={() => setOpenAddReceipt(true)}
                                                loadingReceipts={loadingReceipts}
                                                receiptPagination={receiptPagination}
                                                onReceiptPageChange={(offset) => fetchReceipts({ limit: 10, offset })}
                                            />
                                        ) : activeTab === "hof" ? (
                                            <LeftHofSection
                                                value={{
                                                    name: toStr(family?.name),
                                                    its: toStr(family?.its),
                                                    mobile: toStr(family?.mobile),
                                                    email: toStr(family?.email),
                                                    sector: toStr(family?.sector),
                                                    address: "",
                                                    gender: "",
                                                    dob: "",
                                                }}
                                                onChange={() => { }}
                                                onSave={() => console.log("Save HOF (later)")}
                                            />
                                        ) : activeTab === "family" ? (
                                            <LeftFamilySection onAddFamily={() => setOpenAddFamily(true)} />
                                        ) : activeTab === "sabeel" ? (
                                            <LeftSabeelSection
                                                data={sabeelRows}
                                                onAdd={() => setOpenAddSabeel(true)}
                                                onView={viewSabeel}
                                                onDelete={(row) => console.log("Delete sabeel later", row)}
                                            />
                                        ) : null}
                                    </LeftPanel>

                                    {/* RIGHT profile card */}
                                    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                                        <div className="p-4 shrink-0">
                                            <div className="flex items-start gap-3">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                                    {profile.avatarUrl ? (
                                                        <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : null}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-semibold text-slate-900 leading-tight">{profile.name}</div>

                                                    <div className="mt-2 space-y-1 text-xs text-slate-700">
                                                        <div className="flex items-center gap-2">
                                                            <IdCardIcon className="w-4 h-4 text-sky-700" />
                                                            ITS: <span className="font-semibold">{profile.its}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CallIcon className="w-4 h-4 text-sky-700" />
                                                            Phone: <span className="font-semibold">{profile.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MailIcon className="w-4 h-4 text-sky-700" />
                                                            Email: <span className="font-semibold">{profile.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <EstablishmentIcon className="w-4 h-4 text-sky-700" />
                                                            Sector: <span className="font-semibold">{profile.sector}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-3">
                                                        {/* <button className="inline-flex items-center justify-center gap-2 flex-1 rounded-lg border border-sky-700 text-sky-800 font-semibold px-3 py-2 text-xs hover:bg-sky-50">
                                                            <PrintIcon className="w-4 h-4" />
                                                            Print Profile
                                                        </button> */}
                                                        <button className="inline-flex items-center justify-center flex-1 rounded-lg bg-rose-700 text-white font-semibold px-3 py-2 text-xs hover:bg-rose-800">
                                                            Close Sabeel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100" />

                                        <div className="flex-1 overflow-auto min-h-0 p-4 space-y-5 scroll-hover">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-semibold text-slate-900">Sabeel Details</div>
                                                    <button className="text-xs font-semibold text-sky-700 hover:underline">View All</button>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                    <DataTable
                                                        columns={sabeelColumns}
                                                        data={sabeelYearWise}
                                                        rowKey={(r) => r.year}
                                                        stickyHeader={false}
                                                        tableClassName="border-0 shadow-none rounded-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-semibold text-slate-900 mb-2">Establishment Details</div>
                                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                    <DataTable
                                                        columns={estColumns}
                                                        data={establishments}
                                                        rowKey="id"
                                                        stickyHeader={false}
                                                        tableClassName="border-0 shadow-none rounded-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end right */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AddReceiptModal
                open={openAddReceipt}
                onClose={() => setOpenAddReceipt(false)}
                hofName={profile.name}
                type="family"
                familyId={id}
                onSave={handleCreateReceipt}
            />

            <AddFamilyModal
                open={openAddFamily}
                onClose={() => setOpenAddFamily(false)}
                onSave={handleSaveFamily}
            />


            {/* ✅ Add Sabeel => calls family_sabeel/create/{familyId} */}
            <AddSabeelModal
                open={openAddSabeel}
                onClose={() => setOpenAddSabeel(false)}
                onSave={async ({ year, amount }) => {
                    const res = await createFamilySabeelApi(id, { year, amount });
                    const newRows = res?.data?.sabeel_details || [];

                    // Upsert by year
                    setSabeelRows((prev) => {
                        const map = new Map((prev || []).map((x) => [String(x.year), x]));
                        (newRows || []).forEach((x) => {
                            if (!x?.year) return;
                            map.set(String(x.year), {
                                year: x.year,
                                sabeel: x.sabeel,
                                due: x.due,
                            });
                        });
                        return Array.from(map.values());
                    });
                }}
            />

            <SabeelViewEditModal
                key={`${selectedSabeelRow?.id ?? "na"}-${sabeelModalKey}`}
                open={openSabeelView}
                onClose={() => setOpenSabeelView(false)}
                row={selectedSabeelRow}
                onUpdate={handleUpdateSabeel}
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
