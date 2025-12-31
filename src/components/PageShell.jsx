import PropTypes from "prop-types";

export default function PageShell({ bg, logoSrc, title, children, overlayClass = "bg-white/10", topGap = 100, }) {
    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${bg})` }}
            />

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClass}`} />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pb-10">
                {/* Top gap */}
                <div style={{ height: `${topGap}px` }} />

                {/* Header (logo + title) */}
                {(logoSrc || title) && (
                    <div className="flex flex-col items-center gap-3 mb-6">
                        {logoSrc && (
                            <img src={logoSrc} alt="Logo" className="h-[100px] w-[100px] object-contain" />
                        )}
                        {title && (
                            <div className="text-center">
                                <div className="text-[var(--authBtn)] font-bold text-2xl">{title}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Page body */}
                {children}
            </div>
        </div>
    );
}

PageShell.propTypes = {
    bg: PropTypes.string,
    logoSrc: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node,
    overlayClass: PropTypes.string,
    topGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PageShell.defaultProps = {
    overlayClass: "bg-white/10",
    topGap: 100,
};
