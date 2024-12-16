# Boilerplate for OpenAuth, Next.js, Hono, Hyperdrive, KV and Cloudflare Pages

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
