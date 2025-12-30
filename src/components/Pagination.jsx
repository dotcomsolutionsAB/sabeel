export default function Pagination({
    page = 1,
    totalPages = 1,
    onChange = () => { },
}) {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const go = (p) => onChange(Math.max(1, Math.min(totalPages, p)));

    // show: Previous 1 2 3 … 10 Next (like image)
    const pages = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1, 2, 3, "dots", totalPages);
    }

    return (
        <div className="px-3 py-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 justify-start">
                <button
                    onClick={() => go(page - 1)}
                    disabled={!canPrev}
                    className={`rounded-full border px-3 py-1.5 text-xs ${canPrev
                            ? "border-slate-200 hover:bg-slate-50"
                            : "border-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Previous
                </button>

                {pages.map((p, idx) =>
                    p === "dots" ? (
                        <span key={idx} className="px-1 text-slate-500">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => go(p)}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${p === page
                                    ? "bg-sky-800 text-white"
                                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => go(page + 1)}
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
