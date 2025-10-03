const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  const recentTasks = [
    { _id: '1', title: 'Recent Task 1', completed: false, priority: 'high' },
    { _id: '2', title: 'Recent Task 2', completed: true, priority: 'medium' }
  ];
  
  res.json({
    success: true,
    data: {
      user: { id: 1, username: 'testuser' },
      recentTasks
    }
  });
});

module.exports = router;
