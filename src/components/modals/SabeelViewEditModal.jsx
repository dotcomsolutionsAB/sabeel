import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/updateSabeel.png";

function initFromRow(row) {
    return {
        isEditing: false,
        year: row?.year ?? "",
        amount: String(row?.sabeel ?? row?.amount ?? ""),
    };
}

export default function SabeelViewEditModal({ open, onClose, row, onUpdate, yearOptions = [] }) {
    const [state, setState] = useState(() => initFromRow(row));

    const set = (key) => (val) => setState((p) => ({ ...p, [key]: val }));

    const years = useMemo(() => {
        const list = yearOptions.length
            ? yearOptions
            : ["2025-26", "2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];
        return [{ label: "Select", value: "" }, ...list.map((y) => ({ label: y, value: y }))];
    }, [yearOptions]);

    const validate = () => {
        if (!state.year) return "Year is required";
        if (!String(state.amount).trim()) return "Amount is required";
        return "";
    };

    const save = () => {
        const err = validate();
        if (err) return alert(err);

        onUpdate?.({
            ...row,
            year: state.year,
            sabeel: state.amount,
        });

        onClose?.();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null}
            widthClass="max-w-xl"
            footer={
                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>

                    <div className="flex items-center gap-2">
                        {!state.isEditing ? (
                            <button
                                type="button"
                                onClick={() => set("isEditing")(true)}
                                className="rounded-lg bg-sky-700 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-800"
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={save}
                                className="rounded-lg bg-sky-900 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-950"
                            >
                                Update
                            </button>
                        )}
                    </div>
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
                <div className="w-full bg-gradient-to-r from-sky-700 to-sky-500 px-5 py-4 text-white">
                    <div className="text-xs text-white/90 mt-0.5">
                        {state.isEditing ? "Update the details and click Update." : "Click Edit to update."}
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Year *"
                            type="select"
                            value={state.year}
                            onChange={set("year")}
                            options={years}
                            disabled={!state.isEditing}
                        />

                        <InputField
                            label="Amount *"
                            type="number"
                            value={state.amount}
                            onChange={set("amount")}
                            placeholder="Enter amount"
                            disabled={!state.isEditing}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

SabeelViewEditModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    row: PropTypes.object,
    onUpdate: PropTypes.func,
    yearOptions: PropTypes.arrayOf(PropTypes.string),
};
