import InputField from "../../components/InputField";
import PropTypes from "prop-types";

export default function LeftHofSection({ value, onChange, onSave }) {
    const set = (key) => (val) => onChange?.({ ...value, [key]: val });

    return (
        <>
            {/* Blue info bar */}
            <div className="bg-gradient-to-r from-[#0A4D7A] to-[#083D63] text-white px-5 py-3 text-sm font-semibold">
                HOF Details:{" "}
                <span className="font-normal">
                    You can view and update HOF details over here.
                </span>
            </div>

            {/* Form */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField
                        label="Name"
                        type="text"
                        placeholder="Enter name"
                        value={value?.name || ""}
                        onChange={set("name")}
                    />

                    <InputField
                        label="ITS"
                        type="text"
                        placeholder="Enter ITS"
                        value={value?.its || ""}
                        onChange={set("its")}
                    />

                    <InputField
                        label="Gender"
                        type="select"
                        value={value?.gender || ""}
                        onChange={set("gender")}
                        options={[
                            { label: "Select", value: "" },
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                        ]}
                    />

                    <InputField
                        label="Mobile"
                        type="text"
                        placeholder="Enter mobile no"
                        value={value?.mobile || ""}
                        onChange={set("mobile")}
                    />

                    <InputField
                        label="Email"
                        type="text"
                        placeholder="Enter email"
                        value={value?.email || ""}
                        onChange={set("email")}
                    />

                    <InputField
                        label="DOB"
                        type="date"
                        placeholder="DD - MM - YYYY"
                        value={value?.dob || ""}
                        onChange={set("dob")}
                    />

                    <InputField
                        label="Sector"
                        type="select"
                        value={value?.sector || ""}
                        onChange={set("sector")}
                        options={[
                            { label: "Select", value: "" },
                            { label: "MOHANMEDI", value: "MOHANMEDI" },
                            { label: "BURHANI", value: "BURHANI" },
                            { label: "SAIFI", value: "SAIFI" },
                        ]}
                    />

                    <div className="md:col-span-2">
                        <InputField
                            label="Address"
                            type="text"
                            placeholder="Enter address"
                            value={value?.address || ""}
                            onChange={set("address")}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-lg bg-[#0A4D7A] text-white font-semibold px-5 py-2 hover:opacity-95 shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}

LeftHofSection.propTypes = {
    value: PropTypes.shape({
        name: PropTypes.string,
        its: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        gender: PropTypes.oneOf(["male", "female", ""]),
        mobile: PropTypes.string,
        email: PropTypes.string,
        dob: PropTypes.string,
        sector: PropTypes.string,
        address: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onSave: PropTypes.func,
};

LeftHofSection.defaultProps = {
    value: {},
    onChange: () => { },
    onSave: () => { },
};