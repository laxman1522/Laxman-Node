var randomColorPalatte = require('./randomColorPalatte');

const http = require('http');

const server = http.createServer((req,res) => {
    if(req.url === '/generate-random-color') {
        res.write(JSON.stringify(randomColorPalatte.generateRandomColorPalatte()));
        res.end()
    }
});

server.listen(3000);
console.log("Listening on port 3000...")