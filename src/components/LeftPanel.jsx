import PropTypes from "prop-types";

export default function LeftPanel({ children }) {
    return (
        <div className="w-full h-full min-h-0 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            {/* Only this scrolls */}
            <div className="flex-1 min-h-0 overflow-auto scroll-hover">
                {children}
            </div>
        </div>
    );
}

LeftPanel.propTypes = {
    children: PropTypes.node,
};
