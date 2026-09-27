export function slotStart24(time: string): string {
  const t = (time || "").split(" - ")[0].trim();
  if (!t) return "";
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return t.replace(/\s+/g, "");
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

export function dateToKey(date: string): string {
  if (!date) return "";
  const s = date.trim();
  if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(s)) return s.slice(0, 10);
  const ddmmyyyy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return s.slice(0, 10);
}

export function scheduledAt(b: { date?: string; time?: string }): string {
  return `${dateToKey(b.date || "")}T${slotStart24(b.time || "")}`;
}

export function sortByScheduledAt<T extends { date?: string; time?: string }>(list: T[], dir: "asc" | "desc" = "asc"): T[] {
  return [...list].sort((a, b) => {
    const ka = scheduledAt(a);
    const kb = scheduledAt(b);
    return dir === "asc" ? ka.localeCompare(kb) : kb.localeCompare(ka);
  });
}