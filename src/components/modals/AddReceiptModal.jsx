import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";  // Modal component for the popup
import InputField from "../InputField"; // InputField component for form inputs
import headerImg from "../../assets/images/AddRecieptHeader.png";  // Header image for the modal

function toStr(v) {
    return v == null ? "" : String(v);
}

export default function AddReceiptModal({
    open,
    onClose,
    hofName = "-",
    type = "family", // "family" | "establishment"
    familyId = null,
    establishmentId = null,
    onSave,  // Function to call when user clicks Save
}) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        year: "",
        mode: "",
        amount: "",
        remarks: "",
        // cheque fields
        bank: "",
        ifsc: "",
        cheque_no: "",
        cheque_date: "",
        // upi fields
        trans_id: "",
        trans_date: "",
    });

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    useEffect(() => {
        if (!open) return;
        setSaving(false);
        setForm({
            year: "",
            mode: "",
            amount: "",
            remarks: "",
            bank: "",
            ifsc: "",
            cheque_no: "",
            cheque_date: "",
            trans_id: "",
            trans_date: "",
        });
    }, [open]);

    const mode = toStr(form.mode).toLowerCase();

    const modeOptions = useMemo(
        () => [
            { label: "Select", value: "" },
            { label: "Cash", value: "cash" },
            { label: "Cheque", value: "cheque" },
            { label: "UPI/NEFT", value: "upi" },
        ],
        []
    );

    const validate = () => {
        if (!toStr(form.year).trim()) return "Year is required";
        if (!mode) return "Mode is required";
        if (!toStr(form.amount).trim()) return "Amount is required";

        if (mode === "cheque") {
            if (!toStr(form.bank).trim()) return "Bank is required";
            if (!toStr(form.cheque_no).trim()) return "Cheque no is required";
            if (!toStr(form.cheque_date).trim()) return "Cheque date is required";
        }

        if (mode === "upi") {
            if (!toStr(form.trans_id).trim()) return "Transaction id is required";
            if (!toStr(form.trans_date).trim()) return "Transaction date is required";
        }

        return "";
    };

    const save = async () => {
        const err = validate();
        if (err) return onSave?.({ __error: err });

        const payload = {
            type,  // "family" or "establishment"
            family_id: type === "family" ? toStr(familyId) : null,
            establishment_id: type === "establishment" ? toStr(establishmentId) : null, // Ensure establishment_id is passed if type is "establishment"
            year: toStr(form.year).trim(),
            mode: mode,
            amount: toStr(form.amount).trim(),
            remarks: toStr(form.remarks).trim(),
            trans_id: mode === "upi" ? toStr(form.trans_id).trim() : "",
            trans_date: mode === "upi" ? toStr(form.trans_date).trim() : "",
            bank: mode === "cheque" ? toStr(form.bank).trim() : "",
            cheque_no: mode === "cheque" ? toStr(form.cheque_no).trim() : "",
            cheque_date: mode === "cheque" ? toStr(form.cheque_date).trim() : "",
            ifsc: mode === "cheque" ? toStr(form.ifsc).trim() : "",
        };

        try {
            setSaving(true);
            await onSave?.(payload);  // Trigger the onSave function with the payload
            onClose?.();               // Close the modal after saving
        } finally {
            setSaving(false);
        }
    };


    return (
        <Modal open={open} onClose={onClose} title="Add Receipt" widthClass="max-w-2xl" footer={
            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="min-w-[120px] rounded-lg border border-[#004D84] text-[#004D84] font-semibold px-5 py-2 hover:bg-sky-50 disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={save}  // Trigger save on button click
                    disabled={saving}
                    className="min-w-[120px] rounded-lg bg-[#004D84] text-white font-semibold px-5 py-2 hover:opacity-95 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        }>
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="Add Receipt" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-900/30" />
                </div>

                <div className="bg-[#004D84] px-5 py-2 text-white text-sm font-semibold">
                    HOF Name: <span className="font-bold">{hofName}</span>
                </div>

                <div className="p-5 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Year *"
                            type="text"
                            placeholder="YYYY"
                            value={form.year}
                            onChange={set("year")}
                        />
                        <InputField
                            label="Mode *"
                            type="select"
                            value={form.mode}
                            onChange={set("mode")}
                            options={modeOptions}
                        />
                        <InputField
                            label="Amount *"
                            type="number"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={set("amount")}
                        />
                    </div>

                    {/* Cheque-specific fields */}
                    {mode === "cheque" && (
                        <>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Bank *" value={form.bank} onChange={set("bank")} placeholder="Enter bank" />
                                <InputField label="IFSC" value={form.ifsc} onChange={set("ifsc")} placeholder="Enter IFSC" />
                                <InputField label="Cheque No *" value={form.cheque_no} onChange={set("cheque_no")} placeholder="Enter cheque no" />
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Cheque Date *" type="date" value={form.cheque_date} onChange={set("cheque_date")} />
                            </div>
                        </>
                    )}

                    {/* Cash-specific fields */}
                    {mode === "cash" && (
                        <div className="mt-4">
                            <InputField
                                label="Comments"
                                type="textarea"
                                rows={3}
                                value={form.remarks}
                                onChange={set("remarks")}
                                placeholder="Enter comments"
                            />
                        </div>
                    )}

                    {/* UPI-specific fields */}
                    {mode === "upi" && (
                        <>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Transaction ID *" value={form.trans_id} onChange={set("trans_id")} placeholder="Enter transaction id" />
                                <InputField label="Transaction Date *" type="date" value={form.trans_date} onChange={set("trans_date")} />
                            </div>
                            <div className="mt-4">
                                <InputField
                                    label="Comments"
                                    type="textarea"
                                    rows={3}
                                    value={form.remarks}
                                    onChange={set("remarks")}
                                    placeholder="Enter comments"
                                />
                            </div>
                        </>
                    )}

                    {/* Show message if no mode is selected */}
                    {!mode && (
                        <div className="mt-4 text-xs text-slate-500">
                            Select a mode to see required fields.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

AddReceiptModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    hofName: PropTypes.string,
    type: PropTypes.oneOf(["family", "establishment"]),
    familyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    establishmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSave: PropTypes.func,
};
