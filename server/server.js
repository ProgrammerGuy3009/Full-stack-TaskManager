const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks (simulating database)
// let tasks = [
//   {
//     _id: '1',
//     title: 'Complete Project Documentation',
//     description: 'Write comprehensive documentation for the task management system',
//     priority: 'high',
//     status: 'in-progress',
//     completed: false,
//     dueDate: '2025-10-05',
//     tags: ['documentation', 'project'],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: '2',
//     title: 'Design Database Schema',
//     description: 'Create the database schema for tasks and users',
//     priority: 'medium',
//     status: 'completed',
//     completed: true,
//     dueDate: '2025-10-03',
//     tags: ['database', 'design'],
//     createdAt: new Date(Date.now() - 86400000).toISOString(),
//     updatedAt: new Date().toISOString()
//   }
// ];

// let nextTaskId = 3;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
// app.post('/api/auth/register', (req, res) => {
//   console.log('Registration request received:', req.body);
//   res.json({
//     success: true,
//     message: 'Registration successful',
//     user: { id: 1, username: req.body.username, email: req.body.email },
//     token: 'test-token-123'
//   });
// });
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Registration request:', { username, email, hashedPassword: 'HASHED' });
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: { id: 1, username, email },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});


// app.post('/api/auth/login', (req, res) => {
//   console.log('Login request received:', req.body);
//   res.json({
//     success: true,
//     message: 'Login successful',
//     user: { id: 1, username: 'testuser', email: req.body.email },
//     token: 'test-token-123'
//   });
// });

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // In a real app, you would:
    // 1. Find user by email in database
    // 2. Compare password with hashed password using bcrypt.compare()
    // For demo purposes, we'll simulate this:
    
    console.log('Login request for:', email);
    
    // Simulate password verification
    // const isValidPassword = await bcrypt.compare(password, storedHashedPassword);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: 1, username: 'testuser', email },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});


// app.get('/api/auth/verify', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Token verified',
//     user: { id: 1, username: 'testuser', email: 'test@example.com' }
//   });
// });
app.get('/api/auth/verify', (req, res) => {
  try {
    // In a real app, you would verify the JWT token here
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // For demo purposes, accept any token
    res.json({
      success: true,
      message: 'Token verified',
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});


// Task routes with full CRUD operations
// app.get('/api/tasks/stats', (req, res) => {
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(t => t.completed).length;
//   const pendingTasks = totalTasks - completedTasks;
//   const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  
//   // Calculate overdue tasks
//   const overdueTasks = tasks.filter(t => 
//     t.dueDate && 
//     new Date(t.dueDate) < new Date() && 
//     !t.completed
//   ).length;

//   // Tasks by status
//   const todoTasks = tasks.filter(t => t.status === 'todo').length;
//   const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
//   const completedStatusTasks = tasks.filter(t => t.status === 'completed').length;

//   // Tasks by priority
//   const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;
//   const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;

//   res.json({
//     success: true,
//     stats: {
//       totalTasks,
//       completedTasks,
//       pendingTasks,
//       highPriorityTasks,
//       overdueTasks,
//       completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
//       tasksByStatus: {
//         todo: todoTasks,
//         inProgress: inProgressTasks,
//         completed: completedStatusTasks
//       },
//       tasksByPriority: {
//         low: lowPriorityTasks,
//         medium: mediumPriorityTasks,
//         high: highPriorityTasks
//       }
//     }
//   });
// });
app.get('/api/tasks/stats', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = await Task.countDocuments({ priority: "high" });
    const overdueTasks = await Task.countDocuments({ 
      dueDate: { $lt: new Date() }, 
      completed: false 
    });
    const todoTasks = await Task.countDocuments({ status: "todo" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });
    const completedStatusTasks = await Task.countDocuments({ status: "completed" });
    const lowPriorityTasks = await Task.countDocuments({ priority: "low" });
    const mediumPriorityTasks = await Task.countDocuments({ priority: "medium" });

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        tasksByStatus: {
          todo: todoTasks,
          inProgress: inProgressTasks,
          completed: completedStatusTasks
        },
        tasksByPriority: {
          low: lowPriorityTasks,
          medium: mediumPriorityTasks,
          high: highPriorityTasks
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});



app.get('/api/tasks', async (req, res) => {
  try {
    // Query parameters
    const { 
      priority, 
      status, 
      completed, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10 
    } = req.query;

    // Build Mongo query filters
    const filter = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (completed !== undefined) filter.completed = completed === 'true';
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $regex: searchRegex } }
      ];
    }

    // Mongo sort object
    let sortObj = {};
    if (sortBy === 'priority') {
      // Custom order: high > medium > low
      sortObj = { priority: sortOrder === 'desc' ? -1 : 1 };
    } else {
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter);

    // Find tasks with filters, sorting, and pagination
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / parseInt(limit)),
        totalTasks,
        hasNext: skip + tasks.length < totalTasks,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Error fetching tasks' });
  }
});


