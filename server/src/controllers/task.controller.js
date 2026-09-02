const { prisma } = require('../utils/db');
const { generatePersonalizedTasks } = require('../services/personalization.service');

/**
 * Trigger task generation for logged-in user
 * @route POST /api/tasks/generate
 */
const generateTasks = async (req, res) => {
  try {
    const result = await generatePersonalizedTasks(req.user.id);
    return res.status(200).json({
      success: true,
      message: result.newTasksCreated > 0 
        ? `Generated ${result.newTasksCreated} new personalized task(s) based on your assessment.`
        : 'Your ReStart Kit roadmap is up to date.',
      ...result
    });
  } catch (err) {
    console.error('Generate Tasks Error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to generate personalized tasks',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Fetch all tasks for logged-in user with filters
 * @route GET /api/tasks
 */
const getUserTasks = async (req, res) => {
  try {
    const { pillarSlug, status, priority } = req.query;

    const whereClause = {
      userId: req.user.id
    };

    if (status === 'completed') {
      whereClause.isCompleted = true;
    } else if (status === 'pending') {
      whereClause.isCompleted = false;
    }

    if (priority && ['HIGH', 'MEDIUM', 'LOW'].includes(priority.toUpperCase())) {
      whereClause.priority = priority.toUpperCase();
    }

    if (pillarSlug) {
      const pillar = await prisma.pillar.findUnique({
        where: { slug: pillarSlug.toUpperCase() }
      });
      if (pillar) {
        whereClause.pillarId = pillar.id;
      }
    }

    const tasks = await prisma.userTask.findMany({
      where: whereClause,
      include: {
        pillar: true
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate summary statistics
    const totalCount = await prisma.userTask.count({ where: { userId: req.user.id } });
    const completedCount = await prisma.userTask.count({ where: { userId: req.user.id, isCompleted: true } });
    const pendingCount = totalCount - completedCount;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        progressPercent
      },
      tasks
    });

  } catch (err) {
    console.error('Get Tasks Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Toggle task completion status
 * @route PATCH /api/tasks/:id/toggle
 */
const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.userTask.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    const newCompletedState = !existingTask.isCompleted;

    const updatedTask = await prisma.userTask.update({
      where: { id },
      data: {
        isCompleted: newCompletedState,
        completedAt: newCompletedState ? new Date() : null
      },
      include: {
        pillar: true
      }
    });

    return res.status(200).json({
      success: true,
      message: newCompletedState ? 'Task marked as completed' : 'Task marked as incomplete',
      task: updatedTask
    });

  } catch (err) {
    console.error('Toggle Task Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating task status',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  generateTasks,
  getUserTasks,
  toggleTaskStatus
};
