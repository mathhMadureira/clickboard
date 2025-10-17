FROM node:20-bullseye-slim
# precisa do 'ps' para o watch do Nest
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate
COPY apps/api ./apps/api
WORKDIR /app/apps/api
# tenta instalar e gerar prisma em build (não falha o build se offline)
RUN pnpm install --frozen-lockfile || true
RUN pnpm prisma generate || true
EXPOSE 3001
# no runtime, garante install no volume e inicia em watch
CMD ["sh","-lc","pnpm install && pnpm start:dev"]
