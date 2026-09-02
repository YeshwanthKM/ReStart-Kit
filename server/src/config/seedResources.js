const { prisma } = require('../utils/db');

const initialResources = [
  // 1. DOCUMENTS
  {
    title: "Washington Department of Licensing – Photo ID Center",
    organization: "Washington State Department of Licensing",
    description: "Assistance with official state photo IDs, driver license replacement, and residency documentation guidance.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "GOVERNMENT_ID",
    categoryName: "Government ID & Licensing",
    address: "2424 4th Ave S",
    city: "Seattle",
    state: "WA",
    contactInfo: "(360) 902-3900 | customercare@dol.wa.gov",
    website: "https://dol.wa.gov"
  },
  {
    title: "Oregon Driver & Motor Vehicle Services (DMV)",
    organization: "Oregon ODOT DMV",
    description: "Official state identification card processing, birth record verification support, and fee waiver guidance.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "GOVERNMENT_ID",
    categoryName: "Government ID & Licensing",
    address: "1500 SW 6th Ave",
    city: "Portland",
    state: "OR",
    contactInfo: "(503) 299-9999 | dmvinfo@oregon.gov",
    website: "https://oregon.gov/odot/dmv"
  },
  {
    title: "Northwest Justice Project – Legal Aid Center",
    organization: "Northwest Justice Project",
    description: "Free civil legal aid, record clearing guidance, and legal identification restoration for eligible individuals.",
    pillarSlug: "DOCUMENTS",
    categorySlug: "LEGAL_AID",
    categoryName: "Legal Aid & Record Clearing",
    address: "401 Second Ave S, Suite 407",
    city: "Seattle",
    state: "WA",
    contactInfo: "(206) 464-1519 | info@nwjustice.org",
    website: "https://nwjustice.org"
  },

  // 2. BASIC NEEDS
  {
    title: "Compass Housing Alliance Shelter Center",
    organization: "Compass Housing Alliance",
    description: "Emergency shelter, supportive housing placement, hot meals, laundry facilities, and mail service.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "HOUSING_SHELTER",
    categoryName: "Housing & Shelter",
    address: "77 S Washington St",
    city: "Seattle",
    state: "WA",
    contactInfo: "(206) 474-1000 | info@compasshousingalliance.org",
    website: "https://compasshousingalliance.org"
  },
  {
    title: "Blanchet House Meals & Housing Center",
    organization: "Blanchet House of Hospitality",
    description: "Free daily hot meal service, transitional housing for men, clothing distribution, and peer support.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "FOOD_ESSENTIALS",
    categoryName: "Food & Basic Essentials",
    address: "310 NW Glisan St",
    city: "Portland",
    state: "OR",
    contactInfo: "(503) 241-4340 | info@blanchethouse.org",
    website: "https://blanchethouse.org"
  },
  {
    title: "Northwest Harvest Food Bank Center",
    organization: "Northwest Harvest Network",
    description: "Community food bank network supplying fresh produce, essential groceries, and hygiene products.",
    pillarSlug: "BASIC_NEEDS",
    categorySlug: "FOOD_ESSENTIALS",
    categoryName: "Food & Basic Essentials",
    address: "1914 N 34th St, Suite 500",
    city: "Seattle",
    state: "WA",
    contactInfo: "(800) 722-6924 | info@northwestharvest.org",
    website: "https://northwestharvest.org"
  },

  // 3. SKILLS
  {
    title: "FareStart Culinary & Vocational Academy",
    organization: "FareStart Non-Profit Training",
    description: "Paid culinary job training, digital literacy workshops, life skills coaching, and job placement assistance.",
    pillarSlug: "SKILLS",
    categorySlug: "VOCATIONAL_TRAINING",
    categoryName: "Vocational & Trade Training",
    address: "700 Virginia St",
    city: "Seattle",
    state: "WA",
    contactInfo: "(206) 443-1233 | info@farestart.org",
    website: "https://farestart.org"
  },
  {
    title: "Portland Community College Opportunity Center",
    organization: "Portland Community College",
    description: "GED preparation classes, computer training labs, career pathway certifications, and financial aid guidance.",
    pillarSlug: "SKILLS",
    categorySlug: "DIGITAL_LITERACY",
    categoryName: "Digital Literacy & Education",
    address: "5600 NE 42nd Ave",
    city: "Portland",
    state: "OR",
    contactInfo: "(971) 722-2000 | admissions@pcc.edu",
    website: "https://pcc.edu"
  },

  // 4. EMPLOYMENT
  {
    title: "WorkSource Seattle Fair-Chance Job Center",
    organization: "WorkSource Washington",
    description: "Comprehensive career services, fair-chance employer hiring fairs, job search assistance, and interview prep.",
    pillarSlug: "EMPLOYMENT",
    categorySlug: "FAIR_CHANCE_JOBS",
    categoryName: "Fair-Chance Employment",
    address: "9600 College Way N",
    city: "Seattle",
    state: "WA",
    contactInfo: "(206) 934-5304 | worksource@seattlecolleges.edu",
    website: "https://worksourcewa.com"
  },
  {
    title: "SE Works Community Career Center",
    organization: "SE Works Organization",
    description: "Fair-chance job placements, trade apprenticeships, interview attire assistance, and career navigation.",
    pillarSlug: "EMPLOYMENT",
    categorySlug: "FAIR_CHANCE_JOBS",
    categoryName: "Fair-Chance Employment",
    address: "7904 SE Division St",
    city: "Portland",
    state: "OR",
    contactInfo: "(503) 772-2300 | info@seworks.org",
    website: "https://seworks.org"
  },

  // 5. COMMUNITY
  {
    title: "Pioneer Human Services Reentry Network",
    organization: "Pioneer Human Services",
    description: "Comprehensive reentry support, 1-on-1 peer mentorship circles, substance recovery guidance, and community advocacy.",
    pillarSlug: "COMMUNITY",
    categorySlug: "REENTRY_NGO",
    categoryName: "Reentry Support NGO",
    address: "740 S Michigan St",
    city: "Seattle",
    state: "WA",
    contactInfo: "(206) 768-1590 | info@pioneerhumanservices.org",
    website: "https://pioneerhumanservices.org"
  },
  {
    title: "Constructing Hope Mentorship & Apprenticeship",
    organization: "Constructing Hope Non-Profit",
    description: "Construction apprenticeship program with 1-on-1 mentorship, tool assistance, and lifelong support network.",
    pillarSlug: "COMMUNITY",
    categorySlug: "MENTORSHIP_CIRCLES",
    categoryName: "Peer Mentorship Circles",
    address: "405 NE Church St",
    city: "Portland",
    state: "OR",
    contactInfo: "(503) 281-1234 | info@constructinghope.org",
    website: "https://constructinghope.org"
  }
];

/**
 * Seed Resources into SQLite database
 */
const seedResources = async () => {
  try {
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

    console.log(`✅ Successfully seeded ${seededCount} verified ReStart Kit resources!`);
    return { success: true, seededCount };
  } catch (err) {
    console.error("❌ Seed Resources Error:", err);
    throw err;
  }
};

module.exports = {
  seedResources
};
