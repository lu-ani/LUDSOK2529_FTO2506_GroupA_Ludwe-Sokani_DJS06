/**
 * Pagination renders numbered pages and allows navigation.
 *
 * @param {{page: number, totalPages: number, onChange: function}} props
 * @returns {JSX.Element|null}
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let p = 1; p <= totalPages; p++) pages.push(p);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center mt-4"
    >
      <ul className="inline-flex items-center gap-2">
        <li>
          <button
            onClick={() => onChange(Math.max(1, page - 1))}
            className="dark:bg-slate-700 px-3 py-1 border  rounded-md text-sm"
            disabled={page === 1}
          >
            Prev
          </button>
        </li>

        {pages.map((p) => (
          <li key={p}>
            <button
              onClick={() => onChange(p)}
              className={`px-3 py-1 border rounded-md text-sm ${
                p === page
                  ? "bg-gray-800 text-white"
                  : "dark:bg-gray-500 bg-white"
              }`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => onChange(Math.min(totalPages, page + 1))}
            className="dark:bg-slate-700 px-3 py-1 border rounded-md text-sm"
            disabled={page === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
