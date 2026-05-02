# Statix

> ⚡ A blazing-fast static site generator powered by Go and Python.

---

## What is Statix?

**Statix** is a modern static website generator built for speed and simplicity. It combines the raw performance of **Go** for its core build engine with the flexibility of **Python** for templating, scripting, and plugin support — giving you a powerful toolchain for generating production-ready static websites in milliseconds.

Whether you're building a personal blog, a documentation site, a marketing landing page, or a large-scale content platform, Statix delivers your site as pure, pre-rendered HTML/CSS/JS — no server-side runtime required.

---

## Why Statix?

| Feature | Statix | Next.js |
|---|---|---|
| Build engine | Go (compiled, native) | Node.js (interpreted) |
| Scripting layer | Python | JavaScript |
| Cold build speed | ⚡ Milliseconds | 🐢 Seconds–minutes |
| Output | Pure static HTML/CSS/JS | Requires Node.js runtime (SSR/SSG) |
| Memory footprint | Very low | High |
| Deployment | Any static host (Nginx, S3, GitHub Pages, etc.) | Vercel / Node server recommended |
| Learning curve | Familiar CLI + Python templates | React + JSX required |

Next.js is a great React framework, but it comes with significant overhead — a Node.js runtime, a large dependency tree, and slow cold builds for large sites. **Statix removes all of that.** Pages are generated once at build time, resulting in ultra-fast delivery and zero server costs.

---

## Key Features

- 🚀 **Extremely fast builds** — Go's compiled core processes thousands of pages per second.
- 🐍 **Python-powered templates** — Write your layouts and content logic in Python using familiar tools like Jinja2.
- 📦 **Zero runtime dependencies** — The output is plain HTML/CSS/JS that runs anywhere.
- 🔌 **Plugin system** — Extend Statix with Python plugins for custom data sources, shortcodes, and transformations.
- 📝 **Markdown & front-matter support** — Write content in Markdown with YAML front-matter.
- 🎨 **Asset pipeline** — Built-in handling for CSS, JavaScript, and image optimization.
- 🔄 **Live reload dev server** — Instant browser refresh during development.
- 🌍 **Multi-language & i18n ready** — Build multilingual sites with ease.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build engine & CLI | Go |
| Template rendering | Python (Jinja2) |
| Content format | Markdown + YAML front-matter |
| Output | Static HTML / CSS / JS |

---

## Getting Started

> ⚠️ Statix is currently under active development. Installation instructions will be added once the first release is available.

```bash
# Install Statix (coming soon)
go install github.com/Girma35/Statix@latest

# Create a new project
statix new my-site

# Start the dev server
cd my-site && statix serve

# Build for production
statix build
```

---

## Project Status

🚧 **Work in progress.** Core architecture and build pipeline are being designed. Contributions and feedback are welcome!

---

## License

This project will be released under the [MIT License](LICENSE).