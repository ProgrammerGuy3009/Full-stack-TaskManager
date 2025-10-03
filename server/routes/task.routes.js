const express = require('express');
const router = express.Router();

// Mock tasks data
let mockTasks = [
  { _id: '1', title: 'Sample Task 1', completed: false, priority: 'high', status: 'todo', createdAt: new Date() },
  { _id: '2', title: 'Sample Task 2', completed: true, priority: 'medium', status: 'completed', createdAt: new Date() }
];

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
