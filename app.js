const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const zipcode = req.body.zipCode;

  const apiKey = "My secret api key";
  const url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&appid=" + apiKey + "&units=imperial";

  https.get(url, function(response) {

    if (response.statusCode !== 200) {
      res.sendFile(__dirname + "/error.html");
    } else {
      response.on("data", function(data) {

        const weatherData = JSON.parse(data);
        const mainlyToday = weatherData.weather[0].main;
        const rightNow = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const temp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const tempMin = weatherData.main.temp_min;
        const tempMax = weatherData.main.temp_max;
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;
        const visiblilty = weatherData.visibility;
        const windSpeed = weatherData.wind.speed;
        const sunrise = weatherData.sys.sunrise;
        const sunset = weatherData.sys.sunset;
        const cityName = weatherData.name;
        const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.write("<h1>City: " + cityName + " (" + zipcode + ")</h1>");
        res.write("<p>Mostly: " + mainlyToday + "</p>");
        res.write("<p>Currently: " + rightNow + "</p>");
        res.write("<img src=" + imgURL + ">");
        res.write("<p>Temperature: " + temp + "</p>");
        res.write("<p>Feels Like: " + feelsLike + "</p>");
        res.write("<p>Min Temp: " + tempMin + "</p>");
        res.write("<p>Max Temp: " + tempMax + "</p>");
        res.write("<p>Pressure: " + pressure + "</p>");
        res.write("<p>Humidity: " + humidity + "</p>");
        res.write("<p>Visibility: " + visiblilty + "</p>");
        res.write("<p>Wind Speed: " + windSpeed + "</p>");
        res.write("<p>Sunrise: " + sunrise + "</p>");
        res.write("<p>Sunset: " + sunset + "</p>");
        res.send();
      });
    }
  });
});

app.post("/error", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
})
