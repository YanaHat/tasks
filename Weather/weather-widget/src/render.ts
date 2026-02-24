import type { WeatherResponse } from "./types";

export function renderWeather(data: WeatherResponse) {
    const container = document.getElementById("weatherContainer")!;
    const date = new Date(data.dt * 1000);
    const formattedDate = date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    container.innerHTML = `
        <div class="inf">
            <img class="iconW" src="${iconUrl}" alt="weather icon" />
            <h2 class="nameCountry">${data.name}, ${data.sys.country}</h2>
            <p class="data">${formattedDate}</p>
            <h1 class="temp">${Math.round(data.main.temp)}°<span>C</span></h1>
            <p class="description">${data.weather[0].description}</p>
        </div>    
        <div class="grid">
            <div class="card">
                <span class="material-symbols-outlined text-primary mb-2">humidity_percentage</span>
                <p>Humidity</p>
                <h3>${data.main.humidity}%</h3>
            </div>
            <div class="card">
                <span class="material-symbols-outlined text-primary mb-2">air</span>
                <p>Wind</p>
                <h3>${data.wind.speed} km/h</h3>
            </div>
            <div class="card">
                <span class="material-symbols-outlined text-primary mb-2">compress</span>
                <p>Pressure</p>
                <h3>${data.main.pressure} hPa</h3>
            </div>
            <div class="card">
                <span class="material-symbols-outlined text-primary mb-2">thermostat</span>
                <p>Feels Like</p>
                <h3>${Math.round(data.main.feels_like)}°C</h3>
            </div>
        </div>
    `;
}
