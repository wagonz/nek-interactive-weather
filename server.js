const express = require('express');
const axios = require('axios');
const app = express();
const RSSParser = require('rss-parser');
const rssParser = new RSSParser();
require('dotenv').config();


app.use(express.static('public')); 
const apiKey = process.env.OPENWEATHER_API_KEY; 
app.get('/weather-by-zip', async (req, res) => {
    const zipCode = req.query.zip;
    const geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`;
    
    try {
        const geoResponse = await axios.get(geoUrl);
        const { lat, lon } = geoResponse.data;

        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        const weatherResponse = await axios.get(weatherUrl);
        res.json(weatherResponse.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});


app.get('/nytimes-rss', async (req, res) => {
    try {
        const feed = await rssParser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
        res.json(feed);
    } catch (error) {
        res.status(500).json({ message: "Error fetching RSS feed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

