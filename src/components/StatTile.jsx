// src/components/StatTile.jsx
import PropTypes from "prop-types";

export default function StatTile({ value, label }) {
    return (
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <div className="bg-gradient-to-b from-sky-200 to-sky-600 px-4 py-6 text-center">
                <div className="text-3xl font-extrabold text-white leading-tight">
                    {value}
                </div>
                <div className="mt-1 text-sm font-semibold text-white/95">
                    {label}
                </div>
            </div>
        </div>
    );
}

StatTile.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

StatTile.defaultProps = {
    value: "",
    label: "",
};