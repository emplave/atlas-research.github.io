import { useEffect, useState } from "react";
import type { AtlasEvent } from "@/data/events";
import {
  IS_EVENTS_SHEET_CONFIGURED,
  initialEvents,
  loadEvents,
} from "./eventsSource";

export type EventsState = {
  events: AtlasEvent[];
  /** True only while the first fetch is outstanding. */
  loading: boolean;
};

/**
 * Read events through the live source.
 *
 * Every consumer goes through this hook rather than importing the static array,
 * so there is one place where the Sheet is read.
 *
 * State is seeded synchronously when no Sheet is configured — an effect-only
 * fill would blank the first frame over data already in the bundle.
 */
export function useEvents(): EventsState {
  const [events, setEvents] = useState<AtlasEvent[]>(initialEvents);
  const [loading, setLoading] = useState(IS_EVENTS_SHEET_CONFIGURED);

  useEffect(() => {
    let live = true;
    loadEvents().then((result) => {
      if (!live) return;
      setEvents(result);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  return { events, loading };
}
