// dotenv
require('dotenv').config();
// apply try-catch logic in all controllers automatically
require('express-async-errors');

// express
// eslint-disable-next-line import/newline-after-import
const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// connect to DB
const connectDB = require('./db/connect');

app.use(morgan('tiny'));
// enable JSON in req.body
app.use(express.json());
// use cookie parser
app.use(cookieParser(process.env.JWT_SECRET));
// to be able to use front-end correctly
app.use(express.static('./public'));
// enable cors
app.use(cors());

// routers
const authRouter = require('./routes/authRoutes');

// routes
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

app.get('/api/v1', (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send('HOME PAGE w cookies!!!');
});

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
