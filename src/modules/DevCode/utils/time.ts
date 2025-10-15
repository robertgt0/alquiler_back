export function toLocalParts(d: Date, tz = "America/Santo_Domingo") {
  const fmt = new Intl.DateTimeFormat("es-ES", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false
  });
  const parts = fmt.formatToParts(d).reduce((acc, p) => (acc[p.type] = p.value, acc), {} as any);
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,    // YYYY-MM-DD local
    time: `${parts.hour}:${parts.minute}`,                 // HH:mm local
  };
}
