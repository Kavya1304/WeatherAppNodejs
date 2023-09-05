const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (temval, orgval) => {
  var tem = orgval.main.temp;
  let temperature = temval.replace('{%tempval%}', (tem - 273).toFixed(2));
  var temmin = orgval.main.temp_min;
  temperature = temperature.replace('{%tempmin%}', (temmin - 273).toFixed(2));
  var temmax = orgval.main.temp_max;
  temperature = temperature.replace('{%tempmax%}', (temmax - 273).toFixed(2));
  temperature = temperature.replace('{%city%}', orgval.name);
  temperature = temperature.replace('{%country%}', orgval.sys.country);
  temperature = temperature.replace('{%currstatus%}', orgval.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=4cbe1614b2ad2641d9dd5e66e81f3e9e",
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData);

        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(" ");

        res.write(realTimeData)
        //console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(5000, "127.0.0.1");
