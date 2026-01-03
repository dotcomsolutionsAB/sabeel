import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import TabsSlash from "../components/TabsSlash";
import LeftPanel from "../components/LeftPanel";
import DataTable from "../components/DataTable";
import AddReceiptModal from "../components/modals/AddReceiptModal";
import {
    BackIcon,
    PrintIcon,
    MailIcon,
    CallIcon,
    IdCardIcon,
    EstablishmentIcon,
    EyeIcon,
} from "../components/icons";
import { LeftOverviewSection, LeftHofSection, LeftFamilySection, LeftSabeelSection } from "../sections/familyDetails";
import AddFamilyModal from "../components/modals/AddFamilyModal";
import AddSabeelModal from "../components/modals/AddSabeelModal";
import SabeelViewEditModal from "../components/modals/SabeelViewEditModal";

export default function FamilyDetails() {
    const [activeTab, setActiveTab] = useState("overview");
    const [openAdd, setOpenAdd] = useState(false);
    const navigate = useNavigate();

    const [openAddFamily, setOpenAddFamily] = useState(false);
    const [openAddSabeel, setOpenAddSabeel] = useState(false);

    const handleSaveFamily = (payload) => {
        console.log("SAVE FAMILY:", payload);
    };

    const handleSaveSabeel = (payload) => {
        console.log("SAVE SABEEL:", payload);
    };

    const profile = {
        name: "Juzar Fakhruddin Anjarwala",
        email: "Huz1858@Gmail.Com",
        phone: "+91 8777806463",
        its: "20365831",
        sector: "MOHANMEDI",
        avatarUrl: "https://i.pravatar.cc/220?img=13",
    };

    const [sabeelRows, setSabeelRows] = useState([
        { id: 1, year: "2025-26", sabeel: "4,236", due: "3,024" },
        { id: 2, year: "2024-25", sabeel: "1,000", due: "200" },
        { id: 3, year: "2023-24", sabeel: "0", due: "0" },
    ]);
    const [sabeelModalKey, setSabeelModalKey] = useState(0);
    const [openSabeelView, setOpenSabeelView] = useState(false);
    const [selectedSabeelRow, setSelectedSabeelRow] = useState(null);


    const addSabeel = () => setOpenAddSabeel(true);
    const viewSabeel = (row) => {
        setSelectedSabeelRow(row);
        setSabeelModalKey((k) => k + 1);   // ✅ force remount every time
        setOpenSabeelView(true);
    };
    const deleteSabeel = (row) => console.log("Delete", row);

    const handleUpdateSabeel = (updatedRow) => {
        setSabeelRows((prev) =>
            prev.map((r) => (String(r.id) === String(updatedRow.id) ? updatedRow : r))
        );
        console.log("UPDATED SABEEL:", updatedRow);
        // later: call backend update API here
    };

    const [hofForm, setHofForm] = useState({
        name: "",
        its: "",
        gender: "",
        mobile: "",
        email: "",
        dob: "",
        sector: "",
        address: "",
    });
    const addFamily = () => setOpenAddFamily(true);

    const saveHof = () => {
        console.log("Save HOF:", hofForm);
    };

    const stats = useMemo(
        () => [
            { value: "4,236", label: "Personal Sabeel" },
            { value: "₹ 1,212", label: "Personal Due" },
            { value: "₹ 284", label: "Personal Overdue" },
            { value: "2,700", label: "Establishment Sabeel" },
            { value: "₹ 600", label: "Establishment Due" },
            { value: "₹ 00", label: "Establishment Overdue" },
        ],
        []
    );

    const receipts = useMemo(
        () => [
            {
                id: 1,
                receiptNo: "AEM-1448/24-25",
                date: "28-03-2025",
                year: "2024-25",
                mode: "Cheque",
                bank: "Union Bank Of India",
                chequeNo: "425344",
                ifsc: "UBC0001234",
                chequeDate: "13-03-2025",
                type: "Personal",
                amount: "3,024",
            },
            {
                id: 2,
                receiptNo: "AEM-1448/24-25",
                date: "28-03-2025",
                year: "2024-25",
                mode: "UPI",
                txnId: "502342069929",
                type: "Personal",
                amount: "3,024",
            },
            {
                id: 3,
                receiptNo: "AEM-1448/24-25",
                date: "28-03-2025",
                year: "2024-25",
                mode: "Cheque",
                bank: "Union Bank Of India",
                chequeNo: "425344",
                ifsc: "UBC0001234",
                chequeDate: "13-03-2025",
                type: "Personal",
                amount: "3,024",
            },
        ],
        []
    );

    const tabs = useMemo(
        () => [
            { key: "overview", label: "Overview" },
            { key: "hof", label: "HOF Details" },
            { key: "family", label: "Family Details" },
            { key: "sabeel", label: "Sabeel Details" },
        ],
        []
    );

    const sabeelYearWise = useMemo(
        () => [
            { year: "2025-26", sabeel: 4236, due: 1256 },
            { year: "2024-25", sabeel: 4236, due: 1256 },
            { year: "2023-24", sabeel: 4236, due: 1256 },
        ],
        []
    );

    const establishments = useMemo(
        () => [
            { id: 1, name: "ALKA ENTERPRISES", due: 500 },
            { id: 2, name: "KOTHARI HARDWARE", due: 450 },
            { id: 3, name: "ARBEN TOOLS CO.", due: 1000 },
        ],
        []
    );

    const sabeelColumns = useMemo(
        () => [
            { key: "year", header: "Year", width: 120 },
            {
                key: "sabeel",
                header: "Sabeel",
                render: (r) => <span className="font-semibold text-sky-700">{r.sabeel}</span>,
            },
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

                                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
                                    {/* ✅ Left panel (reusable layout) */}
                                    <LeftPanel>
                                        {activeTab === "overview" ? (
                                            <LeftOverviewSection
                                                stats={stats}
                                                receipts={receipts}
                                                onAddReceipt={() => setOpenAdd(true)}
                                            />
                                        ) : activeTab === "hof" ? (
                                            <LeftHofSection
                                                value={hofForm}
                                                onChange={setHofForm}
                                                onSave={saveHof}
                                            />
                                        ) : activeTab === "family" ? (
                                            <LeftFamilySection onAddFamily={addFamily} />
                                        ) : activeTab === "sabeel" ? (
                                            <LeftSabeelSection
                                                data={sabeelRows}
                                                onAdd={addSabeel}
                                                onView={viewSabeel}
                                                onDelete={deleteSabeel}
                                            />
                                        ) : (
                                            <div className="p-6 text-slate-700">
                                                <div className="font-semibold text-slate-900 mb-2">
                                                    {tabs.find((t) => t.key === activeTab)?.label}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    Placeholder text for now. Next we will design this tab properly.
                                                </div>
                                            </div>
                                        )}
                                    </LeftPanel>


                                    {/* Right profile card (unchanged) */}
                                    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                                        <div className="p-4 shrink-0">
                                            <div className="flex items-start gap-3">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                                    <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-semibold text-slate-900 leading-tight">{profile.name}</div>

                                                    <div className="mt-2 space-y-1 text-xs text-slate-700">
                                                        <div className="flex items-center gap-2">
                                                            <MailIcon className="w-4 h-4 text-sky-700" />
                                                            Email: <span className="font-semibold">{profile.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CallIcon className="w-4 h-4 text-sky-700" />
                                                            Phone: <span className="font-semibold">{profile.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <IdCardIcon className="w-4 h-4 text-sky-700" />
                                                            ITS: <span className="font-semibold">{profile.its}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <EstablishmentIcon className="w-4 h-4 text-sky-700" />
                                                            Sector: <span className="font-semibold">{profile.sector}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-3">
                                                        <button className="inline-flex items-center justify-center gap-2 flex-1 rounded-lg border border-sky-700 text-sky-800 font-semibold px-3 py-2 text-xs hover:bg-sky-50">
                                                            <PrintIcon className="w-4 h-4" />
                                                            Print Profile
                                                        </button>
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

            <AddReceiptModal open={openAdd} onClose={() => setOpenAdd(false)} hofName="juzar fakhruddin anjarwala" />
            <AddFamilyModal open={openAddFamily} onClose={() => setOpenAddFamily(false)} onSave={handleSaveFamily} />
            <AddSabeelModal open={openAddSabeel} onClose={() => setOpenAddSabeel(false)} onSave={handleSaveSabeel} />
            <SabeelViewEditModal key={`${selectedSabeelRow?.id ?? "na"}-${sabeelModalKey}`} open={openSabeelView} onClose={() => setOpenSabeelView(false)} row={selectedSabeelRow} onUpdate={handleUpdateSabeel} />

        </DashboardLayout>
    );
}
