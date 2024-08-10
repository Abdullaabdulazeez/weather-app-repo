import React, { useState, useEffect } from 'react';
import '../Favorites.css';
import axios from 'axios';

export const Favorites = ({ favorites, addFavorite, removeFavorite }) => {
    const [newFav, setNewFav] = useState("");
    const [favoriteDetails, setFavoriteDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (favorites.length > 0) {
            fetchFavoriteDetails();
        } else {
            setFavoriteDetails([]); 
        }
    }, [favorites]);

    const handleChange = (e) => {
        setNewFav(e.target.value);
    };

    const handleAddFav = () => {
        if (newFav.trim()) {
            addFavorite(newFav);
            setNewFav('');
        }
    };

    const fetchFavoriteDetails = async () => {
        setLoading(true);
        const API_KEY = "0fe64e504e655b6884a2e87b29adafdd";
        try {
            const details = await Promise.all(
                favorites.map(async (fav) => {
                    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${fav.city}&appid=${API_KEY}`);
                    return { ...fav, weather: res.data.weather[0], main: res.data.main };
                })
            );
            setFavoriteDetails(details);
        } catch (error) {
            console.error("Error fetching favorite details", error);
        }
        setLoading(false);
    };

    const handleRemoveFavorite = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/favorites/${id}`);
            setFavoriteDetails(favoriteDetails.filter(fav => fav.id !== id));
            removeFavorite(id);
        } catch (error) {
            console.error("Error removing favorite", error);
        }
    };

    return (
        <div className="favorites">
            <input
                type="text"
                value={newFav}
                onChange={handleChange}
                placeholder='Add favorite city'
            />
            <button onClick={handleAddFav}>Add</button>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    favoriteDetails.length > 0 ? (
                        favoriteDetails.map((el) => (
                            <div key={el.id} className="favorite-item">
                                <div className="favorite-info">
                                    <img src={`http://openweathermap.org/img/wn/${el.weather.icon}@2x.png`} alt="weather icon" />
                                    <div>
                                        <p>{el.city}</p>
                                        <p>{el.weather.description}</p>
                                    </div>
                                    <h2 className='fav-degree'>{Math.round(el.main.temp - 273.15)}°C</h2>
                                </div>
                                <button onClick={() => handleRemoveFavorite(el.id)}>Remove</button>
                            </div>
                        ))
                    ) : (
                        <p>No favorites added yet</p>
                    )
                )}
            </div>
        </div>
    );
};
