const http = require('http');
const fs = require('fs').promises;

const requestListener = function (req, res) {
    fs.readFile("../index.html").then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    }).catch(err => {
        res.writeHead(500);
        console.log("fs: error opening file");
        res.end(err);
    })
}

const server = http.createServer(requestListener);
server.listen(8080);