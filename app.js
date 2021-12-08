export default (express, bodyParser, createReadStream, crypto, http, mongoose, User, request, pug) => {
    const app = express();

    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,Access-Control-Allow-Headers'
    };

    app
        .use((r, res, next) => { r.res.set(CORS); next(); })
        .use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())

        .get('/login/', (req, res) => res
            .send('day108')
        )
        .get('/code/', (req, res) => {
            const fileSrc = import.meta.url.substring(import.meta.url.length - 6);

            res.set({'Content-Type': 'text/plain; charset=UTF-8'});
            createReadStream(fileSrc).pipe(res);
        })
        .get('/sha1/:input', (req, res) => {
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
        .post('/insert/', async (req, res) => {
            const { login, password, URL } = req.body;
            try {
                await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
            } catch (e) {
                res.send(e.codeName);
            }

            const newUser = new User({ login, password });

            try {
                await newUser.save();
                res.status(201).json({ login });
            } catch (e) {
                console.log('Error');
            }
        })
        .get('/wordpress/', async (req, res) => {
            res.redirect('http://cv84871-wordpress-1.tw1.ru/');
            // request.get('http://cv84871-wordpress-1.tw1.ru/', function(err, response, body) {
            //     if (!err) {
            //         res.send(body);
            //     }
            // });
        })
        .post('/render/', (req, res) => {
            const { addr } = req.query;
            const { random2 ,random3 } = req.body;

            request.get(addr, function(err, response, body) {
                if (!err) {
                    res.send( pug.render(body, { random2, random3 }) );
                }
            });
        })
        .all('/*', (req, res) => res
            .send('day108')
        );

    return app;
}
