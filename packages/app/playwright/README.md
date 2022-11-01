# Playwright configuration, utils, and Docker setup

## Docker setup

For visual regression tests it is important to get consistent results on repeated test runs. However, rendering and painting of a browser depend on many aspects like the operating system being used, the display resolution and density of the device, etc.

In order to get consistent results on different machine configurations, the baseline screenshots (those which get checked into the repository) should be generated with Playwright running within Docker.

The files within this directory provide a convenient Docker setup to execute the visual regression tests:

- [`docker-compose.yml`](./docker-compose.yml) and [`Dockerfile`](./Dockerfile) configure a Docker container capable of running Playwright tests, with **the source directory (`src`) and the test results directory (`test-results`) being mounted as volumes**. This leads to screenshots and test results being stored **on the host** (i.e. the development machine or the CI/CD system) instead of the file system of the Docker container.
- The environment variable `WEB_APP_ORIGIN` is set so that the Playwright tests visit the web application running on the host. All tests use the function `bootstrap` of [`playwright.util.ts`](./playwright.util.ts) to connect to the web application under test.

To run the Docker container, use these two commands:

1. Build the Docker image:
   ```sh
   docker-compose -f ./docker-compose.yml build playwright-service
   ```
2. Create a container and run the tests:

   ```sh
   docker-compose -f ./docker-compose.yml run --rm playwright-service

   # Additional arguments are passed through to "playwright test", therefore you can use all CLI options from here: https://playwright.dev/docs/test-cli.
   # E.g. to run only a specific spec file:
   docker-compose -f ./docker-compose.yml run --rm playwright-service ./src/ui/shell/Shell.visual.spec.ts
   ```

This project uses a NPM script `test:pw-docker` to abstract the two docker-compose commands away, see the script here: [`../package.json`](../package.json).
