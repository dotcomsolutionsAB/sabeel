import { useNavigate } from "react-router-dom";

export default function StatCard({ variant = "big", number, label, to, onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) return onClick();
        if (to) return navigate(to);
    };

    const commonProps = {
        onClick: handleClick,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
            }
        },
    };

    if (variant === "small") {
        return (
            <div className="small-card" {...commonProps}>
                <div className="snum">{number}</div>
                <div className="slbl" dangerouslySetInnerHTML={{ __html: label }} />
            </div>
        );
    }

    return (
        <div className="big-card" {...commonProps}>
            <div className="num">{number}</div>
            <div className="lbl">{label}</div>
        </div>
    );
}
