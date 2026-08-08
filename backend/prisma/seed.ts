import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const password = await bcrypt.hash('visitor123', 10);

  const visitor = await prisma.user.upsert({
    where: {
      email: 'visitor@example.com',
    },
    update: {
      username: 'visitor',
      name: 'Demo Visitor',
    },
    create: {
      username: 'visitor',
      email: 'visitor@example.com',
      password,
      name: 'Demo Visitor',
      bio: 'Demo account for TaskFlow',
    },
  });

  console.log(`✅ Demo visitor: ${visitor.email}`);

  const project = await prisma.project.upsert({
    where: {
      id: 'demo-project-taskflow',
    },
    update: {},
    create: {
      id: 'demo-project-taskflow',
      name: 'TaskFlow Demo Project',
      description: 'A sample project demonstrating TaskFlow features.',
      ownerId: visitor.id,
      status: 'active',
    },
  });

  console.log(`✅ Demo project: ${project.name}`);

  await prisma.projectMember.upsert({
    where: {
      userId_projectId: {
        userId: visitor.id,
        projectId: project.id,
      },
    },
    update: {},
    create: {
      userId: visitor.id,
      projectId: project.id,
      role: 'owner',
    },
  });

  const existingTasks = await prisma.task.count({
    where: {
      projectId: project.id,
    },
  });

  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Explore TaskFlow',
          description: 'Take a look around the TaskFlow dashboard.',
          status: 'todo',
          priority: 'medium',
          projectId: project.id,
        },
        {
          title: 'Create your first task',
          description: 'Try creating and assigning a new task.',
          status: 'in-progress',
          priority: 'high',
          projectId: project.id,
        },
        {
          title: 'Complete the demo',
          description: 'Explore projects, tasks, comments and notifications.',
          status: 'done',
          priority: 'low',
          projectId: project.id,
        },
      ],
    });

    console.log('✅ Demo tasks created');
  } else {
    console.log('ℹ️ Demo tasks already exist');
  }

  console.log('🎉 Database seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
