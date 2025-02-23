import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

const timestamps = {
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
};

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    ...timestamps,
  },
  (t) => [index('users_ids_idx').on(t.id)],
);

export const urls = pgTable(
  'urls',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    url: text('url').notNull(),
    short_code: text('short_code').notNull(),
    visitors: integer('visitors').default(0),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [unique().on(t.short_code), index('url_ids_idx').on(t.id)],
);

export const userRelationships = relations(users, ({ many }) => ({
  urls: many(urls),
}));

export const urlRelationships = relations(urls, ({ one }) => ({
  user: one(users, { fields: [urls.user_id], references: [users.id] }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
