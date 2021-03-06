const APIKey = "cc0e1f5052229d5c8c336b1380ead2a3";
let searchHistory = [];

// Creates search history buttons when page is loaded
createButtons();


function getWeather(city) {
  // Calls Current Weather API with city name
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  fetch(currentWeatherUrl)
    .then(function (response) {
      // Stops function if invalid city
      if (!response.ok) {
        return;
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Uses coordinates from Current Weather API to call One Call API
      const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${APIKey}`;
      fetch(oneCallUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          // Deletes weather cards before adding new cards
          $(".today-card").empty();
          $(".five-day-cards").empty();
          // Displays weather cards
          displayToday(data);
          displayFiveDay(data);
          const history = JSON.parse(localStorage.getItem("Searched Cities"));
          searchHistory = history || [];
          // If city not already in local storage, saves city to local storage
          if (!searchHistory.includes($("#search-input").val())) {
            searchHistory.push($("#search-input").val());
            localStorage.setItem("Searched Cities", JSON.stringify(searchHistory));
          }
          // Updates history buttons
          createButtons();
        })
    });
}

function createButtons() {
  $(".history-buttons").empty();
  // Creates button for each city saved in local storage
  const history = JSON.parse(localStorage.getItem("Searched Cities"));
  if (history) {
    history.forEach(element => {
      const button = $(`<button>${element}</button>`);
      button.addClass("btn btn-primary history-btn");
      button.attr("type", "button");
      $(".history-buttons").append(button);
    });
  }
}

// Creates today's weather card
function displayToday(data) {
  const card = $("<div>");
  card.addClass("card");
  card.attr("style", "width: 18rem");

  const cardBody = $("<div>");
  cardBody.addClass("card-body");

  const date = $("<h5>");
  date.addClass("card-title");
  date.text(moment(data.current.dt, "X").format("ddd, MMM Do"));

  const icon = $("<img>");
  icon.addClass("card-img-top");
  icon.attr("src", `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`);
  icon.attr("alt", data.current.weather[0].description);

  cardBody.append(date, icon);

  const list = $("<ul>");
  list.addClass("list-group list-group-flush");

  const temp = $(`<li>Temp: ${data.current.temp} ??F</li>`);
  const wind = $(`<li>Wind: ${data.current.wind_speed} mph</li>`);
  const humidity = $(`<li>Humidity: ${data.current.humidity} %</li>`);
  const UV = $(`<li>UV Index: ${data.current.uvi}</li>`);
  temp.addClass("list-group-item");
  wind.addClass("list-group-item");
  humidity.addClass("list-group-item");
  UV.addClass("list-group-item");
  // Colors UV index according to value
  if (data.current.uvi < 3) {
    UV.addClass("favorable");
  } else if (data.current.uvi < 8) {
    UV.addClass("moderate");
  } else {
    UV.addClass("severe");
  }

  list.append(temp, wind, humidity, UV);

  card.append(cardBody, list);
  $(".today-card").append(card);
}

// Creates five-day weather cards
function displayFiveDay(data) {
  for (let i = 1; i < 6; i++) {
    const card = $("<div>");
    card.addClass("card");
    card.attr("style", "width: 15rem");

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

    const temp = $(`<li>Temp: ${data.daily[i].temp.day} ??F</li>`);
    const wind = $(`<li>Wind: ${data.daily[i].wind_speed} mph</li>`);
    const humidity = $(`<li>Humidity: ${data.daily[i].humidity} %</li>`);
    temp.addClass("list-group-item");
    wind.addClass("list-group-item");
    humidity.addClass("list-group-item");

    list.append(temp, wind, humidity);

    card.append(cardBody, list);
    $(".five-day-cards").append(card);
  }
}

// Adds event listener for search input
$(".search-btn").on("click", submitInputBox);

// Adds event listener for each history button
$(".history-buttons").on("click", ".history-btn", submitHistoryButton);

// Defines city and calls getWeather(city)
function submitInputBox(event) {
  event.preventDefault();
  let city = $("#search-input").val().trim();
  getWeather(city);
}

// Defines city and calls getWeather(city)
function submitHistoryButton() {
  let city = $(this).text();
  getWeather(city);
}
