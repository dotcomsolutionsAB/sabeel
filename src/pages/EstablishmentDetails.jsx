import { useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

export default function EstablishmentDetails() {
    const { id } = useParams();

    return (
        <DashboardLayout title="Establishment Details">
            <div className="p-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    Establishment Details Page (ID: {id})
                </div>
            </div>
        </DashboardLayout>
    );
}
