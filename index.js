import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const app = express();
const PORT = 3000;

// helmet setup
app.use(helmet());

// Rate Limit Setup
const limiter = new RateLimit({
  windowsMs: 15 * 60 * 1000, //15min window
  max: 100, // max request 100 per ip
  delayMs: 0 // disable delay
});
app.use(limiter);

// csrf protection set up
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser());

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb', {
  useMongoClient: true
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', csrfProtection, (req, res) => res.send(`Node and express server is running on port ${PORT}`));

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));
