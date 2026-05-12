class WeatherStorage {
  private static readonly KEY = "weather_history";
  private static readonly LAST_CITY_KEY = "last_weather_city"; // Новый ключ
  private static readonly MAX_ITEMS = 3;

  public static getHistory(): string[] {
    if (typeof window === "undefined") return []; 
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveCity(city: string): void {
    if (typeof window === "undefined") return;

    const history = this.getHistory();
    const updated = [
      city, 
      ...history.filter(item => item.toLowerCase() !== city.toLowerCase())
    ].slice(0, this.MAX_ITEMS);
    localStorage.setItem(this.KEY, JSON.stringify(updated));

    localStorage.setItem(this.LAST_CITY_KEY, city);
  }

  public static getLastCity(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.LAST_CITY_KEY);
  }
}

export default WeatherStorage;