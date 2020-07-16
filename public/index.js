const capitalize = input => {
  const words = input.split(' ');
  const CapitalizedWords = [];
  words.forEach(element => {
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
  });
  return CapitalizedWords.join(' ');
};

const eventTemplate = (event) => {
  const name = capitalize(event.name.toLowerCase().replace(/[-,].*$/, '').trim());
  return `
    <section class="event__card">
    <p class="event__artist" id="artist">${name}</p>
    <p class="event__date" id="date">${event.dates.start.localDate}</p>
    <p class="event__price" id="price">From ${event.priceRanges[0].min} to ${event.priceRanges[0].max} ${event.priceRanges[0].currency}</p>
    <img src="${event.images[0].url}" alt="artist" class="event__img" id="picture">
    <a href="${event.url}" target="_blank">View event</a>
    </section>`;
};

const eventContainer = document.querySelector('#event-container');

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    const data = { lat, lon };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch('/nearby', options)
      .then(response => response.json())
      .then(data => {
        const { events } = data._embedded;
        const location = data._embedded.events[0].dates.timezone;
        const locationName = document.querySelector('.location-name');
        locationName.textContent = location.replace(/\w*\//, '');
        return events.map(e => eventTemplate(e)).join('');
      })
      .then(events => {
        document.querySelector('#event-container').innerHTML = events;
      });
  });
} else {
  eventContainer.innerHTML = '<h1>Geolocation is not supported by this browser</h1>';
  console.log('geolication not available');
}