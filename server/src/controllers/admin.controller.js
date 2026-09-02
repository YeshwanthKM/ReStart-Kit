const { prisma } = require('../utils/db');

/**
 * Get all registered users for Admin management
 * @route GET /api/admin/users
 * @access Protected (ADMIN only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        assessment: true,
        _count: {
          select: {
            userTasks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    console.error('Get All Users Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user directory',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Delete a user account and clear all associated history (profile, assessment, tasks)
 * @route DELETE /api/admin/users/:id
 * @access Protected (ADMIN only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent Admin from deleting their own logged-in account
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own logged-in Admin account.'
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    // Cascade delete user and all associated history (profile, assessment, tasks)
    await prisma.user.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: `User account ${targetUser.email} and all associated history deleted successfully.`
    });

  } catch (err) {
    console.error('Delete User Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user account',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Get system-wide administration statistics
 * @route GET /api/admin/stats
 * @access Protected (ADMIN only)
 */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const totalStandardUsers = totalUsers - totalAdmins;
    const completedAssessments = await prisma.assessment.count({ where: { isCompleted: true } });
    const totalTasks = await prisma.userTask.count();
    const completedTasks = await prisma.userTask.count({ where: { isCompleted: true } });
    const totalTaskTemplates = await prisma.taskTemplate.count();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStandardUsers,
        totalAdmins,
        completedAssessments,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        totalTaskTemplates
      }
    });

  } catch (err) {
    console.error('Get Admin Stats Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin stats',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Get all pre-seeded task templates for Admin rule inspection
 * @route GET /api/admin/task-templates
 * @access Protected (ADMIN only)
 */
const getTaskTemplates = async (req, res) => {
  try {
    const templates = await prisma.taskTemplate.findMany({
      include: {
        pillar: true
      },
      orderBy: [
        { pillarId: 'asc' },
        { priority: 'asc' }
      ]
    });

    return res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (err) {
    console.error('Get Task Templates Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching task templates',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAdminStats,
  getTaskTemplates
};
