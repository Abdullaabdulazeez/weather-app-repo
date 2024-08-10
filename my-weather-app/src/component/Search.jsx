import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Search.css';

const API_KEY = '0fe64e504e655b6884a2e87b29adafdd'; 

export const Search = ({ fetchWeather }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    fetchWeather(suggestion.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    setCity('');
    setShowSuggestions(false);
  };

  return (
    <div className='search'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={city}
          onChange={handleChange}
          placeholder='Search for cities'
        />
        <button type='submit' className='search-button'>
          <i className='fa-solid fa-magnifying-glass'></i>
        </button>
      </form>
      {showSuggestions && (
        <ul className='suggestions-list'>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
