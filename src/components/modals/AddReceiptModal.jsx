import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/AddRecieptHeader.png";


export default function AddReceiptModal({ open, onClose, hofName = "-" }) {
    const [year, setYear] = useState("");
    const [mode, setMode] = useState("");
    const [amount, setAmount] = useState("");
    const [comments, setComments] = useState("");

    const save = () => {
        console.log({ year, mode, amount, comments });
        onClose?.();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null} // ✅ header is custom below (like your image)
            widthClass="max-w-2xl"
            footer={
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-w-[120px] rounded-lg border border-[#004D84] text-[#004D84] font-semibold px-5 py-2 hover:bg-sky-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        className="min-w-[120px] rounded-lg bg-[#004D84] text-white font-semibold px-5 py-2 hover:opacity-95"
                    >
                        Save
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                {/* ✅ Image header like screenshot */}
                <div className="relative h-28 bg-slate-100">
                    <img
                        src={headerImg}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-sky-900/30" />

                </div>

                {/* HOF bar */}
                <div className="bg-[#004D84] px-5 py-2 text-white text-sm font-semibold">
                    HOF Name: <span className="font-bold">{hofName}</span>
                </div>

                {/* form */}
                <div className="p-5 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Year"
                            type="text"
                            placeholder="YYYY - YYYY"
                            value={year}
                            onChange={setYear}
                        />

                        <InputField
                            label="Mode"
                            type="select"
                            value={mode}
                            onChange={setMode}
                            options={[
                                { label: "Select", value: "" },
                                { label: "Cash", value: "cash" },
                                { label: "Cheque", value: "cheque" },
                                { label: "NEFT/UPI", value: "neft" },
                            ]}
                        />

                        <InputField
                            label="Amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={setAmount}
                        />
                    </div>

                    <div className="mt-4">
                        <InputField
                            label="Comments"
                            type="textarea"
                            placeholder="Enter comments"
                            rows={3}
                            value={comments}
                            onChange={setComments}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddReceiptModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    hofName: PropTypes.string,
};