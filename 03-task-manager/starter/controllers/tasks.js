const Task = require('../models/TaskSchema');

const getAllTasks = async (req, res) => {
  // res.send('get all tasks')
  try {
    const tasks = await Task.find({});
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createNewTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// eslint-disable-next-line consistent-return
const getTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    if (!task) {
      return res.status(404).json({ msg: `No task with id of ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// eslint-disable-next-line consistent-return
const deleteTask = async (req, res) => {
  // res.send('delete task')
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });
    if (!task) {
      return res
        .status(404)
        .json({
          msg: `Cannot delete, task with id ${taskID} doesn't exist`,
        });
    }
    // res.status(200).json({task})
    // res.status(200).send()
    res.status(200).json({ task: null, status: 'success' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// eslint-disable-next-line consistent-return
const updateTask = async (req, res) => {
  // res.send('update task')
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: taskID },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!task) {
      return res.status(404).json({ msg: `No task with id of ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// // if we used put instead of patch
// const editTask = async (req, res) => {
//   // res.send('update task')
//   try {
//     const { id: taskID } = req.params;
//     const task = await Task.findOneAndUpdate(
//       { _id: taskID },
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//         overwrite: true, // this property needed for 'PUT'
//       },
//     );
//     if (!task) {
//       return res.status(404).json({ msg: `No task with id of ${taskID}` });
//     }
//     res.status(200).json({ task });
//   } catch (error) {
//     res.status(500).json({ msg: error });
//   }
// };

module.exports = {
  getAllTasks,
  createNewTask,
  getTask,
  updateTask,
  deleteTask,
};
