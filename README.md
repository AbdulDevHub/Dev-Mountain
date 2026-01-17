# ⛰️ Dev Mountain

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

![Screenshot](Screenshot.png)

## About This Project

Welcome! This project is a curated collection of resources, tutorials, UI/UX experiments, and motion design examples for developers and designers. The goal is to make it easier to explore and reference high-quality tools, libraries, and learning platforms.

### 🎯 Mission

Our mission is to create a central hub where developers and designers can quickly find inspiration, tutorials, and ready-to-use frontend snippets, without having to dig through multiple sites.

### 📚 Resources Included

* Learning platforms for coding and AI
* UI libraries, frameworks, and component systems
* Frontend motion and animation experiments
* Assets, SVGs, icons, and GIFs for prototyping
* Commit conventions and productivity tips

### 🤝 Contributing

Feel free to suggest new resources, UI experiments, or motion examples. Contributions make this hub stronger and more useful for the community!

### 📬 Contact

You can reach out via the project repository, or submit suggestions directly through the blog pages for new resources.

---

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

## Deployment

**Using SSH:**

```bash
USE_SSH=true yarn deploy
```

**Not using SSH:**

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub Pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
