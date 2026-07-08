const prisma = require('../lib/prisma');

async function index(req, res) {
  const emailSeries = await prisma.emailSeries.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { customerSegment: true } });
  res.render('emailSeries/index', { emailSeries, messages: req.flash() });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const series = await prisma.emailSeries.findUnique({
    where: { id },
    include: { emails: { orderBy: { id: 'asc' } } }
  });
  if (!series) return res.status(404).render('404');
  res.render('emailSeries/show', { series, messages: req.flash() });
}

async function create(req, res) {
  const { name, description } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const t = name.trim();
    const normalizedName = t.charAt(0).toUpperCase() + t.slice(1);
    await prisma.emailSeries.create({ data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An email series with that name already exists.'] });
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
    const t = name.trim();
    const normalizedName = t.charAt(0).toUpperCase() + t.slice(1);
    await prisma.emailSeries.update({ where: { id }, data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An email series with that name already exists.'] });
    }
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.emailSeries.delete({ where: { id } });
  req.flash('success', 'Email series deleted successfully.');
  res.redirect('/email-series');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.emailSeries.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}
module.exports = { index, show, create, update, destroy, reorder };
