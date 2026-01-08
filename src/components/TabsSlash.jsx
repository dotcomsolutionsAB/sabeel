import PropTypes from "prop-types";

export default function TabsSlash({ tabs = [], value, onChange }) {
    const slant = 26; // controls the "/" cut (increase/decrease)

    return (
        <div className="w-full">
            {/* full width bar (like screenshot background) */}
            <div className="w-full rounded-md border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm overflow-hidden">
                <div className="flex justify-start">
                    <div className="inline-flex items-stretch gap-5">
                        {tabs.map((t, idx) => {
                            const active = t.key === value;

                            // clip-paths to match screenshot:
                            // first: right slant only                          polygon(26px 0px, calc(90% - 26px) 0px, 86% 100%, 50px 150%)
                            // middle: right slant (left handled via overlap) polygon(0px 0px, calc(100% - 26px) 0px, 100% 100%, 0px 100%)
                            // last: left slant only, right straight edge     polygon(0px 0px, calc(100% - 25%) -10px, 100% 100%, 25px 100%)
                            const clipPath =
                                idx === 0
                                    // ? `polygon(0 0, calc(100% - ${slant}px) 0, 100% 100%, 0 100%)`
                                    // ? `polygon(100%)`
                                    // : idx === tabs.length - 1
                                    // ? `polygon(${slant}px 0, 100% 0, 100% 100%, 0 100%)`
                                    // : `polygon(${slant}px 0, calc(100% - ${slant}px) 0, 100% 100%, 0 100%)`;

                                    ? `polygon(100%)`
                                    : idx === tabs.length - 1
                                        ? `polygon(100%)`
                                        : `polygon(100%)`;

                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => onChange?.(t.key)}
                                    style={{
                                        clipPath,
                                        marginLeft: idx === 0 ? 0 : -slant, // ✅ removes first-gap & makes clean diagonal joins
                                    }}
                                    className={[
                                        "relative h-10 min-w-[170px] px-6",
                                        "flex items-center justify-center",
                                        "font-semibold text-sm whitespace-nowrap",
                                        "transition-all",
                                        // colors like screenshot
                                        active
                                            ? "text-white bg-gradient-to-b from-[#0A4D7A] to-[#083D63] shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]"
                                            : "text-[#0A4D7A] bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200",
                                        // keep active on top so edges look perfect
                                        active ? "z-20" : "z-10",
                                        "focus:outline-none",
                                    ].join(" ")}
                                >
                                    {t.label}

                                    {/* subtle diagonal separator shine (like the image) */}
                                    {idx !== tabs.length - 1 && (
                                        <span
                                            className="absolute top-0 right-0 h-full w-6 opacity-40 pointer-events-none"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, rgba(255,255,255,0) 35%, rgba(0,0,0,0.08) 50%, rgba(255,255,255,0) 65%)",
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* bottom line like screenshot */}
                <div className="h-px bg-slate-200" />
            </div>
        </div>
    );
}

TabsSlash.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.node.isRequired,
        })
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};
