import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/addFamily.png";

export default function AddFamilyModal({ open, onClose, onSave, sectorOptions = [] }) {
    const [form, setForm] = useState({
        name: "",
        its: "",
        sector: "",
        mobile: "",
        email: "",
    });

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const sectorList = useMemo(() => {
        const opts = sectorOptions?.length
            ? sectorOptions
            : ["MOHANMEDI", "BURHANI", "SAIFI"];
        return [{ label: "Select", value: "" }, ...opts.map((s) => ({ label: s, value: s }))];
    }, [sectorOptions]);

    const validate = () => {
        if (!form.name.trim()) return "Name is required";
        if (!String(form.its).trim()) return "ITS is required";
        if (!form.sector) return "Sector is required";
        if (!String(form.mobile).trim()) return "Mobile is required";
        if (!String(form.email).trim()) return "Email is required";
        return "";
    };

    const save = () => {
        const err = validate();
        if (err) return alert(err);
        onSave?.(form);
        onClose?.();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null}
            widthClass="max-w-2xl"
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
            {/* Header (same vibe as your other modals) */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                {/* ✅ Image header like screenshot */}
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-sky-900/30" />

                </div>

                {/* Form */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Row 1 */}
                        <InputField label="Name *" value={form.name} onChange={set("name")} placeholder="Enter name" />
                        <InputField label="ITS *" value={form.its} onChange={set("its")} placeholder="Enter ITS" />
                        <InputField label="Sector *" type="select" value={form.sector} onChange={set("sector")} options={sectorList} />

                        {/* Row 2 */}
                        <InputField label="Mobile *" value={form.mobile} onChange={set("mobile")} placeholder="Enter mobile" />
                        <InputField label="Email *" value={form.email} onChange={set("email")} placeholder="Enter email" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddFamilyModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    sectorOptions: PropTypes.arrayOf(PropTypes.string),
};

AddFamilyModal.defaultProps = {
    open: false,
    onClose: () => { },
    onSave: () => { },
    sectorOptions: [],
};
