const { prisma } = require('../utils/db');

/**
 * Get authenticated user's assessment
 * @route GET /api/assessment/me
 */
const getAssessment = async (req, res) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { userId: req.user.id }
    });

    if (!assessment) {
      return res.status(200).json({
        success: true,
        hasCompletedAssessment: false,
        assessment: null
      });
    }

    // Parse JSON strings back to arrays if needed
    let parsedNeeds = [];
    let parsedGoals = [];
    
    try {
      parsedNeeds = typeof assessment.needs === 'string' ? JSON.parse(assessment.needs) : assessment.needs;
    } catch (e) {
      parsedNeeds = [];
    }

    try {
      parsedGoals = typeof assessment.goals === 'string' ? JSON.parse(assessment.goals) : assessment.goals;
    } catch (e) {
      parsedGoals = [];
    }

    return res.status(200).json({
      success: true,
      hasCompletedAssessment: assessment.isCompleted,
      assessment: {
        ...assessment,
        needs: parsedNeeds,
        goals: parsedGoals
      }
    });

  } catch (err) {
    console.error('Get Assessment Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching assessment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Create or update user's assessment
 * @route POST /api/assessment
 */
const createOrUpdateAssessment = async (req, res) => {
  try {
    const { situation, needs, goals, location, city, state } = req.body;

    if (!situation) {
      return res.status(400).json({
        success: false,
        message: 'Please describe your current situation or select an option'
      });
    }

    const needsArray = Array.isArray(needs) ? needs : [];
    const goalsArray = Array.isArray(goals) ? goals : [];

    const needsJson = JSON.stringify(needsArray);
    const goalsJson = JSON.stringify(goalsArray);

    const updatedAssessment = await prisma.assessment.upsert({
      where: { userId: req.user.id },
      update: {
        situation: situation.trim(),
        needs: needsJson,
        goals: goalsJson,
        location: location ? location.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        isCompleted: true
      },
      create: {
        userId: req.user.id,
        situation: situation.trim(),
        needs: needsJson,
        goals: goalsJson,
        location: location ? location.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        isCompleted: true
      }
    });

    // Also sync city & state to User Profile if provided
    if (city || state || location) {
      await prisma.profile.updateMany({
        where: { userId: req.user.id },
        data: {
          ...(city && { city: city.trim() }),
          ...(state && { state: state.trim() }),
          ...(location && { location: location.trim() })
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment completed successfully',
      assessment: {
        ...updatedAssessment,
        needs: needsArray,
        goals: goalsArray
      }
    });

  } catch (err) {
    console.error('Create/Update Assessment Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error saving assessment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  getAssessment,
  createOrUpdateAssessment
};
