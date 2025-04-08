const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found or API error.");
  }

  return await response.json();
};

export const fetchForecast = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found or API error.");
  }

  return await response.json();
};
