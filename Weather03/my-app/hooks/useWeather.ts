"use client";

import { useState, useEffect } from "react";
import { fetchWeather } from "@/lib/weather";
import type { WeatherResponse } from "@/types/weather";
import WeatherStorage from "../lib/storage/WeatherStorage";

export function useWeather() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]); 

  useEffect(() => {
    setHistory(WeatherStorage.getHistory());

    const lastCity = WeatherStorage.getLastCity();
    if (lastCity) {
      getWeather(lastCity);
    }
  }, []);

  const getWeather = async (city: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchWeather(city);
      setData(result);
      
      WeatherStorage.saveCity(city);
      setHistory(WeatherStorage.getHistory()); 
    } catch {
      setError("City not found");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, history, getWeather };
}