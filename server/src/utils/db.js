const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let prisma;

// Fix for Vercel Serverless read-only filesystem
// If running on Vercel, copy dev.db to /tmp/dev.db where write operations are permitted
if (process.env.VERCEL) {
  const dbDir = '/tmp';
  const dbPath = path.join(dbDir, 'dev.db');

  const candidateSourcePaths = [
    path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'server', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'prisma', 'dev.db')
  ];

  if (!fs.existsSync(dbPath)) {
    console.log('📦 Vercel detected: Locating source SQLite database...');
    let copied = false;

    for (const sourcePath of candidateSourcePaths) {
      if (fs.existsSync(sourcePath)) {
        try {
          fs.copyFileSync(sourcePath, dbPath);
          console.log(`✅ SQLite DB successfully copied from ${sourcePath} to ${dbPath}`);
          copied = true;
          break;
        } catch (e) {
          console.error(`❌ Failed to copy SQLite DB from ${sourcePath}:`, e);
        }
      }
    }

    if (!copied) {
      console.warn('⚠️ Could not find pre-built dev.db source file on Vercel.');
    }
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:/tmp/dev.db'
      }
    }
  });
} else {
  prisma = new PrismaClient();
}

/**
 * Seed initial Admin and Demo User accounts if not present
 */
const seedInitialUsers = async () => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@restartkit.com' }
    });

    const hashedPassword = await bcrypt.hash('adminpassword123', 10);
    const userHashedPassword = await bcrypt.hash('password123', 10);

    if (!adminExists) {
      console.log('🌱 Seeding default Admin user (admin@restartkit.com)...');
      await prisma.user.create({
        data: {
          email: 'admin@restartkit.com',
          passwordHash: hashedPassword,
          role: 'ADMIN',
          profile: {
            create: {
              name: 'ReStart Kit Admin',
              city: 'Chennai',
              state: 'Tamil Nadu',
              location: 'Chennai Central',
              bio: 'System Administrator Account'
            }
          }
        }
      });
    }

    // Seed Demo User 1 (Jordan Smith - Chennai)
    const jordanExists = await prisma.user.findUnique({ where: { email: 'jordan@example.com' } });
    if (!jordanExists) {
      await prisma.user.create({
        data: {
          email: 'jordan@example.com',
          passwordHash: userHashedPassword,
          role: 'USER',
          profile: {
            create: {
              name: 'Jordan Smith',
              age: 32,
              city: 'Chennai',
              state: 'Tamil Nadu',
              location: 'Anna Nagar',
              bio: 'Seeking local identity document support & job placement in Chennai'
            }
          }
        }
      });
    }

    // Seed Demo User 2 (Alex Rivers - Chennai)
    const alexExists = await prisma.user.findUnique({ where: { email: 'alex@example.com' } });
    if (!alexExists) {
      await prisma.user.create({
        data: {
          email: 'alex@example.com',
          passwordHash: userHashedPassword,
          role: 'USER',
          profile: {
            create: {
              name: 'Alex Rivers',
              age: 29,
              city: 'Chennai',
              state: 'Tamil Nadu',
              location: 'T. Nagar',
              bio: 'Rebuilding career & seeking vocational skill training'
            }
          }
        }
      });
    }

    // Also update existing demo users' locations to Chennai if they exist
    await prisma.profile.updateMany({
      where: {
        user: {
          email: { in: ['admin@restartkit.com', 'jordan@example.com', 'alex@example.com'] }
        }
      },
      data: {
        city: 'Chennai',
        state: 'Tamil Nadu'
      }
    });

  } catch (err) {
    console.error('Error seeding initial users:', err);
  }
};

// Trigger auto-seeding safely
seedInitialUsers().catch(err => console.error("Initial seeding error:", err));

module.exports = {
  prisma,
  seedInitialUsers,
  seedDefaultAdmin: seedInitialUsers
};
