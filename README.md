# Stanford University Component Service - Components at Edge (Handlebars version)

This repo holds the code for Stanford Report components migrated
to Components at Edge. See the
[stanford-report repo](https://github.com/SU-UComm/stanford-report])
for the original code.

Please edit this README as appropriate. I've added some sections as a
suggested structure.

This repo holds the code for Stanford Report components migrated to Components at Edge. See the stanford-report repo for the original code.

This repository contains a collection of edge components built with modern tools and optimized for performance and flexibility. The project leverages tools like Vite, ESLint, Stylelint, Jest, and Tailwind CSS to ensure high-quality code, maintainability, and ease of development.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
    - [Reset](#reset)
    - [Linting](#linting)
    - [Testing](#testing)
    - [Build](#build)
    - [Local development](#local-development)
    - [Development](#development)
    - [Version Management and other scripts](#version-management-and-other-scripts)
- [Contributing](#contributing)
- [License](#license)

## Getting started

This project uses [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) to ensure compatibility with a specific version of Node.js. NVM allows you to manage and switch between multiple Node.js versions easily.

### Prerequisites

Make sure you have NVM installed on your machine. If not, you can install it by following the instructions from the official NVM repository: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).

#### Using the Correct Node.js Version

Before starting the project, run the following command to ensure you're using the correct version of Node.js specified in the project:

```bash
nvm use
```

This command will automatically switch to the Node.js version defined in the .nvmrc file located in the root of the project. If you don't have the required version installed, NVM will prompt you to install it.

Why Use NVM?
Using NVM ensures that all contributors to the project are using the same Node.js version, which helps prevent version-related bugs and inconsistencies during development.

Installing NVM
If you haven't installed NVM yet, here’s a quick guide:

Install NVM by running the following command in your terminal:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Once installed, close and reopen your terminal, or run:

```bash
source ~/.nvm/nvm.sh
```

Verify NVM is installed:

```bash
nvm --version
```

Now you're ready to start working with the correct Node.js version!

Make sure you have the following installed:

- Node.js (v20.17.x or higher)
- npm (v10.8.x or higher)
- Zsh shell (for running the reset and post-build scripts)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Environment Variables

This project requires specific environment variables to function properly. You can find an `.example.env` file in the root directory, which contains all the necessary environment variables for this project. To set up your environment:

1. Copy the `.example.env` file to a new `.env` file in the root of the project:

    ```bash
    cp .example.env .env
    ```

2. Fill in the values for each variable in the `.env` file according to your project’s needs. All required environment variables can be found in the Component Set Settings.

Make sure your .env file is not included in version control, as it contains sensitive information.

### Usage

#### Running separately

1. Build components:

    ```bash
    npm run build
    ```

2. Run local environment:

    Note that you need to export your local variables before running a local dxp.

    ```bash
    dxp-next cmp dev-ui ./dist
    ```

    make sure that you have installed latest version (5.22.0 or higher)

#### Running all at once

1. Build components run watch and local environment:

    ```bash
    npm run dev
    ```

## Project Structure

```
dist/
├── global/
│   ├── bundle.js
│   └── bundle.css
├── component-1/
│   ├── main.js
│   ├── manifest.json
│   └── ...
└── ...
global/
├── css/
│   └── global.css
├── js/
│   ├── helpers/
│   │   ├── helper-1/
│   │   │   ├── helper.js
│   │   │   └── index.js
│   │   ├── helper-2/
│   │   ├── helper-3/
│   │   └── index.js
│   ├── utils/
│   │   ├── util-1/
│   │   │   ├── util.js
│   │   │   └── index.js
│   │   ├── util-2/
│   │   ├── util-3/
│   │   └── index.js
│   └── ...
packages/
├── component-1/
│   ├── example-data/
│   │   ├── preview.data.json
│   │   └── ...
│   ├── mocked-uris/
│   │   ├── 123.json
│   │   └── ...
│   ├── previews/
│   │   ├── basicstory.html
│   │   ├── preview.html
│   │   └── ...
│   ├── component.hbs
│   ├── main.js
│   ├── main.spec.js
│   ├── manifest.json
│   ├── scripts.js
│   ├── scripts.spec.js
│   ├── styles.scss
│   └── ...
├── component-2/
│   ├── example-data/
│   │   ├── preview.data.json
│   │   └── ...
│   ├── mocked-uris/
│   │   ├── 123.json
│   │   └── ...
│   ├── previews/
│   │   ├── basicstory.html
│   │   ├── preview.html
│   │   └── ...
│   ├── component.hbs
│   ├── main.js
│   ├── main.spec.js
│   ├── manifest.json
│   ├── scripts.js
│   ├── scripts.spec.js
│   ├── styles.scss
│   └── ...
└── ...
```

Each component is developed as a self-contained module, with its own Handlebars template, JavaScript, CSS/SCSS, and manifest files. The final build process bundles all components styles and front-end scripts in to one file for production.

## Scripts

### Reset

To reset your environment or clean up before building:

```bash
npm run reset
```

This runs the `reset.zsh` script, which reset the project’s state (e.g., removing temporary files or resetting the installation).

To remove package-lock.json file please run:

```bash
npm run reset hard
```

### Linting

The project enforces code quality and consistency using ESLint, Stylelint, and CSpell.

#### Run all linting tasks:

```bash
npm run lint
```

#### Lint JavaScript files:

```bash
npm run lint:js
```

#### Lint CSS and SCSS files:

```bash
npm run lint:css
```

#### Run CSpell for spelling checks in code and documentation:

```bash
npm run lint:cspell
```

### Testing

Unit tests are run using vitest.

#### Run all tests:

```bash
npm run test
```

### Build

Build processes include compiling individual components and generating global bundles for production.

#### Build all:

```bash
npm run build
```

#### Build all components:

```bash
npm run build:component
```

#### Build global assets like bundle.js and bundle.css:

```bash
npm run build:global
```

### Development

#### To build components, watch for changes and local environment:

```bash
npm run dev
```

#### To watch for changes and automatically rebuild components:

```bash
npm run watch
```

#### To start the development environment:

```bash
npm run dxp
```

### Version Management and other scripts

```bash
npm run vermgmt
```

You can easily adjust the version of your components—whether you want to increase, decrease, or set a specific one. Plus, you can run a script to deploy them, making it simple to manage components in both the `packages` and `dist` locations.

## Contributing

Contributions are welcome! Please ensure that all changes are properly tested and linted before submitting a pull request.

## License

This project is copyright Squiz and may only be used with the explicit permission of the copyright holder. - see the [License](LICENSE) file for details.
