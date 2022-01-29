const APIKey = "cc0e1f5052229d5c8c336b1380ead2a3";
const queryUrl = `api.openweathermap.org/data/2.5/weather?q={city name}&appid=${APIKey}`;
const testQueryUrl = `https://api.openweathermap.org/data/2.5/weather?zip=03801,us&appid=${APIKey}`

function getAPI() {
  fetch(testQueryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

getAPI();