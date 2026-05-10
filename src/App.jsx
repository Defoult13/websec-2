import { useEffect, useState } from 'react';
import { loadSettlements } from './data/loadSettlements';
import { getWeatherForecast } from './api/weatherApi';
import WeatherMap from './components/WeatherMap';
import WeatherChart from './components/WeatherChart';
import './App.css';


function getDateFromRecord(record) {
  return record.dt_forecast?.slice(0, 10);
}

function getWeekday(dateString) {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long'
  }).toUpperCase();
}

function getDateText(dateString) {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
}

function groupForecastByDays(forecast) {
  const grouped = {};

  forecast.forEach((record) => {
    const date = getDateFromRecord(record);
    if (!date) return;

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(record);
  });

  return Object.entries(grouped).slice(0, 7).map(([date, records]) => {
    const temps = records
      .map((item) => Number(item.temp_2_cel))
      .filter(Number.isFinite);

    const winds = records
      .map((item) => Number(item.wind_speed_10))
      .filter(Number.isFinite);

    const precipitations = records
      .map((item) => Number(item.prate))
      .filter(Number.isFinite);

    return {
      date,
      records,

      weekday: getWeekday(date),
      dateText: getDateText(date),

      tempNow: Math.round(temps[0] ?? 0),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),

      wind: Math.round(Math.max(...winds)),
      precipitation: precipitations
        .reduce((sum, value) => sum + value, 0)
        .toFixed(1)
    };
  });
}


function App() {
  const [settlements, setSettlements] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const [forecast, setForecast] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    loadSettlements().then(setSettlements);
  }, []);

  useEffect(() => {
    if (!selectedCity) return;

    setLoadingWeather(true);
    setWeatherError('');
    setForecast([]);

    getWeatherForecast(selectedCity)
      .then((data) => {
        setForecast(data);
      })
      .catch((error) => {
        console.error(error);
        setWeatherError('Не удалось загрузить прогноз');
      })
      .finally(() => {
        setLoadingWeather(false);
      });
  }, [selectedCity]);

  const filteredCities = settlements
    .filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  const forecastDays = groupForecastByDays(forecast);

  function selectCity(city) {
    setSelectedCity(city);
    setSearch('');
  }

  return (
    <div className="app">
      <main className="page">
        <h1 className="title">Погода</h1>

        {/* ПОИСК */}
        <div className="search-wrapper">
          <input
            className="search"
            placeholder="Введите город"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && filteredCities.length > 0 && (
            <div className="search-list">
              {filteredCities.map((city, index) => (
                <button
                  key={index}
                  className="search-item"
                  onClick={() => selectCity(city)}
                >
                  {city.name}, {city.region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* КАРТА */}
        <div className="map-wrapper">
          <WeatherMap
            settlements={settlements}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        </div>

        {/* НАЗВАНИЕ ГОРОДА */}
        <h2 className="city-title">
          {selectedCity ? selectedCity.name : ' '}
        </h2>

        {/* СТАТУС */}
        {loadingWeather && <p className="status">Загрузка прогноза...</p>}
        {weatherError && <p className="status error">{weatherError}</p>}
        {!selectedCity && (
          <p className="status">
            Выберите город на карте или через поиск
          </p>
        )}

      {forecastDays.map((day) => (
  <div className="forecast-card" key={day.date}>
    <div className="day-panel">
      <div className="day-name">{day.weekday}</div>
      <div className="date">{day.dateText}</div>
    </div>

    <div className="temp-block">
      <div className="now-label">Сейчас:</div>
      <div className="temp-now">{day.tempNow}°C</div>
      <div className="temp-range">
        От {day.tempMin}°C&nbsp;&nbsp;До {day.tempMax}°C
      </div>
    </div>

    <div className="weather-info">
      <div>ветер: {day.wind} м/с</div>
      <div>осадки: {day.precipitation} мм</div>
    </div>

    <div className="chart-box">
      <WeatherChart records={day.records} />
    </div>
  </div>
))}
</main>
</div>
);
}

export default App;