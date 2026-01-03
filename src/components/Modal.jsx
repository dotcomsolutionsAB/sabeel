import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({ open, onClose, children, footer, widthClass = "max-w-3xl" }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={`w-full ${widthClass} rounded-2xl overflow-hidden shadow-2xl bg-white`}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Body */}
                    <div className="">{children}</div>

                    {/* Footer */}
                    {footer ? (
                        <div className="px-5 py-4 border-t border-slate-100 bg-[#e5e7eb]">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
    footer: PropTypes.node,
    widthClass: PropTypes.string,
};