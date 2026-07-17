import type { SidebarsConfig } from "@docusaurus/plugin-content-docs"

const sidebars: SidebarsConfig = {
  resourcesSidebar: [
    {
      type: "doc",
      id: "index",
    },

    // =========================
    // Getting Started
    // =========================
    {
      type: "category",
      label: "Getting Started",
      collapsed: true,
      items: [
        { type: "doc", id: "docusaurus-syntax-reference" },
        { type: "doc", id: "docusaurus-react-mdx-reference" },
        { type: "doc", id: "markdown-cheatsheet" },
      ],
    },

    // =========================
    // Web Fundamentals
    // =========================
    {
      type: "category",
      label: "Web Fundamentals",
      collapsed: true,
      items: [
        { type: "doc", id: "html-quick-reference" },
        { type: "doc", id: "css-quick-reference" },
        { type: "doc", id: "sass-cheatsheet" },
        { type: "doc", id: "javascript-quick-reference" },
        { type: "doc", id: "typescript-quick-reference" },
        { type: "doc", id: "tailwind-cheatsheet" },
      ],
    },

    // =========================
    // Programming Languages
    // =========================
    {
      type: "category",
      label: "Programming Languages",
      collapsed: true,
      items: [
        { type: "doc", id: "python-quick-reference" },
        { type: "doc", id: "java-quick-reference" },
        { type: "doc", id: "c-pointers" },
      ],
    },

    // =========================
    // Computer Science Concepts
    // =========================
    {
      type: "category",
      label: "Computer Science Concepts",
      collapsed: true,
      items: [
        { type: "doc", id: "recursion-fundamentals" },
        { type: "doc", id: "uml-diagrams" },
        { type: "doc", id: "regex-cheatsheet" },
      ],
    },

    // =========================
    // Scripting & Automation
    // =========================
    {
      type: "category",
      label: "Scripting & Automation",
      collapsed: true,
      items: [
        { type: "doc", id: "frontend-snippets" },
        { type: "doc", id: "python-scripts" },
        { type: "doc", id: "browser-console-scripts" },
        { type: "doc", id: "terminal-commands" },
      ],
    },

    // =========================
    // Tools & Workflow
    // =========================
    {
      type: "category",
      label: "Tools & Workflow",
      collapsed: true,
      items: [
        { type: "doc", id: "vscode-setup" },
        { type: "doc", id: "pnpm-guide" },
        { type: "doc", id: "terminal-themes" },
        { type: "doc", id: "commit-lint-guide" },
        { type: "doc", id: "github-label-setup" },
        { type: "doc", id: "wsl-dev-setup" },
        { type: "doc", id: "git-cheatsheet" },
        { type: "doc", id: "tooling-config-cheatsheet" },
      ],
    },

    // =========================
    // Design & UI
    // =========================
    {
      type: "category",
      label: "Design & UI",
      collapsed: true,
      items: [
        { type: "doc", id: "ui-libraries-and-animation" },
        { type: "doc", id: "ui-motion-and-inspiration" },
      ],
    },

    // =========================
    // AI & Systems
    // =========================
    {
      type: "category",
      label: "AI & Systems",
      collapsed: true,
      items: [
        { type: "doc", id: "ai-architecture-workflow" },
        { type: "doc", id: "agent-skills" },
        { type: "doc", id: "rag-mcp-fundamentals" },
      ],
    },

    // =========================
    // Quality, Testing & Performance
    // =========================
    {
      type: "category",
      label: "Quality, Testing & Performance",
      collapsed: true,
      items: [
        { type: "doc", id: "software-testing" },
        { type: "doc", id: "accessibility-tools" },
        { type: "doc", id: "seo-performance-basics" },
      ],
    },

    // =========================
    // Security & Privacy
    // =========================
    {
      type: "category",
      label: "Security & Privacy",
      collapsed: true,
      items: [
        { type: "doc", id: "learn-cybersecurity" },
        { type: "doc", id: "ubol-custom-filters" },
      ],
    },

    // =========================
    // References & Knowledge
    // =========================
    {
      type: "category",
      label: "References & Knowledge",
      collapsed: true,
      items: [
        { type: "doc", id: "learning-platforms" },
        { type: "doc", id: "asset-filenames" },
        { type: "doc", id: "swe-roles-and-specializations" },
      ],
    },
    {
      type: "doc",
      id: "home-directory-map",
    },
    {
      type: "doc",
      id: "chmod-and-file-mode-basics",
    },
    {
      type: "doc",
      id: "windows-file-attributes",
    },
    {
      type: "doc",
      id: "scrum",
    },
    {
      type: "doc",
      id: "nginx",
    },
    {
      type: "doc",
      id: "agile",
    }
  ],
}

export default sidebars