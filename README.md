# Boilerplate for OpenAuth, Next.js, Hono, Hyperdrive, KV and Cloudflare Pages

## What's included?

- Monorepo
- RPC, share API specifications between the server and the client
- Drizzle ORM
- OpenAuth
- Hono
- Hyperdrive
- KV
- Next.js
- Cloudflare Pages
- Rate limiting
- R2 file upload

## Setup

```bash
pnpm i
cd packages/openauth
bun run build
cd server
pnpm migrate
```

## Run

```bash
pnpm -r --parallel dev
```

## Recommended

- Use trigger.dev for more complex tasks such as video processing it's also great for queues https://trigger.dev/docs/queue-concurrency

## Why Cloudflare?

- Cheap and reliable
- Fast
- Easy to deploy
- Easy to manage
- Easy to scale
- Easy to use

## Why Hono?

- Fast
- Easy to use
- Better than Next.js API routes
