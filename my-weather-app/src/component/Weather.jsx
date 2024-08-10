import React from "react";
import '../WeatherDisplay.css';

export const Weather = ({ currentWeather, forecast }) => {
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const groupForecastByDay = (forecast) => {
    const groupedForecast = [];
    for (let i = 0; i < forecast.length; i += 8) { 
      groupedForecast.push(forecast.slice(i, i + 8));
    }
    return groupedForecast;
  };
  const currentDayData = forecast.slice(0, 8);
  const groupedForecast = groupForecastByDay(forecast);

  return (
    <div className="weather-main-container">
        <div>
        {currentWeather && (
        <div className="weather-container">
          <div className="weather-body-head">
          <h2 className="current-weather-name">{currentWeather.name}</h2>
          <p className="current-weather-desc">{currentWeather.weather[0].description}</p>
          <h1 className="current-weather-degree">{Math.round(currentWeather.main.temp - 273.15)}°</h1>
          </div>
          <div>
          <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="weather icon" className="weather-image" />
          </div>
        </div>         
            )}
            <div className="forecast-hourly-container">
            <h5 className="forecast-heading">Today's Forecast</h5>
            <div className="forecast-hourly">
            {currentDayData.map((item, index) => (
          <div key={index} >
            <p className="forecast-day">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <div className="icon">
              <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather icon" />
            </div>
            <p className="forecast-degree">{Math.round(item.main.temp - 273.15)}°C</p>
          </div>
        ))}
            </div>
            </div>
        </div>
      <div className="forecast">
        <h5 className="forecast-heading">5-day forecast</h5>
        {groupedForecast.map((dayForecast, dayIndex) => (
          <div key={dayIndex} className="forecast-day-list">
            <h5 className="forecast-day">{getDayName(dayForecast[0].dt)}</h5>
            <div className="icon">
            <img src={`http://openweathermap.org/img/wn/${dayForecast[0].weather[0].icon}@2x.png`} alt="weather icon" />
            <h5 className="forecast-day">{dayForecast[0].weather[0].main}</h5>
            </div>
            <p className="forecast-degree">{Math.round(dayForecast[0].main.temp - 273.15)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};
