const express = require('express');
const nodefetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.enable('etag');
app.use(express.static('public'));
app.use(express.json());

app.post('/nearby', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${req.body.lat},${req.body.lon}`;
  try {
    const data = await nodefetch(url);
    const parsedData = await data.json();
    res.status(200).json(parsedData);
  } catch (err) {
    res.status(401).send('Sorry, no access to geolocation');
  }
});

app.listen(port, () => console.log('Server listening on port ' + port));
