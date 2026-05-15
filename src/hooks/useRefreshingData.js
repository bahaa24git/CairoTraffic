import { useEffect } from "react";

export const DATA_CHANGED_EVENT = "cairo-traffic:data-changed";

export function notifyDataChanged() {
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

export default function useRefreshingData(loadData, deps = [], intervalMs = 10000) {
  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (!cancelled) loadData();
    };

    refresh();

    const intervalId = window.setInterval(refresh, intervalMs);
    window.addEventListener("focus", refresh);
    window.addEventListener(DATA_CHANGED_EVENT, refresh);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(DATA_CHANGED_EVENT, refresh);
    };
  }, deps);
} 