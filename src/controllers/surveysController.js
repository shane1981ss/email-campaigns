const prisma = require('../lib/prisma');

async function index(req, res) {
  const surveys = await prisma.survey.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { _count: { select: { questions: true } } } });
  res.render('surveys/index', { surveys, messages: req.flash() });
}

async function create(req, res) {
  const { name, description } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  try {
    await prisma.survey.create({ data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A survey with that name already exists.'] });
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
    await prisma.survey.update({ where: { id }, data: { name: name.trim(), description: (description || '').trim() } });
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2002') return res.status(422).json({ errors: ['A survey with that name already exists.'] });
    throw err;
  }
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await prisma.survey.delete({ where: { id } });
  req.flash('success', 'Survey deleted successfully.');
  res.redirect('/surveys');
}

async function reorder(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.survey.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const survey = await prisma.survey.findUnique({
    where: { id },
    include: { questions: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } }
  });
  if (!survey) return res.status(404).send('Survey not found');
  res.render('surveys/show', { survey, messages: req.flash() });
}

async function createQuestion(req, res) {
  const surveyId = Number(req.params.id);
  const { question } = req.body;
  const errors = [];
  if (!question || !question.trim()) errors.push('Question text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.surveyQuestion.create({ data: { question: question.trim(), surveyId } });
  return res.json({ ok: true });
}

async function updateQuestion(req, res) {
  const questionId = Number(req.params.questionId);
  const { question } = req.body;
  const errors = [];
  if (!question || !question.trim()) errors.push('Question text is required.');
  if (errors.length > 0) return res.status(422).json({ errors });
  await prisma.surveyQuestion.update({ where: { id: questionId }, data: { question: question.trim() } });
  return res.json({ ok: true });
}

async function destroyQuestion(req, res) {
  const surveyId = Number(req.params.id);
  const questionId = Number(req.params.questionId);
  await prisma.surveyQuestion.delete({ where: { id: questionId } });
  res.redirect('/surveys/' + surveyId);
}

async function reorderQuestions(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(422).json({ errors: ['ids must be an array.'] });
  await Promise.all(ids.map((id, i) => prisma.surveyQuestion.update({ where: { id: Number(id) }, data: { position: i } })));
  return res.json({ ok: true });
}

module.exports = { index, create, update, destroy, reorder, show, createQuestion, updateQuestion, destroyQuestion, reorderQuestions };
