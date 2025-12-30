export default function GlassCard({ children, className = "", blur = 20 }) {
    return (
        <div
            className={[
                "relative w-full rounded-[26px] px-7 py-7 overflow-hidden",
                className,
            ].join(" ")}
            style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`, // ✅ Safari support
            }}
        >
            {/* glossy shine */}
            <div className="pointer-events-none absolute -top-14 -left-14 h-48 w-48 rounded-full bg-white/25 blur-3xl" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-white/30 to-transparent" />

            {children}
        </div>
    );
}
