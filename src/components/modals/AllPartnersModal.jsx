import PropTypes from "prop-types";
import Modal from "../Modal";
import { UsersIcon } from "../icons";

export default function AllPartnersModal({ open, onClose, partners, placeholderImg }) {
    const list = Array.isArray(partners) ? partners : [];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={null}
            widthClass="max-w-4xl"
            footer={
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-sky-300 bg-white px-8 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                    >
                        Close
                    </button>
                </div>
            }
        >
            {/* header like your image */}
            <div className="px-6 pt-6">
                <div className="rounded-2xl bg-gradient-to-r from-sky-200 to-sky-400 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center border border-sky-200">
                            <UsersIcon className="w-5 h-5 text-sky-700" />
                        </div>
                        <div className="font-semibold text-sky-900">All Partners</div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {list.length === 0 ? (
                    <div className="text-sm text-slate-600">No partners</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {list.map((p, idx) => (
                            <div
                                key={`${p?.its || "na"}-${idx}`}
                                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={p?.url || placeholderImg}
                                        onError={(e) => {
                                            e.currentTarget.src = placeholderImg;
                                        }}
                                        alt=""
                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-50"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                                            {p?.name || "-"}
                                        </div>
                                        <div className="text-[11px] text-slate-600 mt-1">
                                            ITS : {p?.its || "-"}
                                            <br />
                                            Sector : {p?.sector || "-"}
                                            <br />
                                            Mobile : {p?.mobile || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

AllPartnersModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    partners: PropTypes.array,
    placeholderImg: PropTypes.string,
};

AllPartnersModal.defaultProps = {
    open: false,
    onClose: () => { },
    partners: [],
    placeholderImg: "",
};
