import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  try {
    // Create a sample user
    const user = await prisma.user.upsert({
      where: { email: 'admin@salesai.com' },
      update: {},
      create: {
        email: 'admin@salesai.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });
    
    console.log('Created user:', user);
    
    // Create a sample lead
    const lead = await prisma.lead.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        company: 'Example Corp',
        jobTitle: 'CEO',
        propertyType: 'Office',
        priceMin: 500000,
        priceMax: 1000000,
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        source: 'WEBSITE',
        priority: 'HIGH',
        qualificationScore: 85,
        aiConfidence: 0.92,
        tags: ['enterprise', 'office-space'],
        notes: ['Interested in downtown office space', 'Budget confirmed'],
      },
    });
    
    console.log('Created lead:', lead);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
