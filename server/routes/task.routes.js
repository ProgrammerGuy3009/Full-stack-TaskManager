// const Task = require('./models/Task');
// const express = require('express');
// const router = express.Router();
// const { verifyToken } = require('./auth.middleware');
// // Create a new task
// // router.post('/', async (req, res) => {
// //   try {
// //     const { title, description, priority, status, dueDate, tags } = req.body;
// //     const newTask = new Task({ title, description, priority, status, dueDate, tags });
// //     const saved = await newTask.save();
// //     res.status(201).json({ success: true, task: saved });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // });
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const { title, description, priority, status, dueDate, tags } = req.body;
//     // req.user.id should be set by verifyToken
//     const userId = req.user.id;   
//     const newTask = new Task({
//       title,
//       description,
//       priority,
//       status,
//       dueDate,
//       tags,
//       user: userId
//     });
//     const saved = await newTask.save();
//     res.status(201).json({ success: true, task: saved });
//   } catch (err) {
//     console.error('Create Task Error:', err);
//     res.status(500).json({ success: false, message: 'Error creating task', error: err.message });
//   }
// });
const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Correct path if needed
const { verifyToken } = require('../middleware/auth.middleware'); // Path as per your project

// Create Task (user from JWT, not body!)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Get user id from req.user (must be set by JWT middleware)
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'No user id in token' });
    }
    // Pull fields from body
    const { title, description, priority, status, dueDate, tags } = req.body;
    const newTask = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      tags,
      user: userId   // Mongoose requires this for validation!
    });
    const saved = await newTask.save();
    res.status(201).json({ success: true, task: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating task', error: err.message });
  }
});
module.exports = router;

// Mock tasks data
// let mockTasks = [
//   { _id: '1', title: 'Sample Task 1', completed: false, priority: 'high', status: 'todo', createdAt: new Date() },
//   { _id: '2', title: 'Sample Task 2', completed: true, priority: 'medium', status: 'completed', createdAt: new Date() }
// ];

router.get('/', (req, res) => {
  res.json({
    success: true,
    tasks: mockTasks
  });
});

router.get('/stats', (req, res) => {
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.completed).length;
  
  res.json({
    success: true,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      highPriorityTasks: mockTasks.filter(t => t.priority === 'high').length,
      overdueTasks: 0,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  });
});

module.exports = router;
