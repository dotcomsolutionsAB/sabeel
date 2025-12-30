export default function Pagination({
    page = 1,
    totalPages = 1,
    onChange = () => { },
}) {
    const TP = Math.max(1, Number(totalPages) || 1);
    const P = Math.min(Math.max(1, Number(page) || 1), TP);

    const canPrev = P > 1;
    const canNext = P < TP;

    const go = (p) => {
        const next = Math.max(1, Math.min(TP, p));
        onChange(next);
    };

    const pages = [];
    if (TP <= 6) {
        for (let i = 1; i <= TP; i++) pages.push(i);
    } else {
        pages.push(1, 2, 3, "dots", TP);
    }

    return (
        <div className="px-3 py-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 justify-start">
                <button
                    type="button"
                    onClick={() => go(P - 1)}
                    disabled={!canPrev}
                    className={`rounded-full border px-3 py-1.5 text-xs ${canPrev
                        ? "border-slate-200 hover:bg-slate-50"
                        : "border-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Previous
                </button>

                {pages.map((x, idx) =>
                    x === "dots" ? (
                        <span key={idx} className="px-1 text-slate-500">
                            …
                        </span>
                    ) : (
                        <button
                            key={x}
                            type="button"
                            onClick={() => go(x)}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${x === P
                                ? "bg-sky-800 text-white"
                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {x}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => go(P + 1)}
                    disabled={!canNext}
                    className={`rounded-full px-4 py-1.5 text-xs ${canNext
                        ? "bg-sky-800 text-white hover:bg-sky-900"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
