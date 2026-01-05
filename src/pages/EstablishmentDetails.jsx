import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import TabsSlash from "../components/TabsSlash";

import OverviewTab from "../sections/establishmentDetails/Overview";
import EstablishmentDetailsTab from "../sections/establishmentDetails/EstablishmentDetails";
import PartnersTab from "../sections/establishmentDetails/Partners";
import SabeelDetailsTab from "../sections/establishmentDetails/SabeelDetails";

import { retrieveEstablishmentOverviewApi } from "../services/establishmentService";

function money(v) {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}

// ✅ unwrap service return (axios response OR already-json)
// function unwrap(res) {
//     // if service returns axios response => res.data
//     // if service returns already json => res
//     return res?.data && res?.data?.code !== undefined ? res.data : res;
// }

export default function EstablishmentDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // /establishments/:id

    const [tab, setTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [overview, setOverview] = useState(null);

    const tabs = useMemo(
        () => [
            { key: "overview", label: "Overview" },
            { key: "details", label: "Establishment Details" },
            { key: "partners", label: "Partners" },
            { key: "sabeel", label: "Sabeel Details" },
        ],
        []
    );

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setLoading(true);
                setApiError("");

                // ✅ service already returns JSON (not axios response)
                const res = await retrieveEstablishmentOverviewApi(id);

                // ✅ correct extraction
                const d = res?.data?.data || null;
                console.log("OVERVIEW RES", res);
                console.log("OVERVIEW d", res?.data?.data);
                setOverview(d);
            } catch (e) {
                setApiError(e?.message || "Failed to fetch establishment overview");
                setOverview(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);


    const leftContent = (() => {
        if (tab === "overview") return <OverviewTab id={id} overview={overview} />;
        if (tab === "details") return <EstablishmentDetailsTab overview={overview} />;
        if (tab === "partners") return <PartnersTab partners={overview?.partners || []} />;
        if (tab === "sabeel") return <SabeelDetailsTab sabeelDetails={overview?.sabeel_details || []} />;
        return null;
    })();

    // right panel fields (API doesn’t give email/phone directly)
    const phone = overview?.partners?.[0]?.mobile || "-";
    const email = overview?.email || "-"; // if later API adds it

    return (
        <DashboardLayout title="Establishment Details">
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden">
                    {/* top title row (like screenshot) */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-sky-50">
                        <button
                            type="button"
                            className="h-8 w-8 rounded-full bg-sky-800 text-white flex items-center justify-center"
                            onClick={() => navigate(-1)}
                            title="Back"
                        >
                            ←
                        </button>
                        <div className="text-slate-900 font-bold">Establishment Details</div>
                    </div>

                    {/* ✅ outer blue border box like screenshot */}
                    <div className="m-4 rounded-xl border-2 bg-gradient-to-r from-[#0A4D7A] to-[#7EB4D6] overflow-hidden">
                        <div className="px-4 py-3 text-white font-semibold">Establishment Details</div>

                        <div className="bg-white p-4">
                            {apiError ? (
                                <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
                                    {apiError}
                                </div>
                            ) : null}

                            {/* Tabs */}
                            <TabsSlash tabs={tabs} value={tab} onChange={setTab} />

                            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* LEFT */}
                                <div className="lg:col-span-8">
                                    {loading && !overview ? (
                                        <div className="rounded-xl bg-white border border-slate-200 p-6 text-sm text-slate-600">
                                            Loading...
                                        </div>
                                    ) : (
                                        leftContent
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="lg:col-span-4">
                                    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-4">
                                            <div className="flex justify-center">
                                                <div className="h-28 w-28 rounded-xl overflow-hidden bg-slate-100 border">
                                                    {overview?.url ? (
                                                        <img src={overview.url} alt="" className="h-full w-full object-cover" />
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="mt-3 text-center font-extrabold text-slate-800">
                                                {(overview?.name || "-").toUpperCase()}
                                            </div>

                                            <div className="mt-3 text-xs text-slate-700 space-y-2">
                                                <div>
                                                    <span className="font-semibold">Email:</span> {email}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Phone:</span> {phone}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Address:</span> {overview?.address || "-"}
                                                </div>

                                                <div className="pt-2">
                                                    <span className="font-semibold">Total Sabeel:</span>{" "}
                                                    {money(overview?.establishment?.sabeel)}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="mt-4 w-full rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold py-2"
                                                onClick={() => console.log("close establishment")}
                                            >
                                                ✕ Close Establishment
                                            </button>
                                        </div>

                                        {/* Sabeel details mini */}
                                        <div className="px-4 pb-4">
                                            <div className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                                                <span>Sabeel Details</span>
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-sky-700 hover:underline"
                                                    onClick={() => setTab("sabeel")}
                                                >
                                                    View All →
                                                </button>
                                            </div>

                                            <div className="rounded-lg border border-slate-100 overflow-hidden">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-sky-50">
                                                        <tr>
                                                            <th className="text-left px-3 py-2">Year</th>
                                                            <th className="text-left px-3 py-2">Sabeel</th>
                                                            <th className="text-left px-3 py-2">Due</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(overview?.sabeel_details || []).slice(0, 3).map((r, i) => (
                                                            <tr key={i} className="border-t">
                                                                <td className="px-3 py-2">{r?.year || "-"}</td>
                                                                <td className="px-3 py-2 text-sky-700 font-semibold">{money(r?.sabeel)}</td>
                                                                <td className="px-3 py-2">{money(r?.due)}</td>
                                                            </tr>
                                                        ))}
                                                        {(!overview?.sabeel_details || overview.sabeel_details.length === 0) ? (
                                                            <tr>
                                                                <td className="px-3 py-3 text-slate-500" colSpan={3}>No data</td>
                                                            </tr>
                                                        ) : null}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Partners mini */}
                                            <div className="mt-4 text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                                                <span>Partners</span>
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-sky-700 hover:underline"
                                                    onClick={() => setTab("partners")}
                                                >
                                                    View All →
                                                </button>
                                            </div>

                                            <div className="rounded-lg border border-slate-100 overflow-hidden">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-sky-50">
                                                        <tr>
                                                            <th className="text-left px-3 py-2">Name</th>
                                                            <th className="text-left px-3 py-2">Sector</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(overview?.partners || []).slice(0, 3).map((p, i) => (
                                                            <tr key={i} className="border-t">
                                                                <td className="px-3 py-2 truncate max-w-[160px]">{p?.name || "-"}</td>
                                                                <td className="px-3 py-2">{p?.sector || "-"}</td>
                                                            </tr>
                                                        ))}
                                                        {(!overview?.partners || overview.partners.length === 0) ? (
                                                            <tr>
                                                                <td className="px-3 py-3 text-slate-500" colSpan={2}>No partners</td>
                                                            </tr>
                                                        ) : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /right */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
