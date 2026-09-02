const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

let dbPath = process.env.DATABASE_URL || 'file:./dev.db';

// On Vercel / serverless environments, copy database to /tmp directory for write access
if (process.env.VERCEL || process.env.AWS_EXECUTION_ENV) {
  const tmpDb = '/tmp/dev.db';
  const bundledDb = path.join(__dirname, '../../prisma/dev.db');
  
  if (!fs.existsSync(tmpDb) && fs.existsSync(bundledDb)) {
    try {
      fs.copyFileSync(bundledDb, tmpDb);
      console.log('Successfully initialized writable SQLite database at /tmp/dev.db');
    } catch (err) {
      console.error('Failed to copy database to /tmp:', err);
    }
  }
  dbPath = 'file:/tmp/dev.db';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbPath
    }
  }
});

let seeded = false;

/**
 * Seed initial Admin user if not present
 */
async function seedDefaultAdmin() {
  if (seeded) return;
  try {
    const adminEmail = 'admin@restartkit.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('adminpassword123', salt);

      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          role: 'ADMIN',
          profile: {
            create: {
              name: 'ReStart Kit Admin',
              city: 'System',
              state: 'Global',
              bio: 'System Administrator Account'
            }
          }
        }
      });
      console.log('✅ Default Admin account created: admin@restartkit.com / adminpassword123');
    }
    seeded = true;
  } catch (err) {
    console.error('Admin seeding error:', err.message);
  }
}

// Automatically attempt seeding
seedDefaultAdmin();

module.exports = {
  prisma,
  seedDefaultAdmin
};
