import SectionPanel from "../components/SectionPanel";
import DataTable from "../components/DataTable";
import DashboardLayout from "../layout/DashboardLayout";

export default function Dashboard() {
    const personal = {
        bigCards: [
            { number: "355", label: "Total Houses", to: "/personal/houses" },
            { number: "₹ 2,15,982", label: "Total Takhmeen", to: "/personal/takhmeen" },
            { number: "64", label: "No. Of Houses Due", to: "/personal/due-houses" },
            { number: "₹ 1,15,54", label: "Total Due Amount", to: "/personal/due-amount" },
        ],
        smallCards: [
            { number: "101", label: "Sabeel Having<br/>Previous Dues", to: "/personal/previous-dues" },
            { number: "56", label: "Sabeel New<br/>Takhmeen Pending", to: "/personal/new-takhmeen-pending" },
            { number: "20", label: "Houses Not<br/>Tagged To Any<br/>Establishment", to: "/personal/not-tagged" },
            { number: "45", label: "Houses In<br/>Service", to: "/personal/in-service" },
        ],
    };

    const establishment = {
        bigCards: [
            { number: "3,85,100", label: "Total Establishment", to: "/establishment/total" },
            { number: "₹ 5,56,981", label: "Total Takhmeen", to: "/establishment/takhmeen" },
            { number: "10,563", label: "No. Of Establishment Due", to: "/establishment/due-count" },
            { number: "₹ 1,66,001", label: "Total Due Amount", to: "/establishment/due-amount" },
        ],
        smallCards: [
            { number: "1,074", label: "Establishment<br/>Having Previous<br/>Dues", to: "/establishment/previous-dues" },
            { number: "290", label: "Establishment<br/>New Takhmeen<br/>Pending", to: "/establishment/new-takhmeen-pending" },
            { number: "288", label: "Establishment<br/>Not Tagged To<br/>Any House", to: "/establishment/not-tagged" },
            { number: "16", label: "Establishment In<br/>Manufacturer", to: "/establishment/manufacturer" },
        ],
    };


    const rows = [
        { year: "2025-26", due: "₹ 2,661,902" },
        { year: "2024-25", due: "₹ 1,842,120" },
        { year: "2023-24", due: "₹ 980,220" },
        { year: "2022-23", due: "₹ 522,110" },
        { year: "2021-22", due: "₹ 210,900" },
        { year: "2020-21", due: "₹ 90,500" },
    ];

    const onExport = (row) => alert(`Excel Export (demo) for ${row.year}`);

    return (
        <DashboardLayout>
            <div className="stats-wrap">
                <SectionPanel tone="mint" bigCards={personal.bigCards} smallCards={personal.smallCards} />
                <SectionPanel tone="tan" bigCards={establishment.bigCards} smallCards={establishment.smallCards} />
            </div>

            <div className="tables">
                <DataTable title="Personal Sabeel Due (Year Wise)" headVariant="blue" rows={rows} onExport={onExport} />
                <DataTable title="Establishment Sabeel Due (Year Wise)" headVariant="navy" rows={rows} onExport={onExport} />
            </div>
        </DashboardLayout>
    );
}
