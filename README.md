# File Explorer <!-- omit in toc -->

⚠️ Work in Progress

- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Build \& Run](#build--run)
  - [Additional commands for development](#additional-commands-for-development)

## Development

### Prerequisites

- Follow the "Prerequisites" installation guide of [microsoft/vscode/wiki/How-to-Contribute#prerequisites](https://github.com/microsoft/vscode/wiki/How-to-Contribute#prerequisites).
  - You can skip the installation of `yarn`, it is not needed for this repository.
  - For the NodeJS version to use, please refer to the file [.nvmrc](./.nvmrc) of this project. This is the version of NodeJS the project should be developed with.  
    It is recommended to use [nvm](https://github.com/nvm-sh/nvm) and run `nvm use`, this will automatically switch to the NodeJS version mentioned in `.nvmrc`.
- This monorepo ("workspace") uses [`pnpm`](https://pnpm.io/) as package manager.  
  For installation instructions see [pnpm.io/installation](https://pnpm.io/installation); it should boil down to this command:

  ```sh
  npm i -g pnpm
  ```

### Build & Run

1. **Install all dependencies:**

   ```sh
   pnpm install
   ```

1. **Run an initial build:**

   ```sh
   pnpm run w:build
   ```

1. **Start the app:**

   ```sh
   cd ./packages/app
   pnpm run start
   ```

### Additional commands for development

See `scripts` of [`./package.json`](./package.json) for available scripts in the workspace.
