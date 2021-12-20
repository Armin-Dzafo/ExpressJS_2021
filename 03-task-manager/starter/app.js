const express = require('express');

const server = express();

const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// middleware
server.use(express.static('./public'));
// because we are gonna send json from our application
// we need to do this to get that data in req.body
server.use(express.json());

// routes
server.use('/api/v1/tasks', tasks);
server.use(notFound);
server.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
