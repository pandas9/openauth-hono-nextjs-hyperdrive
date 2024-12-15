import { pgTable, integer, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: text().notNull().unique(),
});
