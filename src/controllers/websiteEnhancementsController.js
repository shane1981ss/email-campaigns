const prisma = require('../lib/prisma');

async function index(req, res) {
  const enhancements = await prisma.websiteEnhancements.findMany({
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { tasks: true } } }
  });
  res.render('websiteEnhancements/index', { enhancements, messages: req.flash() });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const enhancement = await prisma.websiteEnhancements.findUnique({
    where: { id },
    include: { tasks: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } }
  });
  if (!enhancement) return res.status(404).send('Not found');
  res.render('websiteEnhancements/show', { enhancement, messages: req.flash() });
}

async function createTask(req, res) {
  const id = Number(req.params.id);
  const { name } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.enhancementTask.create({ data: { name: name.trim(), websiteEnhancementsId: id } });
  return res.json({ ok: true });
}

async function updateTask(req, res) {
  const taskId = Number(req.params.taskId);
  const { name } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.enhancementTask.update({ where: { id: taskId }, data: { name: name.trim() } });
  return res.json({ ok: true });
}

async function destroyTask(req, res) {
  const id = Number(req.params.id);
  const taskId = Number(req.params.taskId);
  await prisma.enhancementTask.delete({ where: { id: taskId } });
  req.flash('success', 'Task deleted successfully.');
  res.redirect('/website-enhancements/tasks/' + id);
}

async function reorderTasks(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.enhancementTask.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

async function create(req, res) {
  const { name, description } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.websiteEnhancements.create({ data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['An enhancement with that name already exists.'] });
    throw err;
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { name, description } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.websiteEnhancements.update({ where: { id }, data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['An enhancement with that name already exists.'] });
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.websiteEnhancements.delete({ where: { id } });
  req.flash('success', 'Enhancement deleted successfully.');
  res.redirect('/website-enhancements');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.websiteEnhancements.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

module.exports = { index, show, create, update, destroy, reorder, createTask, updateTask, destroyTask, reorderTasks };
