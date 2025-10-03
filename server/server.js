const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Basic middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://full-stack-task-manager-mauve.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});



app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    // Check if user exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.json({
      success: true,
      message: 'Registration successful',
      user: { id: user._id, username: user.username, email: user.email },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. " + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, username: user.username, email: user.email },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. " + error.message });
  }
});


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


app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching task' });
  }
});



// app.post('/api/tasks', async (req, res) => {
//   try {
//     const newTask = await Task.create(req.body);
//     res.status(201).json({ success: true, task: newTask });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error creating task', error: error.message });
//   }
// });
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, tags } = req.body;
    console.log('BODY:', req.body);
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const newTask = await Task.create({
      title,
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      status: status || "todo",
      tags: tags || [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating task", error: error.message });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating task' });
  }
});


app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting task' });
  }
});

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
