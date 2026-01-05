// src/components/modals/PartnerModal.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/editReciept.png"; // use your image

function toStr(v) {
    return v == null ? "" : String(v);
}

export default function AddOrEditPartnerModal({ open, onClose, onSave, partner }) {
    // partner = null => add, partner object => update
    const isEdit = !!partner;

    const [name, setName] = useState("");
    const [its, setIts] = useState("");
    const [sector, setSector] = useState("");
    const [mobile, setMobile] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        setName(toStr(partner?.name));
        setIts(toStr(partner?.its));
        setSector(toStr(partner?.sector));
        setMobile(toStr(partner?.mobile));
        setSaving(false);
    }, [open, partner]);

    const sectorOptions = useMemo(
        () => [
            { label: "Select", value: "" },
            { label: "BURHANI", value: "BURHANI" },
            { label: "EZZY", value: "EZZY" },
            { label: "MOHAMMEDI", value: "MOHAMMEDI" },
            { label: "SHUJAI", value: "SHUJAI" },
            { label: "ZAINY", value: "ZAINY" },
            { label: "OTHER", value: "OTHER" },
        ],
        []
    );

    const save = async () => {
        if (!name.trim()) return alert("Name is required");
        if (!sector) return alert("Sector is required");

        const payload = {
            // if edit, keep id so parent can call update api
            id: partner?.id,
            name: name.trim(),
            its: its.trim(),
            sector,
            mobile: mobile.trim(),
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
            widthClass="max-w-3xl"
            footer={
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        className="min-w-[110px] rounded-md border border-sky-300 bg-white px-6 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="min-w-[110px] rounded-md bg-sky-800 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
                        onClick={save}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : isEdit ? "Update" : "Save"}
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-900/20" />
                    <div className="absolute left-5 top-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-300 bg-white">
                            <span className="text-sky-700 font-bold">👥</span>
                        </div>
                        <div className="text-white font-extrabold drop-shadow">
                            {isEdit ? "Edit Partner" : "Add / Update Partner"}
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Name" value={name} onChange={setName} placeholder="Enter name" />
                        <InputField label="ITS" value={its} onChange={setIts} placeholder="Enter ITS (optional)" />
                        <InputField
                            label="Sector"
                            type="select"
                            value={sector}
                            onChange={setSector}
                            options={sectorOptions}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Mobile" value={mobile} onChange={setMobile} placeholder="Enter mobile" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddOrEditPartnerModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func, // async(payload)
    partner: PropTypes.object, // null for add, row for edit
};
