FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Public config is read at runtime (see src/lib/public-env.ts), not baked into
# the bundle, so the build needs no environment values. The same image runs
# against any environment by supplying env to the runner (docker-compose
# env_file). Build-time prerenders use the fallback values until the running
# container regenerates them.
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8020
ENV PORT=8020
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
