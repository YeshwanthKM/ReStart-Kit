const { prisma } = require('../utils/db');

const initialPillars = [
  {
    name: 'Documents',
    slug: 'DOCUMENTS',
    description: 'Identity documents, legal records, and government documentation guidance.',
    icon: 'FileText'
  },
  {
    name: 'Basic Needs',
    slug: 'BASIC_NEEDS',
    description: 'Housing stability, food security, healthcare, and essential living resources.',
    icon: 'Home'
  },
  {
    name: 'Skills',
    slug: 'SKILLS',
    description: 'Vocational training, digital skills, resume building, and education.',
    icon: 'GraduationCap'
  },
  {
    name: 'Employment',
    slug: 'EMPLOYMENT',
    description: 'Fair-chance employment, job interview coaching, and placement opportunities.',
    icon: 'Briefcase'
  },
  {
    name: 'Community',
    slug: 'COMMUNITY',
    description: 'Mentorship networks, community organizations, and local support NGOs.',
    icon: 'Users'
  }
];

const initialTaskTemplates = [
  // DOCUMENTS PILLAR
  {
    pillarSlug: 'DOCUMENTS',
    title: 'Apply for Official State Photo ID / Driver License',
    description: 'Gather proof of residency and identity, then visit your local Department of Licensing to request an official photo ID card.',
    priority: 'HIGH',
    triggerNeed: 'NEED_STATE_ID',
    triggerGoal: 'GOAL_OBTAIN_ID',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'DOCUMENTS',
    title: 'Request Certified Birth Certificate Copy',
    description: 'Submit a vital statistics records request online or at your county health department to secure your official birth certificate.',
    priority: 'HIGH',
    triggerNeed: 'NEED_BIRTH_CERTIFICATE',
    triggerGoal: 'GOAL_OBTAIN_ID',
    defaultDaysToComplete: 10
  },
  {
    pillarSlug: 'DOCUMENTS',
    title: 'Replace Social Security Card',
    description: 'Complete Form SS-5 and present valid photo identification at your nearest Social Security Administration office.',
    priority: 'HIGH',
    triggerNeed: 'NEED_SSN_CARD',
    triggerGoal: 'GOAL_OBTAIN_ID',
    defaultDaysToComplete: 14
  },
  {
    pillarSlug: 'DOCUMENTS',
    title: 'Schedule Legal Records Assistance Consultation',
    description: 'Connect with a legal aid society to review court documentation, record clearing, or expungement options.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_LEGAL_AID',
    triggerGoal: null,
    defaultDaysToComplete: 14
  },

  // BASIC NEEDS PILLAR
  {
    pillarSlug: 'BASIC_NEEDS',
    title: 'Apply for Emergency Housing & Transitional Shelter',
    description: 'Contact local housing authorities or coordinated intake shelters to register for transitional housing programs.',
    priority: 'HIGH',
    triggerNeed: 'NEED_SHELTER',
    triggerGoal: 'GOAL_SECURE_HOUSING',
    defaultDaysToComplete: 3
  },
  {
    pillarSlug: 'BASIC_NEEDS',
    title: 'Access Supplemental Food Assistance (SNAP / Food Banks)',
    description: 'Apply for SNAP EBT benefits online and locate verified local neighborhood food pantries.',
    priority: 'HIGH',
    triggerNeed: 'NEED_FOOD',
    triggerGoal: null,
    defaultDaysToComplete: 2
  },
  {
    pillarSlug: 'BASIC_NEEDS',
    title: 'Enroll in Medicaid / Community Health Services',
    description: 'Visit a community health center to complete healthcare enrollment and schedule an initial medical checkup.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_HEALTHCARE',
    triggerGoal: null,
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'BASIC_NEEDS',
    title: 'Obtain Clothing & Basic Living Essentials Package',
    description: 'Visit partner community centers or clothing closets for work attire, personal hygiene items, and seasonal outerwear.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_EMERGENCY_FUND',
    triggerGoal: null,
    defaultDaysToComplete: 5
  },

  // SKILLS PILLAR
  {
    pillarSlug: 'SKILLS',
    title: 'Enroll in Vocational & Trade Certification Course',
    description: 'Explore tuition-free vocational courses in construction, culinary, logistics, or automotive trades.',
    priority: 'HIGH',
    triggerNeed: 'NEED_VOCATIONAL',
    triggerGoal: 'GOAL_LEARN_TRADE',
    defaultDaysToComplete: 14
  },
  {
    pillarSlug: 'SKILLS',
    title: 'Complete Basic Digital Literacy Workshops',
    description: 'Attend free computer classes covering web navigation, email communication, and online job portal navigation.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_DIGITAL',
    triggerGoal: 'GOAL_LEARN_TRADE',
    defaultDaysToComplete: 10
  },
  {
    pillarSlug: 'SKILLS',
    title: 'Draft & Format Professional Resume',
    description: 'Work with a career coach or template tool to create a clear, skills-focused resume highlighting your experience.',
    priority: 'HIGH',
    triggerNeed: 'NEED_RESUME',
    triggerGoal: 'GOAL_GET_JOB',
    defaultDaysToComplete: 5
  },
  {
    pillarSlug: 'SKILLS',
    title: 'Register for High School Equivalency (GED) Prep',
    description: 'Sign up for GED practice exams and adult secondary education classes at your community college.',
    priority: 'LOW',
    triggerNeed: 'NEED_GED',
    triggerGoal: 'GOAL_LEARN_TRADE',
    defaultDaysToComplete: 21
  },

  // EMPLOYMENT PILLAR
  {
    pillarSlug: 'EMPLOYMENT',
    title: 'Apply to Fair-Chance Employer Partners',
    description: 'Submit applications to verified local businesses committed to fair-chance hiring practices.',
    priority: 'HIGH',
    triggerNeed: 'NEED_FAIR_CHANCE_JOBS',
    triggerGoal: 'GOAL_GET_JOB',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'EMPLOYMENT',
    title: 'Practice Mock Job Interviews',
    description: 'Participate in a 1-on-1 mock interview session to practice answering common questions with confidence.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_INTERVIEW_PREP',
    triggerGoal: 'GOAL_GET_JOB',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'EMPLOYMENT',
    title: 'Explore Immediate Entry-Level Job Leads',
    description: 'Review active job listings in warehousing, retail, hospitality, and municipal service departments.',
    priority: 'HIGH',
    triggerNeed: 'NEED_ENTRY_LEVEL_WORK',
    triggerGoal: 'GOAL_GET_JOB',
    defaultDaysToComplete: 3
  },
  {
    pillarSlug: 'EMPLOYMENT',
    title: 'Apply for Paid Apprenticeships & On-the-Job Training',
    description: 'Submit applications for earn-while-you-learn apprenticeship programs in building trades and technology.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_APPRENTICESHIP',
    triggerGoal: 'GOAL_LEARN_TRADE',
    defaultDaysToComplete: 14
  },

  // COMMUNITY PILLAR
  {
    pillarSlug: 'COMMUNITY',
    title: 'Match with a 1-on-1 Reentry Mentor',
    description: 'Connect with an experienced community mentor for weekly check-ins, encouragement, and guidance.',
    priority: 'HIGH',
    triggerNeed: 'NEED_MENTORSHIP',
    triggerGoal: 'GOAL_BUILD_NETWORK',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'COMMUNITY',
    title: 'Connect with Local Community Support NGO',
    description: 'Schedule an intake meeting with a community-based organization for ongoing wrap-around support.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_NGO_SUPPORT',
    triggerGoal: 'GOAL_BUILD_NETWORK',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'COMMUNITY',
    title: 'Attend Weekly Community Reentry Support Group',
    description: 'Join a welcoming peer support circle to share experiences, strategies, and encouragement.',
    priority: 'MEDIUM',
    triggerNeed: 'NEED_SUPPORT_GROUP',
    triggerGoal: 'GOAL_BUILD_NETWORK',
    defaultDaysToComplete: 7
  },
  {
    pillarSlug: 'COMMUNITY',
    title: 'Visit Neighborhood Community Resource Center',
    description: 'Stop by your local resource center to access free Wi-Fi, computer labs, printing, and staff assistance.',
    priority: 'LOW',
    triggerNeed: 'NEED_COMMUNITY_CENTER',
    triggerGoal: 'GOAL_BUILD_NETWORK',
    defaultDaysToComplete: 5
  }
];

