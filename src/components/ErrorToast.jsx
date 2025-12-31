// src/components/ErrorToast.jsx
import PropTypes from "prop-types";
import { useEffect } from "react";

export default function ErrorToast({ show, message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(t);
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-5 right-5 z-[9999]">
            <div className="rounded-xl border border-red-500/30 bg-white shadow-lg px-4 py-3 min-w-[260px]">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-red-700">Error</div>
                        <div className="text-xs text-slate-700 mt-0.5">{message}</div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-sm leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

ErrorToast.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    onClose: PropTypes.func,
    duration: PropTypes.number,
};
