const { prisma } = require('../utils/db');

/**
 * Get all registered users for Admin management
 * @route GET /api/admin/users
 * @access Protected (ADMIN only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
        assessment: {
          select: {
            isCompleted: true,
            createdAt: true
          }
        },
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

module.exports = {
  getAllUsers,
  getAdminStats
};
