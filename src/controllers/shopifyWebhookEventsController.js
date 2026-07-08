const SHOPIFY_WEBHOOK_EVENTS = [
  // Cart
  'carts_create',
  'carts_update',
  // Checkout
  'checkouts_create',
  'checkouts_delete',
  'checkouts_update',
  // Collection
  'collections_create',
  'collections_delete',
  'collections_update',
  // Customer
  'customers_create',
  'customers_delete',
  'customers_disable',
  'customers_enable',
  'customers_update',
  'customers_sms_marketing_consent_update',
  'customer_account_settings_update',
  'customer_email_marketing_consent_update',
  'customer_groups_create',
  'customer_groups_delete',
  'customer_groups_update',
  'customer_tags_added',
  'customer_tags_removed',
  // Discount
  'discounts_create',
  'discounts_delete',
  'discounts_update',
  // Draft Order
  'draft_orders_create',
  'draft_orders_delete',
  'draft_orders_update',
  // Fulfillment
  'fulfillments_create',
  'fulfillments_update',
  'fulfillment_orders_hold',
  'fulfillment_orders_cancellation_request_accepted',
  'fulfillment_orders_cancellation_request_rejected',
  'fulfillment_orders_cancellation_request_submitted',
  'fulfillment_orders_cancelled',
  'fulfillment_orders_fulfillment_request_accepted',
  'fulfillment_orders_fulfillment_request_rejected',
  'fulfillment_orders_fulfillment_request_submitted',
  'fulfillment_orders_fulfillment_service_failed_to_complete',
  'fulfillment_orders_hold_released',
  'fulfillment_orders_line_items_prepared_for_local_delivery',
  'fulfillment_orders_line_items_prepared_for_pickup',
  'fulfillment_orders_merged',
  'fulfillment_orders_moved',
  'fulfillment_orders_order_routing_complete',
  'fulfillment_orders_placed_on_hold',
  'fulfillment_orders_rescheduled',
  'fulfillment_orders_scheduled_fulfillment_order_ready',
  'fulfillment_orders_split',
  // Inventory
  'inventory_items_create',
  'inventory_items_delete',
  'inventory_items_update',
  'inventory_levels_connect',
  'inventory_levels_disconnect',
  'inventory_levels_update',
  // Location
  'locations_activate',
  'locations_create',
  'locations_deactivate',
  'locations_delete',
  'locations_update',
  // Market
  'markets_create',
  'markets_delete',
  'markets_update',
  // Order
  'orders_cancelled',
  'orders_create',
  'orders_delete',
  'orders_edited',
  'orders_fulfilled',
  'orders_paid',
  'orders_risk_assessment_changed',
  'orders_updated',
  // Product
  'products_create',
  'products_delete',
  'products_update',
  // Refund
  'refunds_create',
  // Shop
  'shop_update',
  // Tender
  'tender_transactions_create',
  // Theme
  'themes_create',
  'themes_delete',
  'themes_publish',
  'themes_update',
  // Transaction
  'transactions_create',
];

async function index(req, res) {
  const messages = req.flash();
  res.render('shopifyWebhookEvents/index', { events: SHOPIFY_WEBHOOK_EVENTS, messages });
}

module.exports = { index };
