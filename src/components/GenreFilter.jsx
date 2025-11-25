/**
 * GenreFilter component to select a genre filter (single-select).
 *
 * @param {{value: string|null, onChange: function, genres: Array}} props
 * @returns {JSX.Element}
 */
export default function GenreFilter({ value, onChange, genres: genresList }) {
  return (
    <select
      value={value ?? "all"}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "all" ? null : val);
      }}
      className="border rounded-md px-3 py-2 text-sm"
      aria-label="Filter by genre"
    >
      <option value="all">All Genres</option>
      {genresList.map((g) => (
        <option key={g.id} value={String(g.id)}>
          {g.title}
        </option>
      ))}
    </select>
  );
}
