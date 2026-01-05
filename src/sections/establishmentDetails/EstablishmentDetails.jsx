import PropTypes from "prop-types";

export default function EstablishmentDetailsTab({ overview }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="text-sm font-extrabold text-slate-800 mb-3">Establishment Details</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                    <div className="text-xs font-semibold text-slate-500">Name</div>
                    <div className="font-semibold">{overview?.name || "-"}</div>
                </div>

                <div>
                    <div className="text-xs font-semibold text-slate-500">Establishment ID</div>
                    <div className="font-semibold">{overview?.establishment_id || "-"}</div>
                </div>

                <div className="md:col-span-2">
                    <div className="text-xs font-semibold text-slate-500">Address</div>
                    <div className="font-semibold">{overview?.address || "-"}</div>
                </div>
            </div>
        </div>
    );
}

EstablishmentDetailsTab.propTypes = {
    overview: PropTypes.object,
};
