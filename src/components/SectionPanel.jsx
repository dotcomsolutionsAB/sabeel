export default function SectionPanel({ title, children }) {
    return (
        <div className="sabeel-panel rounded-2xl overflow-hidden">
            <div className="sabeel-panel-header px-4 py-3 text-white font-semibold">
                {title}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}