// app.get('/api/tasks/:id', (req, res) => {
//   const task = tasks.find(t => t._id === req.params.id);
//   if (!task) {
//     return res.status(404).json({ success: false, message: 'Task not found' });
//   }
//   res.json({ success: true, task });
// });
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching task' });
  }
});


// app.post('/api/tasks', (req, res) => {
//   const newTask = {
//     _id: String(nextTaskId++),
//     title: req.body.title,
//     description: req.body.description || '',
//     priority: req.body.priority || 'medium',
//     status: req.body.status || 'todo',
//     completed: req.body.completed || false,
//     dueDate: req.body.dueDate || null,
//     tags: req.body.tags || [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   };

//   tasks.push(newTask);
//   console.log('Task created:', newTask);
//   res.status(201).json({ success: true, task: newTask });
// });

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating task', error: error.message });
  }
});


// app.put('/api/tasks/:id', (req, res) => {
//   const taskIndex = tasks.findIndex(t => t._id === req.params.id);
//   if (taskIndex === -1) {
//     return res.status(404).json({ success: false, message: 'Task not found' });
//   }

//   tasks[taskIndex] = {
//     ...tasks[taskIndex],
//     ...req.body,
//     updatedAt: new Date().toISOString()
//   };

//   console.log('Task updated:', tasks[taskIndex]);
//   res.json({ success: true, task: tasks[taskIndex] });
// });
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating task' });
  }
});


// app.delete('/api/tasks/:id', (req, res) => {
//   const taskIndex = tasks.findIndex(t => t._id === req.params.id);
//   if (taskIndex === -1) {
//     return res.status(404).json({ success: false, message: 'Task not found' });
//   }

//   const deletedTask = tasks.splice(taskIndex, 1)[0];
//   console.log('Task deleted:', deletedTask);
//   res.json({ success: true, message: 'Task deleted successfully' });
// });

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting task' });
  }
});




// User dashboard with recent tasks and activity
// app.get('/api/users/dashboard', (req, res) => {
//   const recentTasks = tasks
//     .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
//     .slice(0, 5);

//   const upcomingTasks = tasks
//     .filter(t => t.dueDate && new Date(t.dueDate) > new Date() && !t.completed)
//     .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
//     .slice(0, 3);

//   res.json({
//     success: true,
//     data: {
//       user: { id: 1, username: 'testuser', email: 'test@example.com' },
//       recentTasks,
//       upcomingTasks,
//       totalTasks: tasks.length,
//       completedToday: tasks.filter(t => {
//         const today = new Date().toDateString();
//         return t.completed && new Date(t.updatedAt).toDateString() === today;
//       }).length
//     }
//   });
// });
app.get('/api/users/dashboard', async (req, res) => {
  try {
    const recentTasks = await Task.find().sort({ updatedAt: -1 }).limit(5);
    const upcomingTasks = await Task.find({
      dueDate: { $gt: new Date() },
      completed: false
    }).sort({ dueDate: 1 }).limit(3);

    const totalTasks = await Task.countDocuments();
    const today = new Date().toDateString();
    const completedToday = await Task.countDocuments({
      completed: true,
      updatedAt: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        recentTasks,
        upcomingTasks,
        totalTasks,
        completedToday
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
});


// Bulk operations
// app.post('/api/tasks/bulk', (req, res) => {
//   const { action, taskIds } = req.body;

//   switch (action) {
//     case 'complete':
//       tasks.forEach(task => {
//         if (taskIds.includes(task._id)) {
//           task.completed = true;
//           task.status = 'completed';
//           task.updatedAt = new Date().toISOString();
//         }
//       });
//       break;
//     case 'delete':
//       tasks = tasks.filter(task => !taskIds.includes(task._id));
//       break;
//     case 'archive':
//       tasks.forEach(task => {
//         if (taskIds.includes(task._id)) {
//           task.archived = true;
//           task.updatedAt = new Date().toISOString();
//         }
//       });
//       break;
//     default:
//       return res.status(400).json({ success: false, message: 'Invalid bulk action' });
//   }

//   res.json({ success: true, message: `Bulk ${action} completed` });
// });
app.post('/api/tasks/bulk', async (req, res) => {
  const { action, taskIds } = req.body;

  try {
    switch (action) {
      case 'complete':
        await Task.updateMany(
          { _id: { $in: taskIds } },
          { $set: { completed: true, status: 'completed', updatedAt: new Date() } }
        );
        break;
      case 'delete':
        await Task.deleteMany({ _id: { $in: taskIds } });
        break;
      case 'archive':
        await Task.updateMany(
          { _id: { $in: taskIds } },
          { $set: { archived: true, updatedAt: new Date() } }
        );
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid bulk action' });
    }
    res.json({ success: true, message: `Bulk ${action} completed` });
  } catch (error) {
    res.status(500).json({ success: false, message: `Bulk ${action} failed: ${error.message}` });
  }
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
const PORT = 5000;
const healthUrl =
  process.env.NODE_ENV === "production"
    ? "https://full-stack-taskmanager-production.up.railway.app/api/health"
    : "http://localhost:5000/api/health";
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: ${healthUrl}`);
  // console.log(`📊 Total tasks loaded: ${tasks.length}`);
});
