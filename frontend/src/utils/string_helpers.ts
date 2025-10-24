export function toTitleCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
