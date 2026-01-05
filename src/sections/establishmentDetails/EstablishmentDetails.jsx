import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import InputField from "../../components/InputField";
import { updateEstablishmentApi } from "../../services/establishmentService";

function toStr(v) {
    return v == null ? "" : String(v);
}

export default function EstablishmentDetailsTab({ overview, onUpdated }) {
    const initialForm = useMemo(() => {
        return {
            name: toStr(overview?.name),
            contact: toStr(overview?.partners?.[0]?.mobile || ""),
            email: toStr(overview?.email || ""),
            totalSabeel: toStr(overview?.establishment?.sabeel || ""),
            address: toStr(overview?.address || ""),
        };
    }, [overview]);

    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const setField = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const handleSave = async () => {
        try {
            setErr("");

            const establishmentId = overview?.id; // ✅ IMPORTANT: use establishment_id for update URL
            if (!establishmentId) {
                setErr("Establishment ID missing.");
                return;
            }

            const payload = {
                name: toStr(form.name).trim(),
                address: toStr(form.address).trim(),
            };

            if (!payload.name) return setErr("Name is required.");
            if (!payload.address) return setErr("Address is required.");

            setSaving(true);
            const res = await updateEstablishmentApi(establishmentId, payload);
            console.log("Update response:", res);
            // optional: show message
            // alert(res?.message || "Updated successfully");

            // ✅ refresh parent overview (so right panel updates too)
            await onUpdated?.();
        } catch (e) {
            setErr(e?.message || "Failed to update.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-[#0A4D7A] text-white text-xs px-4 py-2 font-semibold">
                Establishment Details: You can view and update establishment details over here.
            </div>

            {err ? (
                <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </div>
            ) : null}

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Name"
                        value={form.name}
                        onChange={setField("name")}
                        placeholder="Enter name"
                    />

                    <InputField
                        label="Contact"
                        value={form.contact}
                        onChange={setField("contact")}
                        placeholder="Enter contact no."
                        disabled={true} // ✅ view only
                    />

                    <InputField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={setField("email")}
                        placeholder="Enter email"
                        disabled={true} // ✅ view only
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Total Sabeel"
                        type="number"
                        value={form.totalSabeel}
                        onChange={setField("totalSabeel")}
                        placeholder="Enter here"
                        disabled={true} // ✅ view only
                    />

                    <InputField
                        label="Address"
                        value={form.address}
                        onChange={setField("address")}
                        placeholder="Enter address"
                        className="md:col-span-2"
                    />
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-md bg-sky-800 hover:bg-sky-900 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

EstablishmentDetailsTab.propTypes = {
    overview: PropTypes.object,
    onUpdated: PropTypes.func, // ✅ parent will refetch overview
};
