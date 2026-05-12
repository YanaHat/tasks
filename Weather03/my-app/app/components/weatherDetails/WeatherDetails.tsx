import type { WeatherResponse } from "../../../types/weather";
import classes from "./WeatherDetails.module.css";

function WeatherDetails({ data }: { data: WeatherResponse }) {
  return (
    <div className={classes.grid}>
      <div className={classes.card}>
        <span className="material-symbols-outlined">water_drop</span>
        <p>Humidity</p>
        <h3>{data.main.humidity}%</h3>
      </div>
      <div className={classes.card}>
        <span className="material-symbols-outlined">air</span>
        <p>Wind speed</p>
        <h3>{data.wind.speed} km/h</h3>
      </div>
      <div className={classes.card}>
        <span className="material-symbols-outlined">bar_chart</span>
        <p>Pressure</p>
        <h3>{data.main.pressure} hPa</h3>
      </div>
      <div className={classes.card}>
        <span className="material-symbols-outlined">thermostat</span>
        <p>Feels Like</p>
        <h3>{Math.round(data.main.feels_like)}°C</h3>
      </div>
    </div>
  );
}
export default WeatherDetails;