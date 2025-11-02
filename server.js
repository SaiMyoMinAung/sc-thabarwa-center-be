import restify from 'restify'
import mongoose from 'mongoose'
import config from './config.js'
import rjwt from 'restify-jwt-community'

const server = restify.createServer();

server.pre((req, res, next) => {
    // allow specific origin (recommended) or use req.headers.origin so credentials work
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true'); // set only if you need cookies/auth
    if (req.method === 'OPTIONS') {
        // respond to preflight immediately
        res.send(204);
        return next(false);
    }
    return next();
});

// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));
// middleware
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const port = config.PORT || 4000;
console.log(port)
server.listen(port, () => {

    mongoose.connect(config.MONGODB_URI, clientOptions).then(() => {
        // mongoose.connection.db is available only after successful connection
        return mongoose.connection.db.admin().command({ ping: 1 });
    })
        .then(() => {
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
});

const db = mongoose.connection;

db.on('error', (err) => console.log('db.on error', err))

db.once('open', () => {
    import('./routes/announcement.js')
        .then((mod) => {
            console.log('connected announcement')
            const route = mod.default || mod;
            if (typeof route === 'function') route(server);
            else console.error('Unexpected export from ./routes/manager.js', route);
        })
        .catch((err) => console.error('Failed to load routes:', err));

    import('./routes/manager.js')
        .then((mod) => {
            console.log('connected manager')
            const route = mod.default || mod;
            if (typeof route === 'function') route(server);
            else console.error('Unexpected export from ./routes/manager.js', route);
        })
        .catch((err) => console.error('Failed to load routes:', err));

    import('./routes/dhamma-event.js')
        .then((mod) => {
            console.log('connected dhamma-event')
            const route = mod.default || mod;
            if (typeof route === 'function') route(server);
            else console.error('Unexpected export from ./routes/dhamma-event.js', route);
        })
        .catch((err) => console.error('Failed to load routes:', err));

    console.log(`DB once opend, server started on port ${port}`)
})