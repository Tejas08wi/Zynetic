import { useState, useEffect } from 'react';
import { fetchForecast } from '../api';
import ClipLoader from 'react-spinners/ClipLoader';

const WeatherCard = ({ data, onRefresh }) => {
  const [forecast, setForecast] = useState(null);
  const [recentCities, setRecentCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentCities(savedSearches);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      enableDarkMode();
    } else {
      enableLightMode();
    }

    if (data?.name) {
      loadForecast(data.name);
    }
  }, [data]);

  const loadForecast = (cityName) => {
    setLoading(true);
    fetchForecast(cityName)
      .then(setForecast)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const enableDarkMode = () => {
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
  };

  const enableLightMode = () => {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
  };

  const toggleTheme = () => {
    const isNowDark = !darkMode;
    setDarkMode(isNowDark);
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    isNowDark ? enableDarkMode() : enableLightMode();
  };

  const handleInputChange = (e) => {
    setCityInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      searchCity(cityInput.trim());
    }
  };

  const searchCity = (city) => {
    const updated = [
      city,
      ...recentCities.filter((c) => c.toLowerCase() !== city.toLowerCase())
    ].slice(0, 5);

    setRecentCities(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setCityInput('');
    onRefresh(city);
  };

  const getDailyForecasts = () => {
    if (!forecast?.list) return [];
    const grouped = {};
    forecast.list.forEach((item) => {
      const day = new Date(item.dt * 1000).toLocaleDateString();
      if (!grouped[day]) grouped[day] = item;
    });
    return Object.values(grouped).slice(0, 5);
  };

  // Styles based on theme
  const styles = {
    card: {
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#000',
    },
    button: {
      backgroundColor: darkMode ? '#555' : '#e5e5e5',
      color: darkMode ? '#fff' : '#000',
    },
    forecastItem: {
      backgroundColor: darkMode ? '#444' : '#f0f0f0',
      color: darkMode ? '#fff' : '#000',
    },
  };

  return (
    <div className="shadow-lg rounded-xl p-6 mt-6 w-full max-w-md mx-auto" style={styles.card}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{data?.name || 'Search for a city'}</h2>
        <div>
          {data && (
            <button
              onClick={() => onRefresh(data.name)}
              className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Refresh
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded transition"
            style={styles.button}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* City Search */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={cityInput}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="flex-grow px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Recently Searched */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Recent Searches:</h3>
        {recentCities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => searchCity(city)}
                className="px-3 py-1 text-sm rounded hover:opacity-80 transition"
                style={styles.button}
              >
                {city}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: darkMode ? '#aaa' : '#666' }}>
            No recent searches
          </p>
        )}
      </div>

      {/* Current Weather */}
      {data && (
        <>
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-4xl font-bold">{Math.round(data.main.temp)}°C</p>
              <p className="capitalize">{data.weather[0].description}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="w-20 h-20"
            />
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <p>Humidity: {data.main.humidity}%</p>
            <p>Wind: {data.wind.speed} km/h</p>
          </div>

          {/* 5-Day Forecast */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">5-Day Forecast:</h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <ClipLoader
                  color={darkMode ? '#fff' : '#000'}
                  loading={loading}
                  size={35}
                />
              </div>
            ) : forecast ? (
              <div className="grid grid-cols-5 gap-2">
                {getDailyForecasts().map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center p-2 rounded"
                    style={styles.forecastItem}
                  >
                    <p className="text-xs">
                      {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                        weekday: 'short',
                      })}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="Weather icon"
                      className="w-10 h-10 mx-auto"
                    />
                    <p className="text-sm font-bold">{Math.round(item.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: darkMode ? '#aaa' : '#666' }}>
                No forecast data available
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherCard;
