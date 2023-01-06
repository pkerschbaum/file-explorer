FROM mcr.microsoft.com/playwright:v1.29.1-focal

# Install pnpm
RUN npm i -g pnpm@7.11.0

WORKDIR /file-explorer

COPY ./.npmrc ./.npmrc
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./packages/app/package.json ./packages/app/package.json
COPY ./packages/app/scripts/ ./packages/app/scripts/

RUN pnpm i

COPY ./packages/app/ ./packages/app/

WORKDIR /file-explorer/packages/app

ENTRYPOINT ["pnpm", "run", "test:pw"]
