import PropTypes from "prop-types";

export default function ConfirmToast({
    show,
    title = "Confirm",
    message,
    onConfirm,
    onCancel,
}) {
    if (!show) return null;

    return (
        <div className="fixed top-5 right-5 z-[9999]">
            <div className="rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3 min-w-[320px]">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-sky-500" />

                    <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">{title}</div>
                        <div className="text-xs text-slate-700 mt-0.5">{message}</div>

                        <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                No
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                className="px-3 py-1.5 text-xs rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                            >
                                Yes, Export
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
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

ConfirmToast.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};
