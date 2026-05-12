export async function fetchWeather(city: string) {
  const res = await fetch(`/api/weather?city=${city}`);

  if (!res.ok) {
    throw new Error("City not found");
  }

  return res.json();
}