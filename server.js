const express = require('express');
const nodefetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.enable('etag');
app.use(express.static('public'));
app.use(express.json());

app.post('/nearby', async (req, res) => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${req.body.lat},${req.body.lon}`;
  try {
    const data = await nodefetch(url);
    const parsedData = await data.json();
    res.status(200).json(parsedData);
  } catch (err) {
    res.status(401).send('Sorry, no access to geolocation');
  }
});

app.get('/search/:event', async (req, res) => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${req.params.event}&&apikey=${apiKey}`;
  try {
    const data = await nodefetch(url);
    const parsedData = await data.json();
    res.status(200).json(parsedData);
  } catch (err) {
    res.status(404).send(`Sorry, event not found`);
  }
});

app.get('/find/:city', async (req, res) => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${req.params.city}&&apikey=${apiKey}`;
  try {
    const data = await nodefetch(url);
    const parsedData = await data.json();
    res.status(200).json(parsedData);
  } catch (err) {
    res.status(404).send(`Sorry, city not found`);
  }
});

app.listen(port, () => console.log('Server listening on port ' + port));
