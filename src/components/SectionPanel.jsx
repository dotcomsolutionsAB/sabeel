import PropTypes from "prop-types";
import StatCard from "./StatCard";

export default function SectionPanel({ tone = "mint", bigCards = [], smallCards = [] }) {
    return (
        <section className={`panel ${tone}`}>
            <div className="cards-grid">
                {bigCards.map((c, idx) => (
                    <StatCard
                        key={idx}
                        variant="big"
                        number={c.number}
                        label={c.label}
                        to={c.to}
                        onClick={c.onClick}
                    />
                ))}
            </div>

            <div className="small-row">
                {smallCards.map((c, idx) => (
                    <StatCard
                        key={idx}
                        variant="small"
                        number={c.number}
                        label={c.label}
                        to={c.to}
                        onClick={c.onClick}
                    />
                ))}
            </div>
        </section>
    );
}

SectionPanel.propTypes = {
    tone: PropTypes.string,
    bigCards: PropTypes.arrayOf(
        PropTypes.shape({
            number: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            to: PropTypes.string,
            onClick: PropTypes.func,
        })
    ),
    smallCards: PropTypes.arrayOf(
        PropTypes.shape({
            number: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            to: PropTypes.string,
            onClick: PropTypes.func,
        })
    ),
};

SectionPanel.defaultProps = {
    tone: "mint",
    bigCards: [],
    smallCards: [],
};
