import PropTypes from "prop-types";

export default function LeftPanel({ children }) {
    return (
        <div className="w-full rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden min-h-[520px]">
            {children}
        </div>
    );
}

LeftPanel.propTypes = {
    children: PropTypes.node,
};
