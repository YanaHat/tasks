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
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${data.name}`;

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
        <div class="map card">
            <img class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Topographic map view of New York City landscape" data-location="New York City" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQGAJLuVNdOKKx5FWBnQgRNlaPqrdo99p6HXV6uJS9hJyn91KxTIp4xdJQt7adWWjoikjhbr9PrRKLXFPIb7VUk8juy0BZrKt5qSOFQA3OIK3ejMcA9a_ZWTBWyWfj7Ok1FI_aa7YGxgufRCNd9hEqxm7Ou-7sh0JEjnX-DLgSy_XKjrL61j2IDZ06lnbFViIBp2eo1mwxlVYoMnth_Ln4k-enmZ3zO5kwfLbFkKZMevgjt7MG9NOxa2-fYtWIE1-CNwVwQccLFgE">
            <div class="mapBtn">
                <div>
                    <span class="material-symbols-outlined text-primary">location_on</span>
                    <a href="${mapUrl}" target="_blank" class="map-btn">View detailed map</a>
                </div>    
            </div>    
        </div>
    `;
}
