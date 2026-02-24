import { fetchWeather } from "./api";
import { renderWeather } from "./render";

const input = document.getElementById("cityInput") as HTMLInputElement;
const button = document.getElementById("searchBtn") as HTMLButtonElement;
const errorDiv = document.getElementById("errorMessage")!;

button.addEventListener("click", async () => {
  const city = input.value.trim();
  if (!city) return;

  try {
    errorDiv.textContent = "Loading...";
    const data = await fetchWeather(city);
    renderWeather(data);
    errorDiv.textContent = "";
  } catch (error) {
    errorDiv.textContent = "City not found, please try again";
  }
});
