const { prisma } = require('../utils/db');

/**
 * Fetch comprehensive user dashboard statistics & recommendations
 * @route GET /api/dashboard/stats
 * @access Protected (USER)
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch User Profile & Assessment status
    const [profile, assessment] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.assessment.findUnique({ where: { userId } })
    ]);

    // 2. Fetch User Tasks & Pillars
    const [tasks, pillars] = await Promise.all([
      prisma.userTask.findMany({
        where: { userId },
        include: { pillar: true }
      }),
      prisma.pillar.findMany()
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const overallProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 3. Calculate 5-Pillar Progress Breakdown
    const pillarBreakdown = pillars.map(pillar => {
      const pillarTasks = tasks.filter(t => t.pillarId === pillar.id);
      const pTotal = pillarTasks.length;
      const pCompleted = pillarTasks.filter(t => t.isCompleted).length;
      const pPending = pTotal - pCompleted;
      const pPercent = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

      return {
        id: pillar.id,
        name: pillar.name,
        slug: pillar.slug,
        description: pillar.description,
        icon: pillar.icon,
        totalTasks: pTotal,
        completedTasks: pCompleted,
        pendingTasks: pPending,
        progressPercent: pPercent
      };
    });

    // 4. Select Recommended Next Steps (Top 3 highest priority pending tasks)
    const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    const pendingTasksList = tasks.filter(t => !t.isCompleted);
    
    pendingTasksList.sort((a, b) => {
      const pA = priorityOrder[a.priority] || 4;
      const pB = priorityOrder[b.priority] || 4;
      if (pA !== pB) return pA - pB;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

    const recommendedNextSteps = pendingTasksList.slice(0, 3);

    return res.status(200).json({
      success: true,
      profile: profile || { name: 'User' },
      hasAssessment: !!assessment && assessment.isCompleted,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overallProgressPercent
      },
      pillarBreakdown,
      recommendedNextSteps
    });

  } catch (err) {
    console.error('Get Dashboard Stats Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  getDashboardStats
};
