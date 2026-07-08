const prisma = require('../lib/prisma');

async function index(req, res) {
  const customerSegments = await prisma.customerSegments.findMany({
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    include: {
      entryEvents: { orderBy: { id: 'asc' } },
      exitEvents: { orderBy: { id: 'asc' } },
      emailSeries: { orderBy: { id: 'asc' } },
    }
  });
  res.render('customerSegments/index', { customerSegments, messages: req.flash() });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const segment = await prisma.customerSegments.findUnique({
    where: { id },
    include: {
      entryEvents: { orderBy: { id: 'asc' } },
      exitEvents: { orderBy: { id: 'asc' } },
      emailSeries: { orderBy: { id: 'asc' } },
      query: { orderBy: { id: 'asc' } },
    }
  });
  if (!segment) return res.status(404).render('404');
  const allEmailSeries = await prisma.emailSeries.findMany({ orderBy: { name: 'asc' } });
  const allEvents = await prisma.events.findMany({ orderBy: { name: 'asc' } });
  res.render('customerSegments/show', { segment, allEmailSeries, allEvents, messages: req.flash() });
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
    await prisma.customerSegments.create({ data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['A customer segment with that name already exists.'] });
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
    await prisma.customerSegments.update({ where: { id }, data: { name: normalizedName, description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(422).json({ errors: ['A customer segment with that name already exists.'] });
    }
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.customerSegments.delete({ where: { id } });
  req.flash('success', 'Customer segment deleted successfully.');
  res.redirect('/customer-segments');
}

// Entry Events
async function createEntryEvent(req, res) {
  const segmentId = Number(req.params.id);
  const { eventId } = req.body;
  const errors = [];
  if (!eventId) errors.push('Please select an event.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    const event = await prisma.events.findUnique({ where: { id: Number(eventId) } });
    if (!event) return res.status(422).json({ errors: ['Selected event not found.'] });
    await prisma.entryEvent.create({ data: { name: event.name, customerSegmentId: segmentId } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['This event is already an entry event for this segment.'] });
    throw err;
  }
}

async function destroyEntryEvent(req, res) {
  const segmentId = Number(req.params.id);
  const eventId = Number(req.params.eventId);
  await prisma.entryEvent.delete({ where: { id: eventId } });
  req.flash('success', 'Entry event removed.');
  res.redirect('/customer-segments/' + segmentId);
}

// Exit Events
async function createExitEvent(req, res) {
  const segmentId = Number(req.params.id);
  const { eventId } = req.body;
  const errors = [];
  if (!eventId) errors.push('Please select an event.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    const event = await prisma.events.findUnique({ where: { id: Number(eventId) } });
    if (!event) return res.status(422).json({ errors: ['Selected event not found.'] });
    await prisma.exitEvent.create({ data: { name: event.name, customerSegmentId: segmentId } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['This event is already an exit event for this segment.'] });
    throw err;
  }
}

async function destroyExitEvent(req, res) {
  const segmentId = Number(req.params.id);
  const eventId = Number(req.params.eventId);
  await prisma.exitEvent.delete({ where: { id: eventId } });
  req.flash('success', 'Exit event removed.');
  res.redirect('/customer-segments/' + segmentId);
}

// Email Series assignment
async function assignEmailSeries(req, res) {
  const segmentId = Number(req.params.id);
  const { emailSeriesId } = req.body;
  const errors = [];
  if (!emailSeriesId) errors.push('Please select an email series.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.emailSeries.update({ where: { id: Number(emailSeriesId) }, data: { customerSegmentId: segmentId } });
    return res.json({ ok: true });
  } catch (err) {
    throw err;
  }
}

async function unassignEmailSeries(req, res) {
  const segmentId = Number(req.params.id);
  const seriesId = Number(req.params.seriesId);
  await prisma.emailSeries.update({ where: { id: seriesId }, data: { customerSegmentId: null } });
  req.flash('success', 'Email series unassigned.');
  res.redirect('/customer-segments/' + segmentId);
}

// Queries
async function createQuery(req, res) {
  const segmentId = Number(req.params.id);
  const { name, query } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (!query || !query.trim()) errors.push('Query text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.customerSegmentQuery.create({ data: { name: name.trim(), query: query.trim(), customerSegmentId: segmentId } });
  return res.json({ ok: true });
}
async function updateQuery(req, res) {
  const queryId = Number(req.params.queryId);
  const { name, query } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (!query || !query.trim()) errors.push('Query text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.customerSegmentQuery.update({ where: { id: queryId }, data: { name: name.trim(), query: query.trim() } });
  return res.json({ ok: true });
}
async function destroyQuery(req, res) {
  const segmentId = Number(req.params.id);
  const queryId = Number(req.params.queryId);
  await prisma.customerSegmentQuery.delete({ where: { id: queryId } });
  req.flash('success', 'Query deleted.');
  res.redirect('/customer-segments/' + segmentId);
}
async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.customerSegments.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}
module.exports = { index, show, create, update, destroy, createEntryEvent, destroyEntryEvent, createExitEvent, destroyExitEvent, assignEmailSeries, unassignEmailSeries, reorder, createQuery, updateQuery, destroyQuery };
