import { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import { fetchWeather } from "./api";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Dashboard</h1>
      <div className="max-w-md mx-auto">
        {loading && <Loader />}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <WeatherCard data={weatherData} onRefresh={handleSearch} />
      </div>
    </div>
  );
};

export default App;
