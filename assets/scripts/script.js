const APIKey = "cc0e1f5052229d5c8c336b1380ead2a3";
const queryUrl = `api.openweathermap.org/data/2.5/weather?q={city name}&appid=${APIKey}`;
// const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=boston&appid=${APIKey}`;
const geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=${APIKey}`;
// const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${APIKey}`;

// function getAPI(city) {
//   const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
//   fetch(currentWeatherUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${APIKey}`;
//       fetch(oneCallUrl)
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {
//           console.log(data);
//           displayToday(data);
//           displayFiveDay(data);
//         })
//     });
// }

// getAPI("boston");

function getAPI(event) {
  event.preventDefault();
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${$("#search-input").val()}&appid=${APIKey}`;
  fetch(currentWeatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${APIKey}`;
      fetch(oneCallUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          $(".weather-cards").empty();
          displayToday(data);
          displayFiveDay(data);
        })
    });
}

function displayToday(data) {
  const card = $("<div>");
  card.addClass("card");
  card.attr("style", "width: 18rem");

  const cardBody = $("<div>");
  cardBody.addClass("card-body");

  const date = $("<h5>");
  date.addClass("card-title");
  date.text(`Current, ${moment(data.current.dt, "X").format("ddd, MMM Do")}`);

  const icon = $("<img>");
  icon.addClass("card-img-top");
  icon.attr("src", `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`);
  icon.attr("alt", data.current.weather[0].description);
  
  cardBody.append(date, icon);

  const list = $("<ul>");
  list.addClass("list-group list-group-flush");

  const temp = $(`<li>Temp: ${data.current.temp} °F</li>`);
  const wind = $(`<li>Wind: ${data.current.wind_speed} mph</li>`);
  const humidity = $(`<li>Humidity: ${data.current.humidity} %</li>`);
  const UV = $(`<li>UV Index: ${data.current.uvi}</li>`);
  temp.addClass("list-group-item");
  wind.addClass("list-group-item");
  humidity.addClass("list-group-item");
  UV.addClass("list-group-item");
  if (data.current.uvi < 3) {
    UV.addClass("favorable");
  } else if (data.current.uvi < 8) {
    UV.addClass("moderate");
  } else {
    UV.addClass("severe");
  }
  
  list.append(temp, wind, humidity, UV);

  card.append(cardBody, list);
  $(".weather-cards").append(card);
}

function displayFiveDay(data) {
  for (let i = 1; i < 6; i++) {
    const card = $("<div>");
    card.addClass("card");
    card.attr("style", "width: 18rem");

    const cardBody = $("<div>");
    cardBody.addClass("card-body");

    const date = $("<h5>");
    date.addClass("card-title");
    date.text(moment(data.daily[i].dt, "X").format("ddd, MMM Do"));

    const icon = $("<img>");
    icon.addClass("card-img-top");
    icon.attr("src", `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`);
    icon.attr("alt", data.daily[i].weather[0].description);
    
    cardBody.append(date, icon);

    const list = $("<ul>");
    list.addClass("list-group list-group-flush");

    const temp = $(`<li>Temp: ${data.daily[i].temp.day} °F</li>`);
    const wind = $(`<li>Wind: ${data.daily[i].wind_speed} mph</li>`);
    const humidity = $(`<li>Humidity: ${data.daily[i].humidity} %</li>`);
    temp.addClass("list-group-item");
    wind.addClass("list-group-item");
    humidity.addClass("list-group-item");
    
    list.append(temp, wind, humidity);

    card.append(cardBody, list);
    $(".weather-cards").append(card);
  }
}

$(".btn-search").on("click", getAPI);
