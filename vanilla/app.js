(function () {
  //Location Inputs
  let btn = document.querySelector(".search");
  let getWeather = document.querySelector(".location");
  let inputValue = document.querySelector(".inputValue");

  //Location Outputs
  let nameText = document.querySelector(".name");
  let desc = document.querySelector(".desc");
  let temp = document.querySelector(".temp");
  let windSp = document.querySelector(".windSp");
  let feelsLike = document.querySelector(".feel");
  let lat, lon;
  let date = document.querySelector(".date");
  let time = document.querySelector(".time");
  let day = document.querySelector(".day");
  //Api Key
  const apiKey = 'eeaedc426e9a4dac89032e7e32c7b718';

  let getLocation = () => {
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
  //get Date of Week
  let getDow = () => {
    let d = new Date();

    date.innerHTML = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    console.log(d);
  }
  // get Today's day in print
  let getToday = () => {
    let d = new Date();
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    Date.prototype.getDayName = function() {
      return days[ this.getDay() ];
    };

    day.innerHTML = `${d.getDayName()}`;
    console.log(d);
  }

  // get Location's current time
  let getLocTime = () => {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    time.innerHTML = `${h}:${m}:${s}`;
    checkTime();
    let t = setTimeout(getLocTime, 500);
  }

  let checkTime = (i) => {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
  
  btn.addEventListener("click", function () {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let nameVal = data.name;
        let ctry = data.sys.country;
        let tempVal = Math.round(data.main.temp);
        let descVal = data.weather[0].description;
        let feelVal = Math.round(data.main.feels_like);
        let windVal = Math.round(data.wind.speed);

        nameText.innerHTML = `${nameVal}, ${ctry}`;
        temp.innerHTML = `${tempVal}`;
        desc.innerHTML = `desc: ${descVal}`;
        windSp.innerHTML = "wind speed: " + windVal;
        feelsLike.innerHTML = "feels like: " + feelVal;
        getToday();
        getLocTime();
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
        let ctry = data.sys.country;
        let tempVal = Math.round(data.main.temp);
        let descVal = data.weather[0].description;
        let feelVal = Math.round(data.main.feels_like);
        let windVal = Math.round(data.wind.speed);

        nameText.innerHTML = `${nameVal}, ${ctry}`;
        temp.innerHTML = `${tempVal}`;
        desc.innerHTML = `desc: ${descVal}`;
        windSp.innerHTML = "wind speed: " + windVal;
        feelsLike.innerHTML = "feels like: " + feelVal;
        getToday();
        getLocTime();
        console.log(data);
      })

      .catch((err) => alert("Cannot get browser location."));
  });

  getDow()
  getLocation()

})();
