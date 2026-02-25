import { fetchWeather } from "./api";
import { renderWeather, renderError } from "./render";
import { saveCity, getHistory } from "./storage";

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
    saveCity(city);  
    renderHistory();
    errorDiv.textContent = "";
  } catch (error) {
    renderError("We couldn't find the location you're looking for.");
    errorDiv.textContent = "";
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click(); 
  }
});

function renderHistory() {
  const historyContainer = document.getElementById("historyContainer")!;
  const cities = getHistory();

  historyContainer.innerHTML = `
    <span class="history">Recent:</span>
    ${cities
      .map(
        (city) =>
          `<button class="history-item" data-city="${city}"><span class="material-symbols-outlined text-xs">history</span>${city}</button>`
      )
      .join("")}
  `;

  document.querySelectorAll(".history-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const city = (btn as HTMLElement).dataset.city!;
      input.value = city;

      const data = await fetchWeather(city);
      renderWeather(data);
    });
  });
}

renderHistory();
