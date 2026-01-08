import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";

function todayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function CreateDepositModal({
    open,
    onClose,
    receiptIds = [],
    totalAmount = 0,
    onConfirm,
    loading = false,
}) {
    const [remarks, setRemarks] = useState("");

    const handleClose = () => {
        if (loading) return;
        setRemarks("");
        onClose?.();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            widthClass="max-w-lg"
            footer={
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
                        onClick={() => onConfirm?.({ remarks })}
                        disabled={loading || receiptIds.length === 0}
                    >
                        {loading ? "Creating..." : "Yes, Create Deposit"}
                    </button>
                </div>
            }
        >
            <div className="p-5">
                <div className="text-base font-bold text-slate-900">Create Deposit</div>
                <div className="text-xs text-slate-600 mt-1">
                    Are you sure you want to create a deposit for the selected receipts?
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                    {/* Row 1: Date + Total Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                            label="Date"
                            type="text"
                            value={todayISO()}
                            onChange={() => { }}
                            disabled={true}
                        />

                        <InputField
                            label="Total Amount"
                            type="text"
                            value={Number(totalAmount || 0).toFixed(2)}
                            onChange={() => { }}
                            disabled={true}
                        />
                    </div>

                    {/* Row 2: Remarks */}
                    <InputField
                        label="Remarks"
                        type="textarea"
                        rows={3}
                        value={remarks}
                        onChange={setRemarks}
                        placeholder="Write remarks (optional)"
                    />

                    {/* Hidden IDs info line (optional, small text) */}
                    <div className="text-[11px] text-slate-500">
                        Selected receipts: <span className="font-semibold">{receiptIds.length}</span>
                    </div>
                </div>

            </div>
        </Modal>
    );
}

CreateDepositModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    receiptIds: PropTypes.arrayOf(PropTypes.string),
    totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onConfirm: PropTypes.func,
    loading: PropTypes.bool,
};
