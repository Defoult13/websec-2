export async function loadSettlements() {
  const response = await fetch('/top.csv');
  const text = await response.text();

  const lines = text.split('\n').slice(1);

  const settlements = lines
    .map((line) => {
      line = line.trim();
      if (!line) return null;

      const parts = line.split(';');

      if (parts.length < 5) return null;

      return {
        name: parts[0],
        region: parts[1],
        population: Number(parts[2]),
        lat: Number(parts[3]),
        lon: Number(parts[4])
      };
    })
    .filter(Boolean);

  return settlements;
}