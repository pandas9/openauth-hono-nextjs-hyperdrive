import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	schema: './db/schema.ts',
	out: './migrations',
	dbCredentials: {
		url: process.env.WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_OPENAUTH_HYPERDRIVE,
	},
});
