import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Search } from './component/Search';
import { Weather } from './component/Weather';
import { Favorites } from './component/Favorites';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorite] = useState([]);
  const [lastSearch, setLastSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('weather'); 

  useEffect(() => {
    const item = localStorage.getItem("lastSearch");
    if (item) {
      fetchWeather(item);
    }
  }, []);

  const fetchWeather = async (city) => {
    const API_KEY = "0fe64e504e655b6884a2e87b29adafdd";
    setLoading(true);
    try {
      const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list);
      setLastSearch(city);
      localStorage.setItem("lastSearch", city);
    } catch (error) {
      console.error("Error fetching weather data", error);
    } finally {
      setLoading(false);
    }
  };

  const getFavorite = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/favorites`);
      setFavorite(res.data);
    } catch (error) {
      console.error("Error fetching favorites", error);
    }
  };

  const addFavorite = async (city) => {
    try {
      await axios.post(`http://localhost:8080/favorites`, { city });
      getFavorite();
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/favorites/${id}`);
      getFavorite();
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <p onClick={() => setSelectedComponent('weather')} className={selectedComponent === 'weather' ? 'active' : ''}>
          <i className="fa-solid fa-house"></i>
        </p>
        <p onClick={() => setSelectedComponent('favorites')} className={selectedComponent === 'favorites' ? 'active' : ''}>
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>
      <div className="content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {selectedComponent === 'weather' && (
              <>
              <Search fetchWeather={fetchWeather} />
              <Weather currentWeather={weather} forecast={forecast} />
              </>
            )}
            {selectedComponent === 'favorites' && (
              <Favorites favorites={favorites} addFavorite={addFavorite} removeFavorite={removeFavorite} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
