export default function StatCard({ variant = "big", number, label }) {
    if (variant === "small") {
        return (
            <div className="small-card">
                <div className="snum">{number}</div>
                <div className="slbl" dangerouslySetInnerHTML={{ __html: label }} />
            </div>
        );
    }

    return (
        <div className="big-card">
            <div className="num">{number}</div>
            <div className="lbl">{label}</div>
        </div>
    );
}
