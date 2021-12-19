const express = require('express');

const server = express();

const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
// const { server } = require('express')
require('dotenv').config();

// routes
// server.get('/hello', (req,res) => {
//     res.send('Task Manager App')
// })

// middleware
server.use(express.static('./public'));
// because we are gonna send json from our application
// we need to do this to get that data in req.body
server.use(express.json());

server.use('/api/v1/tasks', tasks);

// server.get('/index.html',(req,res)=>{
//     res.send()
// })

// server.get('/api/v1/tasks')          - get all the tasks
// server.post('/api/v1/tasks')         - create a new tasks
// server.get('/api/v1/tasks/:id')      - get single task
// server.patch('/api/v1/tasks/:id')    - update task
// server.delete('/api/v1/tasks/:id')   - delete task

const port = 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`Server is listening on port ${3000}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
