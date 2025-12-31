import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function StatCard({ variant = "big", number, label, to, onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) return onClick();
        if (to) return navigate(to);
        return undefined;
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
                {/* label may contain HTML (as your code uses dangerouslySetInnerHTML) */}
                <div className="slbl" dangerouslySetInnerHTML={{ __html: String(label ?? "") }} />
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

StatCard.propTypes = {
    variant: PropTypes.oneOf(["big", "small"]),
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    // For "small" variant you're using dangerouslySetInnerHTML, so string is the safest.
    // But keeping node allowed for "big" variant too.
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    to: PropTypes.string,
    onClick: PropTypes.func,
};

StatCard.defaultProps = {
    variant: "big",
};
