import { useEffect, useMemo, useState } from "react";

import SectionPanel from "../components/SectionPanel";
import DataTable from "../components/DataTable";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";

import { retrieveDashboard, retrieveSabeelDue } from "../services/dashboardService";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [personal, setPersonal] = useState({ bigCards: [], smallCards: [] });
    const [establishment, setEstablishment] = useState({ bigCards: [], smallCards: [] });

    const [rowsPersonal, setRowsPersonal] = useState([]);
    const [rowsEst, setRowsEst] = useState([]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErrMsg("");

                const data = await retrieveDashboard();

                if (!mounted) return;

                const m = data?.mumineen || {};
                const e = data?.establishment || {};

                setPersonal({
                    bigCards: [
                        { number: safe0(m.total_houses), label: "Total Houses", to: "/personal/houses" },
                        { number: `₹ ${formatINR(safe0(m.total_sabeel))}`, label: "Total Takhmeen", to: "/personal/takhmeen" },
                        { number: safe0(m.due_houses), label: "No. Of Houses Due", to: "/personal/due-houses" },
                        { number: `₹ ${formatINR(safe0(m.due_sabeel))}`, label: "Total Due Amount", to: "/personal/due-amount" },
                    ],
                    smallCards: [
                        { number: safe0(m.having_prev_due), label: "Sabeel Having<br/>Previous Dues", to: "/personal/previous-dues" },
                        { number: safe0(m.new_takhmeen_pending), label: "Sabeel New<br/>Takhmeen Pending", to: "/personal/new-takhmeen-pending" },
                        { number: safe0(m.establishment_missing), label: "Houses Not<br/>Tagged To Any<br/>Establishment", to: "/personal/not-tagged" },
                        { number: safe0(m.service), label: "Houses In<br/>Service", to: "/personal/in-service" },
                    ],
                });

                setEstablishment({
                    bigCards: [
                        { number: safe0(e.total_establishment), label: "Total Establishment", to: "/establishment/total" },
                        { number: `₹ ${formatINR(safe0(e.total_sabeel))}`, label: "Total Takhmeen", to: "/establishment/takhmeen" },
                        { number: safe0(e.due_establishment), label: "No. Of Establishment Due", to: "/establishment/due-count" },
                        { number: `₹ ${formatINR(safe0(e.due_sabeel))}`, label: "Total Due Amount", to: "/establishment/due-amount" },
                    ],
                    smallCards: [
                        { number: safe0(e.having_prev_due), label: "Establishment<br/>Having Previous<br/>Dues", to: "/establishment/previous-dues" },
                        { number: safe0(e.new_takhmeen_pending), label: "Establishment<br/>New Takhmeen<br/>Pending", to: "/establishment/new-takhmeen-pending" },
                        { number: safe0(e.partner_not_tagged), label: "Establishment<br/>Not Tagged To<br/>Any House", to: "/establishment/not-tagged" },
                        { number: safe0(e.manufacturer), label: "Establishment In<br/>Manufacturer", to: "/establishment/manufacturer" },
                    ],
                });

                // Year-wise tables not in API yet
                const [personalDueRaw, establishmentDueRaw] = await Promise.all([
                    retrieveSabeelDue("sabeel"),
                    retrieveSabeelDue("establishment"),
                ]);

                if (!mounted) return;

                const pickLast6 = (arr = []) =>
                    [...arr]
                        .sort((a, b) => Number((b.year || "0").split("-")[0]) - Number((a.year || "0").split("-")[0]))
                        .slice(0, 6)
                        .map((x) => ({
                            year: x.year,
                            due: `₹ ${formatINR(safe0(x.due))}`,
                        }));

                setRowsPersonal(pickLast6(personalDueRaw));
                setRowsEst(pickLast6(establishmentDueRaw));

            } catch (err) {
                if (mounted) setErrMsg(err?.message || "Failed to load dashboard");
            } finally {
                // ✅ no return inside finally (fixes eslint no-unsafe-finally)
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const onExport = (row) => alert(`Excel Export (demo) for ${row.year}`);

    const dueColumns = useMemo(
        () => [
            { key: "year", header: "Year", width: 120 },
            { key: "due", header: "Due" },
            {
                key: "export",
                header: "Excel Export",
                width: 120,
                render: (r) => (
                    <div className="export">
                        <div className="dl" title="Export" onClick={() => onExport(r)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3v12" />
                                <path d="M7 10l5 5 5-5" />
                                <path d="M5 21h14" />
                            </svg>
                        </div>
                    </div>
                ),
                tdClassName: "text-center",
                thClassName: "text-center",
            },
        ],
        []
    );

    return (
        <DashboardLayout title="Dashboard">
            {loading ? <Loader fullScreen text="Loading dashboard..." /> : null}

            {errMsg ? (
                <div className="mx-4 my-3 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {errMsg}
                </div>
            ) : null}

            <div className="stats-wrap">
                <SectionPanel tone="mint" bigCards={personal.bigCards} smallCards={personal.smallCards} />
                <SectionPanel tone="tan" bigCards={establishment.bigCards} smallCards={establishment.smallCards} />
            </div>

            <div className="tables">
                <DataTable
                    title="Personal Sabeel Due (Year Wise)"
                    headerVariant="blue"
                    columns={dueColumns}
                    data={rowsPersonal}
                    stickyHeader={true}
                    height="260px"
                />

                <DataTable
                    title="Establishment Sabeel Due (Year Wise)"
                    headerVariant="navy"
                    columns={dueColumns}
                    data={rowsEst}
                    stickyHeader={true}
                    height="260px"
                />

            </div>
        </DashboardLayout>
    );
}

// ✅ blank/null/undefined => "0"
function safe0(v) {
    return v === "" || v === null || v === undefined ? "0" : v;
}

// ✅ format numbers: 2691099 -> 26,91,099
function formatINR(v) {
    const n = Number(String(v ?? "0").replace(/,/g, ""));
    if (!Number.isFinite(n)) return String(v ?? "0");
    return n.toLocaleString("en-IN");
}
