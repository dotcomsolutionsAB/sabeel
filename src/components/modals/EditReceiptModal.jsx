import { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";

import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/editReciept.png";

function toStr(v) {
    return v == null ? "" : String(v);
}
function normalizeMode(v) {
    return toStr(v).trim().toLowerCase();
}

export default function EditReceiptModal({ open, onClose, receipt, onSave }) {
    const [form, setForm] = useState({
        year: "",
        mode: "",
        amount: "",
        comments: "",
        bank: "",
        ifsc: "",
        cheque_no: "",
        cheque_date: "",
        trans_id: "",
        trans_date: "",
    });

    const initKeyRef = useRef("");

    useEffect(() => {
        if (!open) initKeyRef.current = "";
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const key = `${receipt?.id || ""}`;
        if (initKeyRef.current === key) return;
        initKeyRef.current = key;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(() => ({
            year: toStr(receipt?.year),
            mode: toStr(receipt?.mode),
            amount: toStr(receipt?.amount),
            comments: toStr(receipt?.comments || ""),
            bank: toStr(receipt?.bank || ""),
            ifsc: toStr(receipt?.ifsc || ""),
            cheque_no: toStr(receipt?.cheque_no || ""),
            cheque_date: toStr(receipt?.cheque_date || ""),
            trans_id: toStr(receipt?.trans_id || ""),
            trans_date: toStr(receipt?.trans_date || ""),
        }));

    }, [open, receipt?.id]);

    const modeKey = useMemo(() => normalizeMode(form.mode), [form.mode]);

    const isCheque = modeKey.includes("cheque");
    const isCash = modeKey === "cash";
    const isUpi =
        modeKey.includes("upi") ||
        modeKey.includes("neft") ||
        modeKey.includes("imps") ||
        modeKey.includes("rtgs") ||
        modeKey.includes("transfer");

    const modeOptions = useMemo(
        () => [
            { label: "Select", value: "" },
            { label: "Cash", value: "cash" },
            { label: "Cheque", value: "cheque" },
            { label: "UPI", value: "upi" },
            { label: "NEFT", value: "neft" },
            { label: "Transfer", value: "transfer" },
        ],
        []
    );

    const setField = (key) => (e) =>
        setForm((p) => ({ ...p, [key]: e?.target?.value ?? e }));

    const save = async () => {
        const payload = {
            id: receipt?.id,
            year: form.year,
            mode: form.mode,
            amount: form.amount,
            comments: form.comments,

            bank: isCheque ? form.bank : "",
            ifsc: isCheque ? form.ifsc : "",
            cheque_no: isCheque ? form.cheque_no : "",
            cheque_date: isCheque ? form.cheque_date : "",

            trans_id: isUpi ? form.trans_id : "",
            trans_date: isUpi ? form.trans_date : "",
        };

        await onSave?.(payload);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null}
            widthClass="max-w-3xl"
            footer={
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        className="min-w-[110px] rounded-md border border-sky-300 bg-white px-6 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="min-w-[110px] rounded-md bg-sky-800 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-900"
                        onClick={save}
                    >
                        Save
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-900/25" />
                </div>

                <div className="bg-sky-800 px-4 py-2 text-xs text-white">
                    HOF Name: {receipt?.name || "-"}
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Year"
                            value={form.year}
                            onChange={setField("year")}
                            placeholder="YYYY - YYYY"
                        />

                        <InputField
                            label="Mode"
                            type="select"
                            value={form.mode}
                            onChange={setField("mode")}
                            options={modeOptions}
                        />

                        <InputField
                            label="Amount"
                            type="number"
                            value={form.amount}
                            onChange={setField("amount")}
                            placeholder="Enter amount"
                        />
                    </div>

                    {isCheque ? (
                        <>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Bank" value={form.bank} onChange={setField("bank")} />
                                <InputField label="IFSC" value={form.ifsc} onChange={setField("ifsc")} />
                                <InputField
                                    label="Cheque No"
                                    value={form.cheque_no}
                                    onChange={setField("cheque_no")}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Cheque Date"
                                    type="date"
                                    value={form.cheque_date}
                                    onChange={setField("cheque_date")}
                                />
                                <InputField label="Comments" value={form.comments} onChange={setField("comments")} />
                            </div>
                        </>
                    ) : null}

                    {isCash ? (
                        <div className="mt-4">
                            <InputField label="Comments" value={form.comments} onChange={setField("comments")} />
                        </div>
                    ) : null}

                    {!isCash && !isCheque && isUpi ? (
                        <>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Transaction ID"
                                    value={form.trans_id}
                                    onChange={setField("trans_id")}
                                />
                                <InputField
                                    label="Transaction Date"
                                    type="date"
                                    value={form.trans_date}
                                    onChange={setField("trans_date")}
                                />
                            </div>

                            <div className="mt-4">
                                <InputField label="Comments" value={form.comments} onChange={setField("comments")} />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </Modal>
    );
}

EditReceiptModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    receipt: PropTypes.object,
    onSave: PropTypes.func,
};
