const prisma = require('../lib/prisma');

async function index(req, res) {
  const questions = await prisma.question.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  res.render('questions/index', { questions, messages: req.flash() });
}

async function create(req, res) {
  const { text } = req.body;
  const errors = [];
  if (!text || !text.trim()) errors.push('Question text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.question.create({ data: { text: text.trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A question with that text already exists.'] });
    throw err;
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { text } = req.body;
  const errors = [];
  if (!text || !text.trim()) errors.push('Question text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.question.update({ where: { id }, data: { text: text.trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A question with that text already exists.'] });
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.question.delete({ where: { id } });
  req.flash('success', 'Question deleted successfully.');
  res.redirect('/questions');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.question.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

module.exports = { index, create, update, destroy, reorder };
