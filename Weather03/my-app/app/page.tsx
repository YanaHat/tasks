"use client"; 

import { useWeather } from "../hooks/useWeather";
import { Logo } from "./components/logo/Logo";
import { Search } from "./components/search/SearchBar";
import { History } from "./components/history/History";
import { Error } from "./components/states/Error";
import { Loading } from "./components/states/Loading";
import WeatherCard from "./components/weatherCard/WeatherCard";
import WeatherDetails from "./components/weatherDetails/WeatherDetails";
import WeatherMap from "./components/weatherMap/WeatherMap";
import "./globals.css";

export default function Home() {
  const { data, loading, error, history, getWeather } = useWeather();

  return (
    <main className="container">
      <Logo />
      <Search onSearch={getWeather}/>
      <History cities={history} onSelect={getWeather} />

      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : (
        data && (
          <>
            <WeatherCard data={data} />
            <WeatherDetails data={data} />
            <WeatherMap lat={data.coord.lat} lon={data.coord.lon} />
          </>
        )
      )}
    </main>
  );
}