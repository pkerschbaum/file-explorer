FROM mcr.microsoft.com/playwright:v1.17.2-focal

WORKDIR /app

COPY ../package.json ./package.json
COPY ../yarn.lock ./yarn.lock
COPY ../scripts ./scripts
RUN yarn

COPY ../ ./

ENTRYPOINT ["yarn", "run", "test:pw"]
