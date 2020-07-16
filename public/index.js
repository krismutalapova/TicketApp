window.addEventListener('load', () => {
    let lon;
    let lat;
    let locationName = document.querySelector('.location-name');
    let eventContainer = document.querySelector('#event-container');
    const eventTemplate = (event) => `
    <section class="event__card">
    <p class="event__artist" id="artist">${event.name}</p>
    <p class="event__date" id="date">${event.dates.start.localDate}</p>
    <p class="event__price" id="price">From <span id="from"></span> to <span id="to"> to</span></p>
    <img src="${event.images[0].url}" width="100px" height="100px" alt="artist" class="event__img" id="picture">
    </section>`;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=2P74PXuICGG1AseG6pKeMd3ZohyWVvBA&latlong=${lat},${lon}`;
          

            fetch(api)
                .then(response => response.json())
                .then(data => {
                    const {events} = data._embedded;
                    const location = data._embedded.events[0].dates.timezone;
                    locationName.textContent = location.replace(/\w*\//, '');
                    return events.map(e => eventTemplate(e)).join('');
                })
                .then(events => eventContainer.innerHTML = events);
        });

    }
});