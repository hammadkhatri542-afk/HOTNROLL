import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (for Firebase Auth link & customer tracking)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 1. Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  imageUrl: text('image_url').notNull(),
  rating: doublePrecision('rating').default(5.0).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // Order number e.g. HNR-4921
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  notes: text('notes'),
  paymentMethod: text('payment_method').notNull(),
  subtotal: doublePrecision('subtotal').notNull(),
  deliveryFee: doublePrecision('delivery_fee').notNull(),
  total: doublePrecision('total').notNull(),
  status: text('status').default('received').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Order Items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  price: doublePrecision('price').notNull(),
});

// 4. Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
