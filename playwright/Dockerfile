# Dockerfile based on:
# - https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ and
# - https://dev.to/nodepractices/docker-best-practices-with-node-js-4ln4

FROM mcr.microsoft.com/playwright:v1.17.2-focal

WORKDIR /app

COPY ../package.json ./package.json
COPY ../yarn.lock ./yarn.lock
COPY ../scripts ./scripts
RUN yarn

COPY ../ ./

ENTRYPOINT ["yarn", "run", "test:pw"]
