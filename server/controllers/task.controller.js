const Task = require('../models/Task');
const mongoose = require('mongoose');

// Get all tasks for authenticated user
const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      completed,
      priority,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { user: req.user._id };

    if (completed !== undefined) query.completed = completed === 'true';
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('user', 'username email');

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTasks: total,
        tasksPerPage: parseInt(limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};


// Get task statistics (analytics)
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
          },
          highPriorityTasks: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $eq: ['$completed', false] },
                    { $ne: ['$dueDate', null] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get task breakdown by status (enum must match model: 'todo', 'in-progress', 'completed')
    const statusBreakdown = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get task breakdown by priority
    const priorityBreakdown = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      highPriorityTasks: 0,
      overdueTasks: 0
    };

    // Enum fix: use 'in-progress' not 'inProgress'
    const tasksByStatus = {
      todo: 0,
      'in-progress': 0,
      completed: 0
    };
    statusBreakdown.forEach(item => {
      if (item._id && tasksByStatus.hasOwnProperty(item._id)) {
        tasksByStatus[item._id] = item.count;
      }
    });

    const tasksByPriority = {
      low: 0,
      medium: 0,
      high: 0
    };
    priorityBreakdown.forEach(item => {
      if (item._id && tasksByPriority.hasOwnProperty(item._id)) {
        tasksByPriority[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      stats: {
        ...result,
        completionRate: result.totalTasks > 0 
          ? Math.round((result.completedTasks / result.totalTasks) * 100) 
          : 0,
        tasksByStatus,
        tasksByPriority
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task statistics',
      error: error.message
    });
  }
};

// Export other controller functions (unchanged)
const { getTaskById, createTask, updateTask, deleteTask } = require('./otherControllers.js'); // replace with your real imports

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
