import PropTypes from "prop-types";
import { SearchIcon, ChevronDownIcon } from "./icons";

export default function FilterBar({ search, onSearchChange, selects = [], rightSlot, }) {
    return (
        <div className="px-4 py-3 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Search */}
                <div className="relative w-full lg:w-[260px]">
                    <input
                        value={search}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                        placeholder="Search ..."
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon />
                    </span>
                </div>

                {/* Selects */}
                {selects.map((s, idx) => (
                    <div key={idx} className="relative w-full" style={{ maxWidth: s.width || 220 }}>
                        <select
                            value={s.value}
                            onChange={(e) => s.onChange?.(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                        >
                            {(s.options || []).map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <ChevronDownIcon />
                        </span>
                    </div>
                ))}

                <div className="flex-1" />

                {/* Right slot (Selected: 0 etc) */}
                <div>{rightSlot}</div>
            </div>
        </div>
    );
}

FilterBar.propTypes = {
    search: PropTypes.string,
    onSearchChange: PropTypes.func,
    selects: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            onChange: PropTypes.func,
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            placeholder: PropTypes.string,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.node,
                    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                })
            ),
        })
    ),
    rightSlot: PropTypes.node,
};

FilterBar.defaultProps = {
    selects: [],
};