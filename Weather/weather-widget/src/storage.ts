const KEY = "weather_history";

export function saveCity(city: string) {
  const history = getHistory();
  const updated = [city, ...history.filter(c => c !== city)].slice(0, 3);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getHistory(): string[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
