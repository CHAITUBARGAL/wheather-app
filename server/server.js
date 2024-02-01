const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

app.use(cors());  // Add this line
app.use(bodyParser.json());

app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;

  if (!cities || !Array.isArray(cities)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const weatherPromises = cities.map(async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e286577a87f5a1c9b089a11c6506f0c4`);
      const temperature = response.data.main.temp;
      return { [city]: `${Math.round(temperature - 273.15)}C` };
    } catch (error) {
      console.error(`Error fetching weather for ${city}: ${error.message}`);
      return { [city]: 'N/A' };
    }
  });

  const weatherResults = await Promise.all(weatherPromises);
  const result = { weather: Object.assign({}, ...weatherResults) };

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
