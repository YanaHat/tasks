export interface WeatherResponse {
    name: string;
    dt: number;
    sys: {
        country: string;
    }
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}
