import { index, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
    short_url: text('short_url').notNull(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [unique().on(t.url), unique().on(t.short_url), index('url_ids_idx').on(t.id)],
);

export const url_visits = pgTable(
  'url_visits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    url_id: uuid('url_id')
      .notNull()
      .references(() => urls.id, { onDelete: 'cascade' }),
    ip: text('ip').notNull(),
    ...timestamps,
  },
  (t) => [index('url_visits_ids_idx').on(t.id)],
);

export const userRelationships = relations(users, ({ many }) => ({
  urls: many(urls),
}));

export const urlRelationships = relations(urls, ({ one, many }) => ({
  user: one(users, { fields: [urls.user_id], references: [users.id] }),
  visits: many(url_visits),
}));

export const urlVisitRelationships = relations(url_visits, ({ one }) => ({
  url: one(urls, { fields: [url_visits.url_id], references: [urls.id] }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;

export type UrlVisit = typeof url_visits.$inferSelect;
export type NewUrlVisit = typeof url_visits.$inferInsert;
