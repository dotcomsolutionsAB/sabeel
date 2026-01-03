import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/editUser.png"; // ✅ use same header image style

function toStr(v) {
    return v == null ? "" : String(v);
}

export default function EditUserModal({ open, onClose, user, onUpdate }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const [saving, setSaving] = useState(false);

    // ✅ load data when modal opens
    useEffect(() => {
        if (!open) return;

        setName(toStr(user?.name));
        setUsername(toStr(user?.username));
        setPassword(""); // ✅ keep blank (only set if user wants to change)

        setMobile(toStr(user?.mobile || "")); // if API doesn't have mobile, it stays empty
        setEmail(toStr(user?.email || ""));
        setRole(toStr(user?.role || ""));
        setSaving(false);
    }, [open, user]);

    const roleOptions = useMemo(
        () => [
            { label: "Select", value: "" },
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
        ],
        []
    );

    const update = async () => {
        if (!name.trim()) return alert("Name is required");
        if (!username.trim()) return alert("Username is required");
        if (!role) return alert("User Type is required");

        // ✅ only send password if typed
        const payload = {
            id: user?.id,
            name: name.trim(),
            username: username.trim(),
            mobile: mobile.trim(),
            email: email.trim(),
            role,
            ...(password.trim() ? { password } : {}),
        };

        try {
            setSaving(true);
            await onUpdate?.(payload);
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
                        onClick={update}
                        disabled={saving}
                    >
                        {saving ? "Updating..." : "Update"}
                    </button>
                </div>
            }
        >
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                {/* ✅ Header */}
                <div className="relative h-28 bg-slate-100">
                    <img src={headerImg} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-900/20" />
                </div>

                {/* ✅ Form */}
                <div className="p-5">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Name" value={name} onChange={setName} placeholder="Enter name" />
                        <InputField
                            label="Username"
                            value={username}
                            onChange={setUsername}
                            placeholder="Enter username"
                        />
                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter password"
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Mobile" value={mobile} onChange={setMobile} placeholder="Enter mobile" />
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter email"
                        />
                        <InputField
                            label="User Type"
                            type="select"
                            value={role}
                            onChange={setRole}
                            options={roleOptions}
                        />
                    </div>

                    {/* optional small hint */}
                    <div className="mt-3 text-[11px] text-slate-500">
                        Leave password blank if you don’t want to change it.
                    </div>
                </div>
            </div>
        </Modal>
    );
}

EditUserModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    user: PropTypes.object,
    onUpdate: PropTypes.func, // async(payload)
};
