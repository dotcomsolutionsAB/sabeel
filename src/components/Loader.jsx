// src/components/Loader.jsx
import PropTypes from "prop-types";
import { Atom } from "react-loading-indicators";

function getCssVar(name, fallback) {
    if (typeof window === "undefined") return fallback;
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
}

export default function Loader({ fullScreen = true, text = "" }) {
    const wrapClass = fullScreen
        ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm"
        : "flex items-center justify-center";

    // ✅ uses your CSS variable (e.g. --blue-4)
    const atomColor = getCssVar("--blue-4", "#2c86c8");

    return (
        <div className={wrapClass}>
            <Atom color={atomColor} size="medium" text={text} textColor={getCssVar("--ink", "#111827")} />
        </div>
    );
}

Loader.propTypes = {
    fullScreen: PropTypes.bool,
    text: PropTypes.string,
};
