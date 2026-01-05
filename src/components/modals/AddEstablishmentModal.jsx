import PropTypes from "prop-types";
import Modal from "../Modal";
import InputField from "../InputField";
import headerImg from "../../assets/images/addNewEstablishment.png";
import { createEstablishmentApi } from "../../services/establishmentService"; // Import the API function
import { useState } from "react";
import SuccessToast from "../SuccessToast"; // Import SuccessToast component
import ErrorToast from "../ErrorToast"; // Import ErrorToast component

export default function AddEstablishmentModal({ open, onClose, value, onChange, onSave }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const set = (key) => (val) => onChange?.({ ...value, [key]: val });

    const handleSave = async () => {
        try {
            if (!value?.name.trim() || !value?.address.trim()) {
                setErrorMessage("Establishment name and address are required");
                setShowError(true);
                return;
            }

            // Prepare the payload including the additional fields
            const payload = {
                name: value?.name,
                address: value?.address,
                its: "",              // Nullable, empty string by default
                status: "active",     // Default status
                type: "business",     // Default type
                remarks: "Regular partner", // Default remarks
            };

            // Call the API to create the establishment
            const response = await createEstablishmentApi(payload);

            // Log the full response to check its structure
            console.log("API Response:", response);

            // Check if the establishment_id exists in the response (indicating success)
            if (response?.establishment_id) {
                setShowSuccess(true); // Show success toast
                setErrorMessage("");  // Clear any previous errors

                // Set a timeout before closing the modal to allow the toast to be seen
                setTimeout(() => {
                    onSave?.();           // If you want to call the onSave callback after successful creation
                    onClose();            // Close the modal
                }, 2500);  // Keep the modal open for at least 2.5 seconds to let the toast show
            } else {
                setErrorMessage("Failed to save establishment");
                setShowError(true);   // Show error toast
            }
        } catch (error) {
            console.error("Caught error:", error);
            setErrorMessage(error?.message || "Something went wrong");
            setShowError(true); // Show error toast
        }
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
                    <button
                        type="button"
                        onClick={handleSave} // Call handleSave on button click
                        className="rounded-lg bg-sky-900 text-white px-4 py-2 text-xs font-semibold hover:bg-sky-950"
                    >
                        Save
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
            </div>

            {/* Success Toast */}
            <SuccessToast
                show={showSuccess}
                message="Establishment created successfully!" // You can also pass the response.message if needed
                onClose={() => setShowSuccess(false)} // Close after a timeout
            />

            {/* Error Toast */}
            <ErrorToast
                show={showError}
                message={errorMessage} // Message from the API or generic error
                onClose={() => setShowError(false)} // Close after a timeout
            />
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
