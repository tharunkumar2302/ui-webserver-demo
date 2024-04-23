const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

app.set('view engine', 'handlerbars');

app.use(express.static('assets'));

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
//app.use(cors());
app.use(
  cors({
    origin: '*',
    allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    methods: 'GET, PUT, DELETE, UPDATE, POST, OPTIONS, PATCH',
  })
);
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// v1 api routes
app.use('/v1', routes);
app.use('/api', routes);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
app.use('/', express.static('ui/public/build'));
app.get('/static/*', (req, res) => {
  res.sendFile(req.url.slice(0, -1), { root: 'ui/public/build' });
});
app.get('/manifest.json/', (req, res) => {
  res.sendFile(req.url.slice(0, -1), { root: 'ui/public/build' });
});
app.get('/assets/*', (req, res) => {
  console.log(req.url);
  res.sendFile(req.url, { root: 'ui/public/build' });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
