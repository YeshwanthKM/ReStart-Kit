const { prisma } = require('../utils/db');
const { seedResources } = require('../config/seedResources');

/**
 * Fetch resources with pillar, location (city/state), and keyword search filtering
 * @route GET /api/resources
 */
const getResources = async (req, res) => {
  try {
    // Auto-seed resources if table is empty
    await seedResources();

    const { pillarSlug, city, state, search } = req.query;

    const whereClause = {
      isActive: true
    };

    if (pillarSlug && pillarSlug !== 'ALL') {
      const pillar = await prisma.pillar.findUnique({
        where: { slug: pillarSlug.toUpperCase() }
      });
      if (pillar) {
        whereClause.pillarId = pillar.id;
      }
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    if (state) {
      whereClause.state = { contains: state };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { organization: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } }
      ];
    }

    const rawResources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        pillar: true,
        category: true
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    // Map fields for frontend UI consistency
    const resources = rawResources.map(r => ({
      id: r.id,
      title: r.name,
      organization: r.organization,
      description: r.description,
      pillar: r.pillar,
      category: r.category?.name || 'General Support',
      address: r.address,
      city: r.city,
      state: r.state,
      phone: r.contactInfo,
      email: null,
      website: r.website,
      isVerified: true
    }));

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });

  } catch (err) {
    console.error('Get Resources Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching community resources',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Fetch single resource by ID
 * @route GET /api/resources/:id
 */
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await prisma.resource.findUnique({
      where: { id },
      include: { pillar: true, category: true }
    });

    if (!r) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = {
      id: r.id,
      title: r.name,
      organization: r.organization,
      description: r.description,
      pillar: r.pillar,
      category: r.category?.name || 'General Support',
      address: r.address,
      city: r.city,
      state: r.state,
      phone: r.contactInfo,
      website: r.website,
      isVerified: true
    };

    return res.status(200).json({
      success: true,
      resource
    });
  } catch (err) {
    console.error('Get Resource By ID Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching resource details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Create new support resource (Admin only)
 * @route POST /api/resources
 */
const createResource = async (req, res) => {
  try {
    const { title, description, pillarSlug, category, address, city, state, phone, website } = req.body;

    if (!title || !description || !pillarSlug || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, pillar, city, and state are required.'
      });
    }

    const pillar = await prisma.pillar.findUnique({
      where: { slug: pillarSlug.toUpperCase() }
    });

    if (!pillar) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pillar selected'
      });
    }

    const catSlug = (category || 'GENERAL').toUpperCase().replace(/\s+/g, '_');
    let resCategory = await prisma.resourceCategory.findUnique({ where: { slug: catSlug } });
    if (!resCategory) {
      resCategory = await prisma.resourceCategory.create({
        data: {
          name: category || 'General Support',
          slug: catSlug,
          description: `Resources for ${category || 'General Support'}`
        }
      });
    }

    const newResource = await prisma.resource.create({
      data: {
        name: title,
        organization: title,
        description,
        pillarId: pillar.id,
        categoryId: resCategory.id,
        address: address || null,
        city,
        state,
        contactInfo: phone || null,
        website: website || null,
        isLocationBased: true,
        isActive: true
      },
      include: {
        pillar: true,
        category: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Resource created successfully!',
      resource: {
        id: newResource.id,
        title: newResource.name,
        organization: newResource.organization,
        description: newResource.description,
        pillar: newResource.pillar,
        category: newResource.category?.name || 'General Support',
        address: newResource.address,
        city: newResource.city,
        state: newResource.state,
        phone: newResource.contactInfo,
        website: newResource.website,
        isVerified: true
      }
    });

  } catch (err) {
    console.error('Create Resource Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating new resource',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Delete / deactivate resource (Admin only)
 * @route DELETE /api/resources/:id
 */
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await prisma.resource.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (err) {
    console.error('Delete Resource Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting resource',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  deleteResource
};
