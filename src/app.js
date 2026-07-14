const express = require('express');
const path = require('path');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
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

const basePath = process.env.BASE_PATH || '';

app.locals.basePath = basePath;

// Initialize redis client.
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "email_campaign:",
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(basePath, express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.basePath = basePath;
  const originalRedirect = res.redirect;
  res.redirect = function(status, url) {
    if (typeof status !== 'number') {
      url = status;
      status = 302;
    }
    if (url && url.startsWith('/')) {
      return originalRedirect.call(this, status, basePath + url);
    }
    return originalRedirect.call(this, status, url);
  };
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(basePath + '/events', eventsRouter);
app.use(basePath + '/email-series', emailSeriesRouter);
app.use(basePath + '/emails', emailsRouter);
app.use(basePath + '/customer-segments', customerSegmentsRouter);
app.use(basePath + '/shopify-standard-events', shopifyStandardEventsRouter);
app.use(basePath + '/shopify-webhook-events', shopifyWebhookEventsRouter);
app.use(basePath + '/research', shopifyResearchRouter);
app.use(basePath + '/questions', questionsRouter);
app.use(basePath + '/surveys', surveysRouter);
app.use(basePath + '/profiles', profilesRouter);
app.use(basePath + '/subscriptions', subscriptionsRouter);
app.use(basePath + '/lists', listsRouter);
app.use(basePath + '/website-enhancements', websiteEnhancementsRouter);

app.get(basePath + '/', (req, res) => res.redirect(basePath + '/events'));

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500');
});

module.exports = app;
