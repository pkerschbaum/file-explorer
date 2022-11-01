FROM mcr.microsoft.com/playwright:v1.17.2-focal

WORKDIR /app

COPY ../package.json ./package.json
COPY ../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../.npmrc ./.npmrc
COPY ../scripts ./scripts
RUN pnpm i

COPY ../ ./

ENTRYPOINT ["pnpm", "run", "test:pw"]
