const SHOPIFY_STANDARD_EVENTS = [
  'alert_displayed',
  'cart_viewed',
  'checkout_address_info_submitted',
  'checkout_completed',
  'checkout_contact_info_submitted',
  'checkout_shipping_info_submitted',
  'checkout_started',
  'collection_viewed',
  'page_viewed',
  'payment_info_submitted',
  'product_added_to_cart',
  'product_removed_from_cart',
  'product_viewed',
  'search_submitted',
  'ui_extension_errored',
];

async function index(req, res) {
  const messages = req.flash();
  res.render('shopifyStandardEvents/index', { events: SHOPIFY_STANDARD_EVENTS, messages });
}

module.exports = { index };
