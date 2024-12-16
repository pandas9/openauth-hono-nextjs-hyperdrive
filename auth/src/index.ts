import { authorizer } from '@openauthjs/openauth';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';
import { type ExecutionContext } from '@cloudflare/workers-types';
import { subjects } from '@openauthjs/openauth/subjects';
import { PasswordAdapter } from '@openauthjs/openauth/adapter/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from 'server/schema';
import { setTheme, Theme } from '@openauthjs/openauth/ui/theme';

const customTheme: Theme = {
	title: 'My Theme',
	radius: 'md',
	primary: '#ff0000',
	background: {
		dark: '#000000',
		light: '#ffffff',
	},
	logo: {
		dark: 'https://lh3.googleusercontent.com/zw9dJAOfPdGj6nLVMGJQeuTEPFft-3i9yzshOxG5N7H2BCWwAwPaWsYYMDpXn_4KrdClYuOH8YSDGqW4_u5quLi2zXpvIZUSdtsd8ubxYVuXwvURxQ',
		light:
			'https://lh3.googleusercontent.com/zw9dJAOfPdGj6nLVMGJQeuTEPFft-3i9yzshOxG5N7H2BCWwAwPaWsYYMDpXn_4KrdClYuOH8YSDGqW4_u5quLi2zXpvIZUSdtsd8ubxYVuXwvURxQ',
	},
	font: {
		family: 'Arial, sans-serif',
		scale: '1.1',
	},
	css: `
    @import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap');
  `,
};

setTheme(customTheme);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return authorizer({
			storage: CloudflareStorage({
				namespace: env.KV,
			}),
			subjects,
			providers: {
				password: PasswordAdapter(
					PasswordUI({
						sendCode: async (email, code) => {
							console.log(email, code);
							await env.KV.put(email, code);
						},
					})
				),
			},
			success: async (ctx, value) => {
				const db = drizzle(env.HYPERDRIVE.connectionString);
				let userID;

				// Try to find existing user
				const existingUser = await db.select().from(users).where(eq(users.email, value.email)).limit(1);

				if (existingUser.length === 0) {
					// User doesn't exist, create new user
					const [newUser] = await db
						.insert(users)
						.values({
							email: value.email,
						})
						.returning({ id: users.id });

					userID = newUser.id;
				} else {
					userID = existingUser[0].id;
				}

				if (!userID) {
					throw new Error('User not found');
				}

				if (value.provider === 'password') {
					return ctx.subject('user', {
						userID,
						email: value.email,
					});
				}
				throw new Error('Invalid provider');
			},
		}).fetch(request, env, ctx);
	},
};
