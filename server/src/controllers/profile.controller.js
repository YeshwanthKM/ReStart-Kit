const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get authenticated user profile
 * @route GET /api/profile/me
 */
const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (err) {
    console.error('Get Profile Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: err.message
    });
  }
};

/**
 * Update authenticated user profile
 * @route PUT /api/profile/me
 */
const updateProfile = async (req, res) => {
  try {
    const { name, age, city, state, location, bio } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: {
        ...(name !== undefined && { name: name.trim() }),
        ...(age !== undefined && { age: age ? parseInt(age, 10) : null }),
        ...(city !== undefined && { city: city ? city.trim() : null }),
        ...(state !== undefined && { state: state ? state.trim() : null }),
        ...(location !== undefined && { location: location ? location.trim() : null }),
        ...(bio !== undefined && { bio: bio ? bio.trim() : null })
      },
      create: {
        userId: req.user.id,
        name: name ? name.trim() : 'User',
        age: age ? parseInt(age, 10) : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        location: location ? location.trim() : null,
        bio: bio ? bio.trim() : null
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });

  } catch (err) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: err.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
