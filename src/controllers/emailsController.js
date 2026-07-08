const prisma = require('../lib/prisma');

async function index(req, res) {
  const emails = await prisma.email.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  res.render('emails/index', { emails, messages: req.flash() });
}

async function create(req, res) {
  const { name, subject, description, emailSeriesId } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const t = name.trim();
    const normalizedName = t.charAt(0).toUpperCase() + t.slice(1);
    const data = { name: normalizedName, subject: (subject || '').trim(), description: (description || '').trim() };
    if (emailSeriesId) data.emailSeriesId = Number(emailSeriesId);
    await prisma.email.create({ data });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An email with that name already exists.'] });
    }
    throw err;
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { name, subject, description } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const t = name.trim();
    const normalizedName = t.charAt(0).toUpperCase() + t.slice(1);
    await prisma.email.update({ where: { id }, data: { name: normalizedName, subject: subject.trim(), description: description.trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['An email with that name already exists.'] });
    }
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const { emailSeriesId } = req.body;
  await prisma.email.delete({ where: { id } });
  req.flash('success', 'Email deleted successfully.');
  if (emailSeriesId) return res.redirect('/email-series/' + emailSeriesId);
  res.redirect('/emails');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.email.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}
module.exports = { index, create, update, destroy, reorder };
