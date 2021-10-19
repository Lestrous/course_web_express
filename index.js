const express = require('express');

const app = express();

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'x-test,Content-Type,Accept,Access-Control-Allow-Headers'
};

app
.use((r, res, next) => { r.res.set(CORS); next(); })
.all('/', (req, res) => res
    .set({'X-Author': 'day108'})
    .send('day108')
)
.all('/login/', (req, res) => res
    .set({'X-Author': 'day108', 'Content-Type': 'text/plain; charset=UTF-8'})
    .send('day108')
)
.all('/sample/', (req, res) => res
    .set({'X-Author': 'day108', 'Content-Type': 'text/plain; charset=UTF-8'})
    .send('function task(x) { return x * this ** 2; }')
)
.all('/result4/', (req, res) => {
    let requestBody = '';

    req.on('data', chunk => {
        requestBody += chunk;
    });

    req.on('end', () => res
        .status(200)
        .set({'Content-Type': 'application/json; charset=UTF-8'})
        .json({"message": "day108", "x-result": req['headers']['x-test'], "x-body": requestBody})
    );
})
.listen(process.env.PORT ?? 4321);