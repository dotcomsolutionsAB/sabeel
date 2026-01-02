import PropTypes from "prop-types";
import { AddIcon } from "../../components/icons";

export default function LeftFamilySection({ onAddFamily }) {
    return (
        <div className="p-4">
            {/* Top-right button row */}
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={onAddFamily}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0A4D7A] text-white px-4 py-2 text-xs font-semibold hover:opacity-95 shadow-sm"
                >
                    <AddIcon className="w-4 h-4" />
                    Add Family
                </button>
            </div>

            {/* Blank area (like your screenshot) */}
            <div className="h-[420px]" />
        </div>
    );
}

LeftFamilySection.propTypes = {
    onAddFamily: PropTypes.func,
};

LeftFamilySection.defaultProps = {
    onAddFamily: () => { },
};
