import { authorizer } from '@openauthjs/openauth';
import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';
import { type ExecutionContext } from '@cloudflare/workers-types';
import { subjects } from '@openauthjs/openauth/subjects';
import { PasswordAdapter } from '@openauthjs/openauth/adapter/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from '../db/schema';
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
				namespace: env.OPENAUTH_KV,
			}),
			subjects,
			providers: {
				password: PasswordAdapter(
					PasswordUI({
						sendCode: async (email, code) => {
							console.log(email, code);
						},
					})
				),
			},
			success: async (ctx, value) => {
				const db = drizzle(env.OPENAUTH_HYPERDRIVE.connectionString);
				console.log(await db.select().from(users));

				let userID;
				if (value.provider === 'password') {
					userID = '123';
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
