const capitalize = input => {
  const words = input.split(' ');
  const CapitalizedWords = [];
  words.forEach(element => {
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
  });
  return CapitalizedWords.join(' ');
};

const localEventTemplate = (event) => {
  const name = capitalize(event.name.toLowerCase().replace(/[-,].*$/, '').trim());
  return `
  <a href="${event.url}" target="_blank"><section class="event__card">
    <h2 class="event__artist" id="artist">${name}</h2>
    <p class="event__date" id="date">${event.dates.start.localDate}</p>
    <p class="event__price" id="price">From ${event.priceRanges[0].min} to ${event.priceRanges[0].max} ${event.priceRanges[0].currency}</p>
    <img src="${event.images[0].url}" alt="artist" class="event__img" id="picture">
    </section></a>`;
};

const eventTemplate = event => {
  const name = event.name.replace(/,.*$/, '').trim();
  const location = event.dates.timezone;
  const locationName = location ? location.replace(/\w*\//, '').replace('_', ' ') : '' ;
  return `
  <a href="${event.url}" target="_blank"><section class="event__card">
    <h2 class="event__artist" id="artist">${name}</h2>
    <p class="event__date" id="date">${event.dates.start.localDate}</p>
    <p class="event__date" id="date">${locationName}</p>
    <img src="${event.images[0].url}" alt="artist" class="event__img" id="picture">
    </section></a>`;
};

const div = document.querySelector('#event-container');
const locationName = document.querySelector('.location-name');

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
        locationName.textContent = 'You are in ' + location.replace(/\w*\//, '');
        return events.map(e => localEventTemplate(e)).join('');
      })
      .then(events => {
        div.innerHTML = events;
      });
  });
} else {
  div.innerHTML = '<h1>Geolocation is not supported by this browser</h1>';
  console.log('geolication not available');
}

const searchEvent = () => {
  const { value } = document.querySelector('#search');
  fetch(`/search/${value}`)
    .then(response => response.json())
    .then(data => {
      if (data._embedded) {
        const { events } = data._embedded;
        console.log(events)
        locationName.textContent = '';
        return events.map(e => eventTemplate(e)).join('');
      } else {
        locationName.textContent = `Sorry, no events for ${value}`;
        }
    })
    .then(events => {
      div.innerHTML = events || '';
    });
};

const searchCity = () => {
  const { value } = document.querySelector('#city_search');
  fetch(`/find/${value}`)
    .then(response => response.json())
    .then(data => {
      if (data._embedded) {
      const { events } = data._embedded;
      const location = data._embedded.events[0].dates.timezone;
      locationName.textContent = location.replace(/\w*\//, '').replace('_', ' ');
      return events.map(e => eventTemplate(e)).join('');
    } else {
      locationName.textContent = `Sorry, no events for ${value}`;
      }
    })
    .then(events => {
      div.innerHTML = events || '';
    });
};

window.onload = () => {
  const findEventBtn = document.querySelector('#submit');
  findEventBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchEvent();
    document.querySelector('#search').value = '';
  });

  const findCityBtn = document.querySelector('#submit_city');
  findCityBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchCity();
    document.querySelector('#city_search').value = '';
  });
};
