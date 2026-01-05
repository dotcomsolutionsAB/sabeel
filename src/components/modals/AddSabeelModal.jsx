import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/addSabeel.png";

export default function AddSabeelModal({ open, onClose, onSave, yearOptions = [] }) {
    const [form, setForm] = useState({ year: "", amount: "" });
    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const years = useMemo(() => {
        const opts = yearOptions?.length
            ? yearOptions
            : ["2026", "2025", "2024", "2023", "2022", "2021"];
        return [{ label: "Select", value: "" }, ...opts.map((y) => ({ label: y, value: y }))];
    }, [yearOptions]);

    const validate = () => {
        if (!form.year) return "Year is required";
        if (!String(form.amount).trim()) return "Amount is required";
        return "";
    };

    const save = () => {
        const err = validate();
        if (err) return alert(err);
        onSave?.({ ...form, amount: String(form.amount) });
        onClose?.();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null}
            widthClass="max-w-xl"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        className="rounded-lg bg-sky-900 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-950"
                    >
                        Save
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                {/* ✅ Image header like screenshot */}
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-sky-900/30" />

                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="Year *" type="select" value={form.year} onChange={set("year")} options={years} />
                        <InputField label="Amount *" type="number" value={form.amount} onChange={set("amount")} placeholder="Enter amount" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddSabeelModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    yearOptions: PropTypes.arrayOf(PropTypes.string),
};

AddSabeelModal.defaultProps = {
    open: false,
    onClose: () => { },
    onSave: () => { },
    yearOptions: [],
};
