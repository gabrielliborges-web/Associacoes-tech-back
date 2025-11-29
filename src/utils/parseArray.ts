export function parseArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((v) => v.trim());
  return [];
}

export function parseGenres(raw: any) {
  const genres: any[] = [];

  Object.keys(raw).forEach((key) => {
    const match = key.match(/^genres\[(\d+)\]\.name$/);
    if (match) {
      const index = Number(match[1]);
      genres[index] = { name: raw[key] };
    }
  });

  return genres.filter(Boolean);
}
