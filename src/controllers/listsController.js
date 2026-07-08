const prisma = require('../lib/prisma');

async function index(req, res) {
  const lists = await prisma.customerLists.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  res.render('lists/index', { lists, messages: req.flash() });
}

async function create(req, res) {
  const { name, description } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.customerLists.create({ data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A list with that name already exists.'] });
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
    await prisma.customerLists.update({ where: { id }, data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A list with that name already exists.'] });
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.customerLists.delete({ where: { id } });
  req.flash('success', 'List deleted successfully.');
  res.redirect('/lists');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.customerLists.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

module.exports = { index, create, update, destroy, reorder };
