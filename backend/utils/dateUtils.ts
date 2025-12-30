export const current = () => {
  const now = new Date();
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

  const y = est.getFullYear();
  const m = String(est.getMonth() + 1).padStart(2, "0");
  const d = String(est.getDate()).padStart(2, "0");
  const hh = String(est.getHours()).padStart(2, "0");
  const mm = String(est.getMinutes()).padStart(2, "0");
  const ss = String(est.getSeconds()).padStart(2, "0");

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}.000Z`;
}

