import { weatherApiKey, unsplashKey } from './config.js';

(function () {
  
  "use strict";
  
  //Location Inputs
  const btn = document.querySelector(".search");
  const inputValue = document.querySelector(".inputValue");
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.querySelector(".search-bar");
  const searchContent = document.querySelector(".search-content");
  // const getWeather = document.querySelector(".location");


  //Location Outputs
  const nameText = document.querySelector(".name");
  const desc = document.querySelector(".desc");
  const temp = document.querySelector(".temp");
  const tempIcon = document.querySelector(".tempIcon");
  // const windSp = document.querySelector(".windSp");
  const feelsLike = document.querySelector(".feel");
  // let lat, lon;
  const date = document.querySelector(".date");
  const time = document.querySelector(".time");
  const day = document.querySelector(".day");
  const minTmp = document.querySelector(".min-tmp");
  const maxTmp = document.querySelector(".max-tmp");
  //Api Key
  const openWApiKey = weatherApiKey;
  const unsplashApiKey = unsplashKey;
  
  searchIcon.onclick = () => {
    //Focus Search Bar (Expand it).
    searchBar.focus();
    //Show Search title (Concatenate the pre-defined classnames with show classname)
    // searchTitle.setAttribute("class", searchTitle.className + " show");
  };

  // searchBar.onblur = () => {
    //Empty the input content
    // this.value = "";
    /*Hide Search Title (replace method returns new string with provided values stripped) so simply removing show class from the class names list*/
    // searchTitle.setAttribute("class", searchTitle.className.replace("show", ""));
  // };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        },
        (err) => {
          console.error(err);
        }, {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser!");
    }
  };
  //get Date of Week
  const getDow = () => {
    let d = new Date();

    date.innerHTML = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    console.log(d);
  };
  // get Today's day in print
  const getToday = () => {
    let d = new Date();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    Date.prototype.getDayName = function () {
      return days[this.getDay()];
    };

    day.innerHTML = `${d.getDayName()}`;
    console.log(d);
  };

  // get Location's current time
  const getLocTime = () => {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    time.innerHTML = `${h}:${m}:${s}`;
    checkTime();
    let t = setTimeout(getLocTime, 500);
  };

  const checkTime = (i) => {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  };


  const getWeatherData = () => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&appid=${openWApiKey}`
      )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((data) => {
        let nameVal = data.name;
        let ctry = data.sys.country;
        let tempVal = Math.round(data.main.temp);
        let descVal = data.weather[0].description;
        let feelVal = Math.round(data.main.feels_like);
        let minTmpVal = Math.round(data.main.temp_min);
        let maxTmpVal = Math.round(data.main.temp_max);
        // let windVal = Math.round(data.wind.speed);
        let stylingClass = ["dot", "position-absolute", "bottom-50", "end-50"];

        nameText.innerHTML = `${nameVal}, ${ctry}`;
        //Adds array of styling classes.
        tempIcon.classList.add(...stylingClass);
        tempIcon.innerHTML = `<div class="position-absolute" id="dot2"></div>`;
        temp.innerHTML = `${tempVal}`;
        minTmp.innerHTML = "min temp: " + minTmpVal;
        maxTmp.innerHTML = "max temp: " + maxTmpVal;
        desc.innerHTML = `desc: ${descVal}`;
        feelsLike.innerHTML = "feels like: " + feelVal;
        getToday();
        getLocTime();
        console.log(data);
      })
      .catch((err) => console.log("Not found"));
  };

  const getUnsplashPhoto = () => {
    fetch(
        `https://api.unsplash.com/search/photos/?client_id=${unsplashApiKey}&query=${inputValue.value}`
      )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((pictureData) => {
        let randomNum = Math.floor(Math.random() * 10);
        let unsplashQuery = pictureData.results[randomNum];
        let imgRegUrl = unsplashQuery.urls.raw;
        let stylingClass = ['angled_container', 'angled_container--open-right']
        // let polyShape = `<div class="angled_container angled_container--open-right start-50 translate-middle"></div>`
        
        document.getElementById('bg-pic').style.backgroundImage = `url('${imgRegUrl}')`
        document.getElementById('bg-pic').style.backgroundRepeat = `no-repeat`
        document.getElementById('bg-pic').style.backgroundAttachment = `fixed`
        document.getElementById('bg-pic').style.backgroundPosition = `center`
        document.getElementById('bg-pic').style.backgroundSize = `cover`
        document.getElementById('bg-pic').classList.add(...stylingClass);
        
        console.log(unsplashQuery)
        console.log(imgRegUrl);
        return unsplashQuery;

      }).catch((err) => console.log("Not found", err));
  };

  const getDayForcast = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&appid=${openWApiKey}`
      ).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      }).then((data) => {
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${openWApiKey}&units=metric`);
      }).then((respTwo) => {
        if (respTwo.ok) {
          return respTwo.json();
        } else {
          return Promise.reject(respTwo);
        }
      }).then((dataTwo) => {
        const htDataa = dataTwo.daily.map(item => {
          let timestamp = new Date(item.dt * 1000);
          let readDate = timestamp.toDateString(); 
          console.log(timestamp)
          return `<h3>${readDate}</h3>
                  <ul>
                    <li>
                      ${item.temp.day}
                    </li>
                  </ul>
          `; 
       });
        document.getElementById("dayForcast").innerHTML = htDataa.join('');
        console.log(dataTwo)
      }).catch((err) => console.log("Not found Forcast", err));
      
  }

  searchBar.onkeydown = (e) => {
    //If key name is Enter show alert with current input value
    if (e.key === "Enter") {
      getUnsplashPhoto();
      // DOW - Date of Week
      getDow();
      getDayForcast();
      getWeatherData();
      searchBar.value = ''
      // Removes searchbar
      // searchContent.remove();
    }
  };

  // getWeather.addEventListener("click", function () {
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let nameVal = data.name;
  //       let ctry = data.sys.country;
  //       let tempVal = Math.round(data.main.temp);
  //       let descVal = data.weather[0].description;
  //       let feelVal = Math.round(data.main.feels_like);
  //       let windVal = Math.round(data.wind.speed);

  //       nameText.innerHTML = `${nameVal}, ${ctry}`;
  //       temp.innerHTML = `${tempVal}`;
  //       desc.innerHTML = `desc: ${descVal}`;
  //       windSp.innerHTML = "wind speed: " + windVal;
  //       feelsLike.innerHTML = "feels like: " + feelVal;
  //       getToday();
  //       getLocTime();
  //       console.log(data);
  //     })

  //     .catch((err) => alert("Cannot get browser location."));
  // });

  
  // getLocation();
})();

// @TODO Use localStorage to save location data but refresh unsplashQuery Image on reload   
// let result = `<img src="${imgRegUrl}" alt="${imgAltDesc}" class="bg-pic" style="width:550px; height:350px; border:1px solid black;">`