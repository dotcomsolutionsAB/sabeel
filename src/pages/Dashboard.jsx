import { useEffect, useMemo, useState } from "react";

import SectionPanel from "../components/SectionPanel";
import DataTable from "../components/DataTable";
// import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import ConfirmToast from "../components/ConfirmToast";
import { retrieveDashboard, retrieveSabeelDue, exportDashboard } from "../services/dashboardService";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");
    const [toast, setToast] = useState({ ok: false, err: false, msg: "" });

    const [confirm, setConfirm] = useState({
        show: false,
        filter: null,
        label: "",
    });

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
                        { number: `₹ ${formatINR(safe0(m.total_sabeel))}`, label: "Total Takhmeen", onClick: () => askExport("family", "Family Total Takhmeen"), },
                        { number: safe0(m.due_houses), label: "No. Of Houses Due", to: "/personal/due-houses" },
                        { number: `₹ ${formatINR(safe0(m.due_sabeel))}`, label: "Total Due Amount", onClick: () => askExport("due_family", "Family Due Amount"), },
                    ],
                    smallCards: [
                        { number: safe0(m.having_prev_due), label: "Sabeel Having<br/>Previous Dues", to: "/family?filter=prev_due" },
                        { number: safe0(m.new_takhmeen_pending), label: "Sabeel New<br/>Takhmeen Pending", to: "/family?filter=new_takhmeen_pending" },
                        { number: safe0(m.establishment_missing), label: "Houses Not<br/>Tagged To Any<br/>Establishment", to: "/family?filter=not_tagged" },
                        { number: safe0(m.service), label: "Houses In<br/>Service", to: "/family?filter=service" },
                    ],
                });

                setEstablishment({
                    bigCards: [
                        { number: safe0(e.total_establishment), label: "Total Establishment", to: "/establishment/total" },
                        { number: `₹ ${formatINR(safe0(e.total_sabeel))}`, label: "Total Takhmeen", onClick: () => askExport("establishment", "Establishment Total Takhmeen"), },
                        { number: safe0(e.due_establishment), label: "No. Of Establishment Due", to: "/establishment/due-count" },
                        { number: `₹ ${formatINR(safe0(e.due_sabeel))}`, label: "Total Due Amount", onClick: () => askExport("due_establishment", "Establishment Due Amount"), },
                    ],
                    smallCards: [
                        {
                            number: safe0(e.having_prev_due),
                            label: "Establishment<br/>Having Previous<br/>Dues",
                            to: "/establishments?filter=prev_due",
                        },
                        {
                            number: safe0(e.new_takhmeen_pending),
                            label: "Establishment<br/>New Takhmeen<br/>Pending",
                            to: "/establishments?filter=new_takhmeen_pending",
                        },
                        {
                            number: safe0(e.partner_not_tagged),
                            label: "Establishment<br/>Not Tagged To<br/>Any House",
                            to: "/establishments?filter=not_tagged",
                        },
                        {
                            number: safe0(e.manufacturer),
                            label: "Establishment In<br/>Manufacturer",
                            to: "/establishments?filter=manufacturer",
                        },
                    ],

                    // smallCards: [
                    //     { number: safe0(e.having_prev_due), label: "Establishment<br/>Having Previous<br/>Dues", to: "/establishment/previous-dues" },
                    //     { number: safe0(e.new_takhmeen_pending), label: "Establishment<br/>New Takhmeen<br/>Pending", to: "/establishment/new-takhmeen-pending" },
                    //     { number: safe0(e.partner_not_tagged), label: "Establishment<br/>Not Tagged To<br/>Any House", to: "/establishment/not-tagged" },
                    //     { number: safe0(e.manufacturer), label: "Establishment In<br/>Manufacturer", to: "/establishment/manufacturer" },
                    // ],
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

    const downloadFile = (url, filename = "dashboard_export.xlsx") => {
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", filename);
        a.target = "_blank";
        a.rel = "noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const askExport = (filter, label) => {
        setConfirm({ show: true, filter, label });
    };

    const doExport = async (filter, label) => {
        try {
            setToast({ ok: false, err: false, msg: "" });

            const fileUrl = await exportDashboard(filter);

            setToast({ ok: true, err: false, msg: `Export started: ${label}` });

            const fallbackName = `dashboard_${filter}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            const nameFromUrl = fileUrl.split("/").pop() || fallbackName;

            downloadFile(fileUrl, nameFromUrl);
        } catch (e) {
            setToast({ ok: false, err: true, msg: e?.message || `Export failed: ${label}` });
        }
    };


    return (
        <>
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
                    height="100%"
                />

                <DataTable
                    title="Establishment Sabeel Due (Year Wise)"
                    headerVariant="navy"
                    columns={dueColumns}
                    data={rowsEst}
                    stickyHeader={true}
                    height="100%"
                />

            </div>

            <ConfirmToast
                show={confirm.show}
                title="Export Excel"
                message={`Are you sure you want to export: ${confirm.label}?`}
                onCancel={() => setConfirm({ show: false, filter: null, label: "" })}
                onConfirm={() => {
                    const { filter, label } = confirm;
                    setConfirm({ show: false, filter: null, label: "" });
                    doExport(filter, label);
                }}
            />

            <SuccessToast
                show={toast.ok}
                message={toast.msg}
                onClose={() => setToast((p) => ({ ...p, ok: false }))}
                duration={2500}
            />

            <ErrorToast
                show={toast.err}
                message={toast.msg}
                onClose={() => setToast((p) => ({ ...p, err: false }))}
                duration={3000}
            />

        </>
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
