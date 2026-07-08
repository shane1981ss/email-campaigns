const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

const eventsRouter = require('./routes/events');
const emailSeriesRouter = require('./routes/emailSeries');
const emailsRouter = require('./routes/emails');
const customerSegmentsRouter = require('./routes/customerSegments');
const shopifyStandardEventsRouter = require('./routes/shopifyStandardEvents');
const shopifyWebhookEventsRouter = require('./routes/shopifyWebhookEvents');
const shopifyResearchRouter = require('./routes/shopifyResearch');
const questionsRouter = require('./routes/questions');
const surveysRouter = require('./routes/surveys');
const profilesRouter = require('./routes/profiles');
const subscriptionsRouter = require('./routes/subscriptions');
const listsRouter = require('./routes/lists');
const websiteEnhancementsRouter = require('./routes/websiteEnhancements');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use('/events', eventsRouter);
app.use('/email-series', emailSeriesRouter);
app.use('/emails', emailsRouter);
app.use('/customer-segments', customerSegmentsRouter);
app.use('/shopify-standard-events', shopifyStandardEventsRouter);
app.use('/shopify-webhook-events', shopifyWebhookEventsRouter);
app.use('/research', shopifyResearchRouter);
app.use('/questions', questionsRouter);
app.use('/surveys', surveysRouter);
app.use('/profiles', profilesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/lists', listsRouter);
app.use('/website-enhancements', websiteEnhancementsRouter);

app.get('/', (req, res) => res.redirect('/events'));

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500');
});

module.exports = app;
