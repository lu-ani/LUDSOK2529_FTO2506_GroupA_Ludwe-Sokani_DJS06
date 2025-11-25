/**
 * SortSelect component to choose sorting option.
 *
 * @param {{value: string, onChange: function}} props
 * @returns {JSX.Element}
 */
export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm"
      aria-label="Sort podcasts"
    >
      <option value="newest">Newest</option>
      <option value="title-asc">Title A–Z</option>
      <option value="title-desc">Title Z–A</option>
    </select>
  );
}
