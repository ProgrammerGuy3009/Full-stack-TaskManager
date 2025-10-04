const express = require('express');
const router = express.Router();
// const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth.middleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/task.controller');

// Create Task - requires authentication
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'No user id in token' });
//     }

//     const { title, description, priority, status, dueDate, tags } = req.body;
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
//     res.status(500).json({ success: false, message: 'Error creating task', error: err.message });
//   }
// });
// Create Task - requires authentication
router.post('/', authMiddleware, createTask);

// Get tasks with filtering
// router.get('/', async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ createdAt: -1 });
//     res.json({ success: true, tasks });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching tasks' });
//   }
// });
// Get tasks with filtering, requires authentication!
router.get('/', authMiddleware, getTasks);

// Get single task by ID
router.get('/:id', authMiddleware, getTaskById);
// Update a task
router.put('/:id', authMiddleware, updateTask);
// Delete a task
router.delete('/:id', authMiddleware, deleteTask);
// Task stats (analytics dashboard) -- USES CONTROLLER
router.get('/stats', authMiddleware, getTaskStats);

// Get task stats
// router.get('/stats', async (req, res) => {
//   try {
//     const totalTasks = await Task.countDocuments();
//     const completedTasks = await Task.countDocuments({ completed: true });
    
//     res.json({
//       success: true,
//       stats: {
//         totalTasks,
//         completedTasks,
//         pendingTasks: totalTasks - completedTasks,
//         highPriorityTasks: await Task.countDocuments({ priority: 'high' }),
//         overdueTasks: 0,
//         completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching stats' });
//   }
// });

module.exports = router;
