import { useEffect, useState } from "react";
import type { Publication } from "@/data/publications";
import {
  IS_PUBLICATIONS_SHEET_CONFIGURED,
  initialPublications,
  loadPublications,
} from "./publicationsSource";

export type PublicationsState = {
  publications: Publication[];
  /** True only while the first fetch is outstanding. */
  loading: boolean;
};

/**
 * Read publications through the live source.
 *
 * Every consumer goes through this hook rather than importing the static array,
 * so there is one place where the Sheet is read.
 *
 * State is seeded synchronously when no Sheet is configured — an effect-only
 * fill would blank the first frame over data already in the bundle.
 */
export function usePublications(): PublicationsState {
  const [publications, setPublications] = useState<Publication[]>(
    initialPublications
  );
  const [loading, setLoading] = useState(IS_PUBLICATIONS_SHEET_CONFIGURED);

  useEffect(() => {
    let live = true;
    loadPublications().then((result) => {
      if (!live) return;
      setPublications(result);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  return { publications, loading };
}
