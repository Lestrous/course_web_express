export default (express, bodyParser, createReadStream, crypto, http) => {
    const app = express();

    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
    };

    app
        .use((r, res, next) => { r.res.set(CORS); next(); })
        .use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())

        .all('/login/', (req, res) => res
            .send('day108')
        )
        .all('/code/', (req, res) => {
            const fileSrc = import.meta.url.substring(import.meta.url.length - 6);

            res.set({'Content-Type': 'text/plain; charset=UTF-8'});
            createReadStream(fileSrc).pipe(res);
        })
        .all('/sha1/:input/', (req, res) => {
            const hash = crypto.createHash('sha1');
            hash.update(req.params.input);

            res.send( hash.digest('hex') );
        })
        .all('/req/', (req, res) => {
            const addr = req.method === 'POST' ? req.body.addr : req.query.addr;

            http.get(addr, (httpRes, str = '') => {
                httpRes
                    .on('data', data => str += data)
                    .on('end', () => res.send(str));
            });
        })
        .all('*', (req, res) => res
            .send('day108')
        );

    return app;
}
