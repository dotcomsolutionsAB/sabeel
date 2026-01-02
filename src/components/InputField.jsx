import PropTypes from "prop-types";

export default function InputField({
    label,
    type = "text",        // text | number | date | email | password | select | textarea
    value = "",
    onChange = () => { },
    placeholder = "",
    options = [],         // only for select
    rows = 3,             // only for textarea
    disabled = false,
    className = "",
}) {
    return (
        <div className={className}>
            {label ? (
                <div className="text-xs font-semibold text-slate-700 mb-1">{label}</div>
            ) : null}

            {type === "select" ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="input-underline rounded-md"
                >
                    {options.map((o) => (
                        <option key={o.value ?? o.label} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    className="input-underline rounded-md resize-none"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="input-underline rounded-md"
                />
            )}
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: PropTypes.oneOf([
        "text",
        "number",
        "date",
        "email",
        "password",
        "select",
        "textarea",
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

InputField.defaultProps = {
    label: "",
    type: "text",
    value: "",
    onChange: () => { },
    placeholder: "",
    options: [],
    rows: 3,
    disabled: false,
    className: "",
};