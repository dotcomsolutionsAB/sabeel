import DashboardLayout from "../layout/DashboardLayout";
import StatCard from "../components/StatCard";
import SectionPanel from "../components/SectionPanel";
import DataTable from "../components/DataTable";

export default function Dashboard() {
    // sample data (replace with API later)
    const yearWise = Array.from({ length: 12 }).map(() => [
        "2025-26",
        "₹ 2,681,902",
        <div className="flex justify-center">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs">
                ↓
            </span>
        </div>,
    ]);

    const monthly = Array.from({ length: 12 }).map(() => ["₹ 110", "173"]);

    return (
        <DashboardLayout>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard value="778" label="Total Families" />
                <StatCard value="₹ 2,687,894" label="Personal Sabeel Due" />
                <StatCard value="524" label="Establishment" />
                <StatCard value="₹ 9,176,009" label="Establishment Sabeel Due" />
            </div>

            {/* Two big panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <SectionPanel title="Personal Sabeel">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="font-semibold text-sm mb-2 text-gray-700">Due (Year Wise)</div>
                            <DataTable
                                columns={["Year", "Due", "Excel Export"]}
                                rows={yearWise}
                            />
                        </div>

                        <div>
                            <div className="font-semibold text-sm mb-2 text-gray-700">Breakup (Monthly)</div>
                            <DataTable columns={["Amount", "Count Of Family"]} rows={monthly} />
                        </div>
                    </div>
                </SectionPanel>

                <SectionPanel title="Establishment Sabeel">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="font-semibold text-sm mb-2 text-gray-700">Due (Year Wise)</div>
                            <DataTable
                                columns={["Year", "Due", "Excel Export"]}
                                rows={yearWise}
                            />
                        </div>

                        <div>
                            <div className="font-semibold text-sm mb-2 text-gray-700">Breakup (Monthly)</div>
                            <DataTable columns={["Amount", "Count Of Family"]} rows={monthly} />
                        </div>
                    </div>
                </SectionPanel>
            </div>
        </DashboardLayout>
    );
}
