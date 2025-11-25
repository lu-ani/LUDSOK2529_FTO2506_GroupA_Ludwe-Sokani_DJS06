/**
 * SearchBar component (controlled) that syncs with URL via setSearchParams.
 *
 * @param {{value: string, onChange: function}} props
 * @returns {JSX.Element}
 */
export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search podcasts by title..."
      className="border rounded-md px-3 py-2 text-sm w-full md:w-full"
      aria-label="Search podcasts"
    />
  );
}
