(function () {
  let btn = document.querySelector(".search");
  let getWeather = document.querySelector(".location");
  let inputValue = document.querySelector(".inputValue");
  let nameText = document.querySelector("#name");
  let desc = document.querySelector(".desc");
  let temp = document.querySelector(".temp");
  let country = document.querySelector(".country");
  let lat, lon;
  const apiKey = 'eeaedc426e9a4dac89032e7e32c7b718';

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        },
        (err) => {
          console.error(err);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser!");
    }
  }

  getLocation()

  btn.addEventListener("click", function () {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let nameVal = data.name;
        let tempVal = Math.round(data.main.temp);
        let descVal = data.weather[0].description;

        nameText.innerHTML = nameVal;
        temp.innerHTML = "temp: " + tempVal;
        desc.innerHTML = "desc: " + descVal;
        console.log(data);
      })

      .catch((err) => alert("wrong country"));
  });

  getWeather.addEventListener("click", function () {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let nameVal = data.name;
        let tempVal = Math.round(data.main.temp);
        let descVal = data.weather[0].description;

        nameText.innerHTML = nameVal;
        temp.innerHTML = "temp: " + tempVal;
        desc.innerHTML = "desc: " + descVal;
        console.log(data);
      })

      .catch((err) => alert("Cannot get browser location."));
  });
})();
