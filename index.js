const http = require('http');
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=670e03951fd2669ed3c9cf870d0d24d4"
        )
            .on("data", function (chunk) {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", function (err) {
                if (err) return console.log("connection closed due to error");
                res.end();
            });
    } else if (req.url == "/sunny-cloud-weather(1).png") {
        // Serve the image file
        fs.readFile("sunny-cloud-weather(1).png", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Error: Image not found");
            } else {
                res.writeHead(200, { "Content-Type": "image/png" });
                res.end(data);
            }
        });
    }
});

server.listen(5500, "127.0.0.1", () => {
    console.log('Server is running on http://127.0.0.1:5500/');
});