/**
 * Seed initial Pillars and TaskTemplates into the database
 */
async function seedPillarsAndTemplates() {
  try {
    // 1. Seed Pillars
    for (const pillarData of initialPillars) {
      await prisma.pillar.upsert({
        where: { slug: pillarData.slug },
        update: {
          name: pillarData.name,
          description: pillarData.description,
          icon: pillarData.icon
        },
        create: {
          name: pillarData.name,
          slug: pillarData.slug,
          description: pillarData.description,
          icon: pillarData.icon
        }
      });
    }

    // Map Pillar slug to ID
    const dbPillars = await prisma.pillar.findMany();
    const pillarMap = {};
    dbPillars.forEach(p => {
      pillarMap[p.slug] = p.id;
    });

    // 2. Seed TaskTemplates
    for (const tmpl of initialTaskTemplates) {
      const pillarId = pillarMap[tmpl.pillarSlug];
      if (!pillarId) continue;

      const existingTmpl = await prisma.taskTemplate.findFirst({
        where: {
          pillarId,
          title: tmpl.title
        }
      });

      if (!existingTmpl) {
        await prisma.taskTemplate.create({
          data: {
            pillarId,
            title: tmpl.title,
            description: tmpl.description,
            priority: tmpl.priority,
            triggerNeed: tmpl.triggerNeed,
            triggerGoal: tmpl.triggerGoal,
            defaultDaysToComplete: tmpl.defaultDaysToComplete
          }
        });
      }
    }

    console.log('✅ Seeded Pillars and TaskTemplates successfully');
  } catch (err) {
    console.error('Pillars/Templates Seeding Error:', err.message);
  }
}

module.exports = {
  seedPillarsAndTemplates
};
