# Stanford University Component Service - Components at Edge

This repo holds the code for Stanford Report components migrated
to Components at Edge. See the
[stanford-report repo](https://github.com/SU-UComm/stanford-report])
for the original code.

Please edit this README as appropriate. I've added some sections as a
suggested structure.

This repo holds the code for Stanford Report components migrated to Components at Edge. See the stanford-report repo for the original code.

This repository contains a collection of edge components built with modern tools and optimized for performance and flexibility. The project leverages tools like Vite, ESLint, Stylelint, Jest, and Tailwind CSS to ensure high-quality code, maintainability, and ease of development.

## Table of Contents

-   [Getting Started](#getting-started)
-   [Project Structure](#project-structure)
-   [Scripts](#scripts)
    -   [Reset](#reset)
    -   [Linting](#linting)
    -   [Testing](#testing)
    -   [Build](#build)
    -   [Development](#development)
-   [Contributing](#contributing)
-   [License](#license)

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

-   Node.js (v20.17.x or higher)
-   npm (v10.8.x or higher)
-   Zsh shell (for running the reset and post-build scripts)

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

1. Build components:

    ```bash
    npm run build
    ```

2. Watch for changes (will automatically build when on save):

    ```bash
    npm run watch
    ```

3. Run local environment:ą

    Note that you need to export your local variables before running a local dxp.

    ```bash
    dxp-next cmp dev-ui ./dist
    ```

    make sure that you have installed latest version (5.22.0 or higher)

## Project Structure

```
packages/
├── component-1/
│   ├── main.js
│   ├── styles.scss
│   ├── manifest.json
│   ├── scripts.js
│   ├── preview-data.json
│   ├── preview.html
│   └── ...
├── component-2/
│   ├── main.js
│   ├── styles.scss
│   ├── manifest.json
│   └── ...
dist/
├── global/
│   ├── bundle.js
│   ├── bundle.css
│   └── ...
├── component-1/
│   ├── main.js
│   ├── manifest.json
│   └── ...
│...
```

Each component is developed as a self-contained module, with its own JavaScript, CSS/SCSS, and manifest files. The final build process bundles all components styles and front-end scripts in to one file for production.

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

Unit tests are run using Jest.

#### Run all tests:

```bash
npm run test
```

#### Run ESLint checks as part of testing:

```bash
npm run test:eslint
```

#### Run unit tests:

```bash
npm run test:unit
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

#### Insert inline assets after the build:

```bash
npm run build:insert
```

#### Build global assets like bundle.js and bundle.css:

```bash
npm run build:global
```

### Development

#### To watch for changes and automatically rebuild components:

```bash
npm run watch
```

#### To start the development environment:

```bash
dxp-next cmp dev-ui ./dist
```

## Contributing

Contributions are welcome! Please ensure that all changes are properly tested and linted before submitting a pull request.

### Add your files

-   [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
-   [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```bash
cd existing_repo
git remote add origin https://gitlab.squiz.net/plug-and-play/stanford-edge-components.git
git branch -M main
git push -uf origin main
```

### Collaborate with your team

-   [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
-   [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
-   [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
-   [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
-   [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

### Test and Deploy

Use the built-in continuous integration in GitLab.

-   [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
-   [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
-   [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
-   [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
-   [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

## License

This project is copyright Squiz and may only be used with the explicit permission of the copyright holder. - see the [License](LICENSE) file for details.
