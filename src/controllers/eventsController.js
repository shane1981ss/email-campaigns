const prisma = require('../lib/prisma');

async function index(req, res) {
  const events = await prisma.events.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  res.render('events/index', { events, messages: req.flash() });
}

async function create(req, res) {
  const { name, description } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const normalizedName = name.trim().toUpperCase().replace(/\s+/g, '_');
    await prisma.events.create({ data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An event with that name already exists.'] });
    }
    throw err;
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { name, description } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const normalizedName = name.trim().toUpperCase().replace(/\s+/g, '_');
    await prisma.events.update({ where: { id }, data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An event with that name already exists.'] });
    }
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.events.delete({ where: { id } });
  req.flash('success', 'Event deleted successfully.');
  res.redirect('/events');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.events.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}
module.exports = { index, create, update, destroy, reorder };
