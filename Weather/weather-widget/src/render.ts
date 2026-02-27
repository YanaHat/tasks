import type { WeatherResponse } from "./types";

function clearContainer(container: HTMLElement) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createDetailCard(
  iconName: string,
  label: string,
  value: string
): HTMLDivElement {
  const card = createElement("div", "card");

  const icon = createElement(
    "span",
    "material-symbols-outlined text-primary mb-2",
    iconName
  );

  const title = createElement("p", undefined, label);
  const data = createElement("h3", undefined, value);

  card.append(icon, title, data);
  return card;
}

export function renderWeather(data: WeatherResponse) {
  const container = document.getElementById("weatherContainer")!;
  clearContainer(container);

  document.querySelector(".container")?.classList.remove("loading");
  container.classList.remove("weatherLoad");
  document.querySelector(".search")?.classList.remove("searchError");

  const date = new Date(data.dt * 1000);
  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${data.name}`;

  const info = createElement("div", "inf");

  const icon = createElement("img", "iconW") as HTMLImageElement;
  icon.src = iconUrl;
  icon.alt = "weather icon";

  const title = createElement(
    "h2",
    "nameCountry",
    `${data.name}, ${data.sys.country}`
  );

  const dateEl = createElement("p", "data", formattedDate);

  const temp = createElement("h1", "temp");
  temp.textContent = `${Math.round(data.main.temp)}°`;
  const celsius = createElement("span", undefined, "C");
  temp.appendChild(celsius);

  const description = createElement(
    "p",
    "description",
    data.weather[0].description
  );

  info.append(icon, title, dateEl, temp, description);

  const grid = createElement("div", "grid");

  grid.append(
    createDetailCard(
      "humidity_percentage",
      "Humidity",
      `${data.main.humidity}%`
    ),
    createDetailCard("air", "Wind", `${data.wind.speed} km/h`),
    createDetailCard(
      "compress",
      "Pressure",
      `${data.main.pressure} hPa`
    ),
    createDetailCard(
      "thermostat",
      "Feels Like",
      `${Math.round(data.main.feels_like)}°C`
    )
  );

  const map = createElement("div", "map");

  const img = createElement("img",
    "w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
  ) as HTMLImageElement;

  img.src =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDQGAJLuVNdOKKx5FWBnQgRNlaPqrdo99p6HXV6uJS9hJyn91KxTIp4xdJQt7adWWjoikjhbr9PrRKLXFPIb7VUk8juy0BZrKt5qSOFQA3OIK3ejMcA9a_ZWTBWyWfj7Ok1FI_aa7YGxgufRCNd9hEqxm7Ou-7sh0JEjnX-DLgSy_XKjrL61j2IDZ06lnbFViIBp2eo1mwxlVYoMnth_Ln4k-enmZ3zO5kwfLbFkKZMevgjt7MG9NOxa2-fYtWIE1-CNwVwQccLFgE";

  const mapBtn = createElement("div", "mapBtn");
  const mapInner = createElement("div");

  const locationIcon = createElement(
    "span",
    "material-symbols-outlined text-primary",
    "location_on"
  );

  const link = createElement("a", "map-btn", "View detailed map") as HTMLAnchorElement;
  link.href = mapUrl;
  link.target = "_blank";

  mapInner.append(locationIcon, link);
  mapBtn.appendChild(mapInner);
  map.append(img, mapBtn);

  container.append(info, grid, map);
}

export function renderLoading() {
  const container = document.getElementById("weatherContainer")!;
  clearContainer(container);

  document.querySelector(".container")?.classList.add("loading");
  container.classList.add("weatherLoad");
  document.querySelector(".search")?.classList.remove("searchError");

  const loading = createElement("div", "inf");
  const text = createElement("h2", "nameCountry", "Loading...");
  loading.appendChild(text);

  container.appendChild(loading);
}

export function renderError(message: string) {
  const container = document.getElementById("weatherContainer")!;
  clearContainer(container);

  document.querySelector(".container")?.classList.remove("loading");
  container.classList.remove("weatherLoad");
  document.querySelector(".search")?.classList.add("searchError");

  const wrapper = createElement("div", "errorState");
  const error = createElement("div", "error");

  const icon = createElement(
    "span",
    "material-symbols-outlined text-7xl text-red-400/80 relative",
    "location_off"
  );

  const title = createElement("h2", "errorTitle", "City not found");
  const subtitle = createElement("p", "errorSubtitle", message);

  error.append(icon, title, subtitle);
  wrapper.appendChild(error);

  container.appendChild(wrapper);
}