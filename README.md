# CS 394 Template NX Repo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ This is an empty [Nx workspace](https://nx.dev) for your tribe to populate ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/tutorials/2-react-monorepo/1r-introduction/1-welcome?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Contents

This workspace does not contain any applications or libraries. It is a blank slate for you to build upon. It does have the template documents for helping describe the work process of your tribe and teams. All of them in are in the [`docs`](docs) folder. You can add your own documents to this folder as well. The [Home](docs/Home.md) document is the main page for your tribe. You can add links to other documents in this folder to help describe your work process.

## Getting started

I recommend using degit to make a copy of this repository. This will create a new directory with the contents of this repository without taking its git history. Run the following command to create a new directory with the contents of this repository:

```sh
npx degit https://github.com/toddwseattle/cs394-nx-template-2025.git <your-project-name>
```

Then, navigate to the new directory:

```sh
cd <your-project-name>
```

To get started, run the following command to install the dependencies:

```sh
npm install
```

and initialize the git repository:

```sh
git init
```

applications can be add using

```sh
npx nx g @nx/react:app <application name>
```

or libraries can be added using

```sh
npx nx g @nx/react:lib <library name>
```

The monorepo provides a way to share code between applications and libraries. You can add shared code to the `libs` folder. This is a great way to share code between applications and libraries. As you develop servers to go along with your react frontend, you can add them to the `apps` folder as well. This is a great way to keep your code organized and easy to maintain. You can share libraries between front end apps and backend apps as well; assuming they don't have conflicting dependencies. This is a great way to keep your code organized and easy to maintain.

## Run the development server

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve <application name>
```

To create a production bundle:

```sh
npx nx build <application name>
```

To see all available targets to run for a project, run:

```sh
npx nx show project <application name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the nx docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/react:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib my-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

There are also plugins to help with things like firebase. For example, firebase functions has a plugin that can be used to help with creating and deploying functions. You can find a useful plugin [here](https://github.com/simondotm/nx-firebase).

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

NX makes it easy to setup continuous integration (CI) for your workspace. It provides a command to connect to [Nx Cloud](https://nx.dev/nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects), which is a cloud-based service that provides caching and distributed task execution. This can significantly speed up your CI pipeline.

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/tutorials/2-react-monorepo/1r-introduction/1-welcome?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Files in this project

Here are the key files in the root directory of this workspace:

- `.editorconfig` - Defines coding styles across different editors and IDEs
- `.gitignore` - Specifies which files Git should ignore
- `.prettierignore` - Lists files to be ignored by Prettier formatting
- `.prettierrc` - Configuration for Prettier code formatting
- `eslintrc.config.mjs` - Configuration for ESLint, a tool for identifying and fixing problems in JavaScript code
- `README.md` - This file, containing project documentation
- `nx.json` - Configuration for Nx workspace
- `package-lock.json` - Lock file for npm dependencies
- `package.json` - Project metadata and dependencies
- `tsconfig.base.json` - Base TypeScript configuration shared across the workspace
- `tsconfig.json` - TypeScript configuration for the root project
- `vitest.workspace.ts` - Configuration for Vitest, a testing framework
