export default function StatCard({ value, label }) {
    return (
        <div className="sabeel-stat rounded-2xl px-7 py-6 text-white shadow-soft">
            <div className="text-3xl font-extrabold tracking-wide text-center">{value}</div>
            <div className="text-center mt-2 text-sm font-semibold opacity-95">{label}</div>
        </div>
    );
}
