const Task = require('../models/TaskSchema');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createNewTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

// eslint-disable-next-line consistent-return
const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id of ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

// eslint-disable-next-line consistent-return
const deleteTask = asyncWrapper(async (req, res) => {
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
});

// eslint-disable-next-line consistent-return
const updateTask = asyncWrapper(async (req, res) => {
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
});

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
