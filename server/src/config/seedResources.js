const { prisma } = require('../utils/db');

const initialResources = [
  // 1. DOCUMENTS (Chennai)
  {
    title: "Chennai District Collectorate – Aadhaar & Official ID Seva Kendra",
    organization: "District Revenue & Administration Department",
    description: "Assistance with official state photo IDs, Aadhaar registration, Ration Card updates, and residency documentation guidance.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "GOVERNMENT_ID",
    categoryName: "Government ID & Licensing",
    address: "Rajaji Salai, George Town",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-25268000 | collector-chn@nic.in",
    website: "https://chennai.nic.in"
  },
  {
    title: "Regional Passport Office & Identity Services – Chennai",
    organization: "Ministry of External Affairs, Govt of India",
    description: "Official identity verification, passport issuance, birth record verification support, and official document guidance.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "GOVERNMENT_ID",
    categoryName: "Government ID & Licensing",
    address: "Rayala Towers, 158 Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-28518848 | rpo.chennai@mea.gov.in",
    website: "https://passportindia.gov.in"
  },
  {
    title: "Tamil Nadu State Legal Services Authority (TNSLSA) – Free Legal Aid",
    organization: "High Court Legal Services Committee",
    description: "Free legal assistance, legal aid counsel, record clearing guidance, and legal identification restoration for eligible individuals.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "LEGAL_AID",
    categoryName: "Legal Aid & Record Clearing",
    address: "High Court Campus, Egmore",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-25342834 | tnslsa@tn.gov.in",
    website: "https://tnslsa.tn.gov.in"
  },

  // 2. BASIC NEEDS (Chennai)
  {
    title: "Greater Chennai Corporation – Night Shelter & Housing Center",
    organization: "Greater Chennai Corporation (GCC)",
    description: "Free emergency shelter, transitional housing placement, hot meals, drinking water, and safe accommodation.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "HOUSING_SHELTER",
    categoryName: "Housing & Shelter",
    address: "Wall Tax Road, Chennai Central",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-25619200 | commissioner@chennaicorporation.gov.in",
    website: "https://chennaicorporation.gov.in"
  },
  {
    title: "Amma Unavagam & Community Welfare Meal Center",
    organization: "Chennai Municipal Corporation Food Assistance",
    description: "Highly subsidized daily nutritious breakfast, lunch, and dinner services for community members in need.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "FOOD_ESSENTIALS",
    categoryName: "Food & Basic Essentials",
    address: "Prakasam Road, T. Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "1913 (GCC Helpline) | info@chennaicorporation.gov.in",
    website: "https://chennaicorporation.gov.in"
  },
  {
    title: "Akshaya Patra Foundation – Community Food Center",
    organization: "Akshaya Patra Foundation India",
    description: "Community food relief distribution, essential groceries, hygiene kits, and nutrition support.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "FOOD_ESSENTIALS",
    categoryName: "Food & Basic Essentials",
    address: "GST Road, Tambaram Sanatorium",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-22410010 | infochennai@akshayapatra.org",
    website: "https://akshayapatra.org"
  },

  // 3. SKILLS (Chennai)
  {
    title: "Tamil Nadu Skill Development Corporation (TNSDC) Center",
    organization: "TNSDC Government Skill Academy",
    description: "Free vocational skill training programs, computer literacy courses, digital skills certification, and job placement.",
    pillarSlug: "SKILLS",
    categorySlug: "VOCATIONAL_TRAINING",
    categoryName: "Vocational & Trade Training",
    address: "Guindy Industrial Estate, Guindy",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-22500107 | info@tnsdc.in",
    website: "https://tnsdc.in"
  },
  {
    title: "Government Industrial Training Institute (ITI) – Guindy",
    organization: "Department of Employment & Training, Tamil Nadu",
    description: "Technical trades, electrician & mechanical training, basic computer operation, and diploma preparation.",
    pillarSlug: "SKILLS",
    categorySlug: "DIGITAL_LITERACY",
    categoryName: "Digital Literacy & Education",
    address: "Mount Road, Guindy",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-22500416 | itiguindy@tn.gov.in",
    website: "https://skilltraining.tn.gov.in"
  },
  {
    title: "Chennai Community Digital Literacy & Computer Training Lab",
    organization: "Digital India Skill Foundation",
    description: "Free hands-on computer basics, MS Office training, internet skills, typing, and resume writing workshops.",
    pillarSlug: "SKILLS",
    categorySlug: "DIGITAL_LITERACY",
    categoryName: "Digital Literacy & Education",
    address: "100 Feet Road, Velachery",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-42001122 | digital@chennaiskills.org",
    website: "https://skilltraining.tn.gov.in"
  },

  // 4. EMPLOYMENT (Chennai)
  {
    title: "District Employment & Career Guidance Exchange – Chennai",
    organization: "Department of Employment and Training",
    description: "Fair-chance job registration, private sector job melas, career counseling, resume assistance, and job placements.",
    pillarSlug: "EMPLOYMENT",
    categorySlug: "FAIR_CHANCE_JOBS",
    categoryName: "Fair-Chance Employment",
    address: "Santhome High Road, Mylapore",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-24615160 | deochennai@tn.gov.in",
    website: "https://tnprivatejobs.tn.gov.in"
  },
  {
    title: "Chennai Fair-Chance Industrial Placement Center",
    organization: "Industrial Manufacturers Association",
    description: "Job placements in manufacturing, logistics, retail, hospitality, and municipal service departments for reintegrating individuals.",
    pillarSlug: "EMPLOYMENT",
    categorySlug: "FAIR_CHANCE_JOBS",
    categoryName: "Fair-Chance Employment",
    address: "Industrial Estate Road, Ambattur",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-26251234 | jobs@ambatturindustry.org",
    website: "https://tnprivatejobs.tn.gov.in"
  },

  // 5. COMMUNITY (Chennai)
  {
    title: "The Banyan Reentry & Community Mental Health Network",
    organization: "The Banyan NGO",
    description: "Comprehensive community reintegration, 1-on-1 peer mentorship circles, counseling, and social support services.",
    pillarSlug: "COMMUNITY",
    categorySlug: "REENTRY_NGO",
    categoryName: "Reentry Support NGO",
    address: "6th Main Road, Mogappair West",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-26530599 | info@thebanyan.org",
    website: "https://thebanyan.org"
  },
  {
    title: "Chennai Community Reintegration & Peer Mentorship Circles",
    organization: "Tamil Nadu Social Service Forum",
    description: "Peer support groups, community reintegration circles, family counseling, and NGO resource assistance.",
    pillarSlug: "COMMUNITY",
    categorySlug: "MENTORSHIP_CIRCLES",
    categoryName: "Peer Mentorship Circles",
    address: "Poonamallee High Road, Kilpauk",
    city: "Chennai",
    state: "Tamil Nadu",
    contactInfo: "044-26421100 | contact@tnssf.org",
    website: "https://thebanyan.org"
  }
];

