import { useEffect, useState } from "react";

/**
 * Hook that binds a state value to a URL search param key.
 * Updates the URL param when the value changes (no page reload).
 * Reads initial value from the URL param on mount.
 *
 * @param {string} key - The search param key to sync (e.g. "search", "genre").
 * @param {string} initial - The initial value used if the param is absent.
 * @param {object} searchParamsAPI - object returned by useSearchParams: [searchParams, setSearchParams]
 * @returns {[string, function]} Tuple: [value, setValue]
 */
export default function useQueryState(
  key,
  initial,
  [searchParams, setSearchParams]
) {
  const initialValue = searchParams.get(key) ?? initial;
  const [value, setValueState] = useState(initialValue);

  // Sync internal state when URL changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    let changed = false;

    if (!newParams.has("sort")) {
      newParams.set("sort", "newest");
      changed = true;
    }

    if (!newParams.has("search")) {
      newParams.set("search", "");
      changed = true;
    }

    if (!newParams.has("page")) {
      newParams.set("page", "1");
      changed = true;
    }

    if (changed) setSearchParams(newParams);
  }, []);

  /**
   * Update state AND update the URL param (keeps other params intact).
   * Passing `null` will remove the param.
   * @param {string|null} next
   */
  function setValue(next) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (next === null || next === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, next);
      }

      return newParams;
    });

    setValueState(next ?? "");
  }

  return [value, setValue];
}
