import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/addFamily.png";

// Utility function to convert to string
function toStr(v) {
    return v == null ? "" : String(v);
}

export default function AddFamilyModal({ open, onClose, onSave, sectorOptions = [] }) {
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        its: "",
        sector: "",
        gender: "male",
        mobile: "",
        email: "",
    });

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    // ✅ Reset when modal opens
    useEffect(() => {
        if (!open) return;
        setSaving(false);
        setForm({
            name: "",
            its: "",
            sector: "",
            gender: "male",
            mobile: "",
            email: "",
        });
    }, [open]);

    // Sector options (static or dynamic based on props)
    const sectorList = useMemo(() => {
        // sectorOptions can be ["A-2", ...] OR [{name:"A-2"}] OR [{label,value}]
        const raw = Array.isArray(sectorOptions) ? sectorOptions : [];

        const names = raw
            .map((s) => {
                if (typeof s === "string") return s;
                if (s?.name) return s.name;        // API style {id,name}
                if (s?.value) return s.value;      // select style {label,value}
                return "";
            })
            .map((x) => String(x || "").trim())
            .filter(Boolean)
            .filter((x) => x !== "All"); // ✅ remove "All" in modal

        const unique = Array.from(new Set(names));

        return [
            { label: "Select", value: "" },
            ...unique.map((s) => ({ label: s, value: s })),
        ];
    }, [sectorOptions]);


    // Gender options (static)
    const genderOptions = useMemo(
        () => [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
        ],
        []
    );

    // Form validation
    const validate = () => {
        if (!toStr(form.name).trim()) return "Name is required";
        if (!toStr(form.gender).trim()) return "Gender is required";
        if (!toStr(form.its).trim()) return "ITS is required";

        // Validate mobile (10 digits only, optional)
        if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
            return "Mobile must be exactly 10 digits";
        }

        // Validate email (optional, but if present, must be valid)
        if (form.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            return "Please enter a valid email address";
        }

        return "";
    };

    // Save function
    const save = async () => {
        const err = validate();
        if (err) return onSave?.({ __error: err });

        const payload = {
            name: toStr(form.name).trim(),
            its: toStr(form.its).trim(),
            sector: toStr(form.sector).trim() || null, // API: nullable
            gender: toStr(form.gender).trim(),
            mobile: toStr(form.mobile).trim() || null, // API: nullable
            email: toStr(form.email).trim() || null,   // API: nullable
        };

        try {
            setSaving(true);
            await onSave?.(payload);
            onClose?.();
        } finally {
            setSaving(false);
        }
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
                        disabled={saving}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="rounded-lg bg-sky-900 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-950 disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-900/30" />
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InputField label="Name *" value={form.name} onChange={set("name")} placeholder="Enter name" />
                        <InputField label="ITS *" value={form.its} onChange={set("its")} placeholder="Enter ITS" />

                        <InputField
                            label="Gender *"
                            type="select"
                            value={form.gender}
                            onChange={set("gender")}
                            options={genderOptions}
                        />

                        <InputField
                            label="Sector"
                            type="select"
                            value={form.sector}
                            onChange={set("sector")}
                            options={sectorList}
                        />

                        <InputField
                            label="Mobile"
                            value={form.mobile}
                            onChange={set("mobile")}
                            placeholder="Enter mobile"
                            maxLength={10} // Restrict to 10 digits
                        />
                        <InputField
                            label="Email"
                            value={form.email}
                            onChange={set("email")}
                            placeholder="Enter email"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddFamilyModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func, // async(payload)
    sectorOptions: PropTypes.arrayOf(PropTypes.string),
};
