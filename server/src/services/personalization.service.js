const { prisma } = require('../utils/db');
const { seedPillarsAndTemplates } = require('../config/seedTemplates');

/**
 * Transparent Rule-Based Personalization Service
 * Generates custom UserTask checklist items based on user assessment needs & goals.
 */
async function generatePersonalizedTasks(userId) {
  // 1. Ensure Pillars and Templates exist
  await seedPillarsAndTemplates();

  // 2. Fetch User Assessment
  const assessment = await prisma.assessment.findUnique({
    where: { userId }
  });

  if (!assessment) {
    throw new Error('Please complete your Needs & Goals Assessment before generating your ReStart Kit.');
  }

  let needs = [];
  let goals = [];

  try {
    needs = typeof assessment.needs === 'string' ? JSON.parse(assessment.needs) : assessment.needs;
  } catch (e) {
    needs = [];
  }

  try {
    goals = typeof assessment.goals === 'string' ? JSON.parse(assessment.goals) : assessment.goals;
  } catch (e) {
    goals = [];
  }

  // 3. Fetch all Task Templates
  const allTemplates = await prisma.taskTemplate.findMany({
    include: {
      pillar: true
    }
  });

  // 4. Rule-Based Filter: Select templates matching user needs, goals, or situation
  const matchedTemplates = allTemplates.filter(tmpl => {
    // Match by triggerNeed
    if (tmpl.triggerNeed && needs.includes(tmpl.triggerNeed)) {
      return true;
    }
    // Match by triggerGoal
    if (tmpl.triggerGoal && goals.includes(tmpl.triggerGoal)) {
      return true;
    }
    // Include essential core templates if situation indicates general fresh start
    if (assessment.situation === 'SITUATION_FRESH_START' && tmpl.priority === 'HIGH') {
      return true;
    }
    return false;
  });

  // If no specific match found (e.g. empty selection), fall back to essential HIGH priority templates
  const templatesToAssign = matchedTemplates.length > 0
    ? matchedTemplates
    : allTemplates.filter(t => t.priority === 'HIGH');

  // 5. Duplicate Prevention: Fetch existing tasks for this user
  const existingUserTasks = await prisma.userTask.findMany({
    where: { userId }
  });

  const existingTemplateIds = new Set(
    existingUserTasks.filter(t => t.taskTemplateId).map(t => t.taskTemplateId)
  );

  const existingTitles = new Set(existingUserTasks.map(t => t.title.toLowerCase()));

  // Filter out templates that have already been created for this user
  const newTemplates = templatesToAssign.filter(tmpl => {
    if (existingTemplateIds.has(tmpl.id)) return false;
    if (existingTitles.has(tmpl.title.toLowerCase())) return false;
    return true;
  });

  // 6. Create UserTask records
  const now = new Date();
  const createdTasks = [];

  for (const tmpl of newTemplates) {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + (tmpl.defaultDaysToComplete || 7));

    const newTask = await prisma.userTask.create({
      data: {
        userId,
        pillarId: tmpl.pillarId,
        taskTemplateId: tmpl.id,
        title: tmpl.title,
        description: tmpl.description,
        priority: tmpl.priority,
        dueDate,
        isCompleted: false
      },
      include: {
        pillar: true
      }
    });

    createdTasks.push(newTask);
  }

  return {
    newTasksCreated: createdTasks.length,
    totalTasks: existingUserTasks.length + createdTasks.length,
    tasks: createdTasks
  };
}

module.exports = {
  generatePersonalizedTasks
};
