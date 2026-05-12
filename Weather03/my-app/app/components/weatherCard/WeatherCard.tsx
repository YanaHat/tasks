import type { WeatherResponse } from "../../../types/weather";
import classes from "./WeatherCard.module.css"

export default function WeatherCard({ data }: { data: WeatherResponse }) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div className={classes.info}>
      <img alt={"ico"} src={iconUrl} />
      <h2>{data.name}, {data.sys.country}</h2>
      <h1>{Math.round(data.main.temp)}<span>°C</span></h1>
      <p>{data.weather[0].description}</p>
    </div>
  );
}