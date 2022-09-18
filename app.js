require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  const bkey = process.env.BING_KEY;
  const surl = "http://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=" + bkey;
  res.render("index", {key: surl});
});

app.post("/", function(req, res){
  const place = req.body.cityName.split(",");
  const cityName = place[0];
  const key = process.env.WEATHER_KEY;
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + key + "&units=" + units + "";

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const weatherDesc = _.startCase(weatherData.weather[0].description);
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      const windSpeed = weatherData.wind.speed;
      const pressure = weatherData.main.pressure;
      const humid = weatherData.main.humidity;

      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes();

      res.render("result", {city: cityName, temp: temperature, desc: weatherDesc,
                            iURL: imageURL, ws: windSpeed, p: pressure, humidity: humid, t:time});
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("The server is running on port 3000");
})