/**
 * Seed Resources into SQLite database
 */
const seedResources = async () => {
  try {
    // Clear old US sample resources if they exist to replace with Chennai resources
    const checkUsResources = await prisma.resource.findFirst({
      where: { city: { in: ['Seattle', 'Portland'] } }
    });

    if (checkUsResources) {
      console.log('🔄 Updating resources database to Chennai & Tamil Nadu regions...');
      await prisma.resource.deleteMany();
    }

    const existingCount = await prisma.resource.count();
    if (existingCount > 0) {
      return { success: true, seededCount: 0, message: "Resources already seeded" };
    }

    let seededCount = 0;
    for (const item of initialResources) {
      const pillar = await prisma.pillar.findUnique({ where: { slug: item.pillarSlug } });
      
      // Upsert Category
      let category = await prisma.resourceCategory.findUnique({ where: { slug: item.categorySlug } });
      if (!category) {
        category = await prisma.resourceCategory.create({
          data: {
            name: item.categoryName,
            slug: item.categorySlug,
            description: `Support resources for ${item.categoryName}`
          }
        });
      }

      if (pillar && category) {
        await prisma.resource.create({
          data: {
            name: item.title,
            organization: item.organization,
            description: item.description,
            pillarId: pillar.id,
            categoryId: category.id,
            address: item.address,
            city: item.city,
            state: item.state,
            contactInfo: item.contactInfo,
            website: item.website,
            isLocationBased: true,
            isActive: true
          }
        });
        seededCount++;
      }
    }

    console.log(`✅ Successfully seeded ${seededCount} verified Chennai ReStart Kit resources!`);
    return { success: true, seededCount };
  } catch (err) {
    console.error("❌ Seed Resources Error:", err);
    throw err;
  }
};

module.exports = {
  seedResources
};
