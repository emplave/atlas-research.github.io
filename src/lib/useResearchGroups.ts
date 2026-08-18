import { useEffect, useState } from "react";
import {
  IS_SHEET_CONFIGURED,
  initialResearchGroups,
  loadResearchGroups,
  type SheetResearchGroup,
} from "./groupsSource";

export type GroupsState = {
  groups: SheetResearchGroup[];
  /** True only while the first fetch is outstanding. */
  loading: boolean;
};

/**
 * Read research groups through the live source.
 *
 * Every consumer goes through this hook rather than importing the static file,
 * so there is one place where the Sheet is read.
 *
 * `loading` starts false when no Sheet is configured, because the fallback data
 * is available synchronously and flashing a skeleton over data we already have
 * would be a fabricated delay. State is seeded from initialResearchGroups() for
 * the same reason — an effect-only fill would blank the first frame.
 *
 * The promise is cached in groupsSource, so a second mount resolves on the
 * microtask queue rather than refetching.
 */
export function useResearchGroups(): GroupsState {
  // Seeded synchronously when no Sheet is configured, so the first paint is
  // already correct and no empty state flashes.
  const [groups, setGroups] = useState<SheetResearchGroup[]>(
    initialResearchGroups
  );
  const [loading, setLoading] = useState(IS_SHEET_CONFIGURED);

  useEffect(() => {
    let live = true;
    loadResearchGroups().then((result) => {
      if (!live) return;
      setGroups(result);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  return { groups, loading };
}
