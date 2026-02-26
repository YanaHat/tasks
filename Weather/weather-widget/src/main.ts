import { fetchWeather } from "./api";
import { renderWeather, renderLoading, renderError } from "./render";
import { saveCity, getHistory } from "./storage";

const input = document.getElementById("cityInput") as HTMLInputElement;
const button = document.getElementById("searchBtn") as HTMLButtonElement;
const errorDiv = document.getElementById("errorMessage")!;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

button.addEventListener("click", async () => {
  const city = input.value.trim();
  if (!city) return;

  try {
    renderLoading();
    await delay(10000);
    const data = await fetchWeather(city);
    renderWeather(data);
    saveCity(city);  
    renderHistory();
  } catch (error) {
    renderError("We couldn't find the location you're looking for. Please check the spelling or try searching for a larger city.");
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