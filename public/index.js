const eventTemplate = (event) => `
    <section class="event__card">
    <p class="event__artist" id="artist">${event.name}</p>
    <p class="event__date" id="date">${event.dates.start.localDate}</p>
    <p class="event__price" id="price">From <span id="from"></span> to <span id="to"> to</span></p>
    <img src="${event.images[0].url}" width="100px" height="100px" alt="artist" class="event__img" id="picture">
    </section>`;

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
