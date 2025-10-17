FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN pnpm install --frozen-lockfile
EXPOSE 5173
CMD ["pnpm","dev","--","--host","0.0.0.0"]
