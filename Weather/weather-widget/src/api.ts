import type { WeatherResponse } from "./types";

const API_KEY = "62df35f242451d70603c830655e0797b";

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found");
  }

  return response.json();
}
