import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";

export default function AddEstablishmentModal({ open, onClose, value, onChange, onSave }) {
    const set = (key) => (val) => onChange?.({ ...value, [key]: val });

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
                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-lg bg-sky-900 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-950"
                    >
                        Save
                    </button>
                </div>
            }
        >
            <div className="px-6 pt-6">
                <div className="rounded-2xl bg-gradient-to-r from-sky-700 to-sky-500 px-5 py-4 text-white">
                    <div className="text-sm font-semibold">Add Establishment</div>
                    <div className="text-xs text-white/90 mt-0.5">Fill details and click Save.</div>
                </div>
            </div>

            <div className="p-6">
                {/* 2 rows (like you asked) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                        label="Establishment Name *"
                        value={value?.name || ""}
                        onChange={set("name")}
                        placeholder="Enter establishment name"
                    />
                    <InputField
                        label="Establishment Address *"
                        value={value?.address || ""}
                        onChange={set("address")}
                        placeholder="Enter address"
                    />
                </div>
            </div>
        </Modal>
    );
}

AddEstablishmentModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
};

AddEstablishmentModal.defaultProps = {
    open: false,
    onClose: () => { },
    value: { name: "", address: "" },
    onChange: () => { },
    onSave: () => { },
};
