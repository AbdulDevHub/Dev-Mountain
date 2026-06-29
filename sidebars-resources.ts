import type { SidebarsConfig } from "@docusaurus/plugin-content-docs"

const sidebars: SidebarsConfig = {
  resourcesSidebar: [
    {
      type: "doc",
      id: "index",
    },
    {
      type: "category",
      label: "Design & UI",
      collapsed: false,
      items: [
        { type: "doc", id: "ui-libraries-and-animation" },
        { type: "doc", id: "ui-motion-and-inspiration" },
      ],
    },
    {
      type: "category",
      label: "Scripting & Automation",
      collapsed: false,
      items: [
        { type: "doc", id: "frontend-snippets" },
        { type: "doc", id: "python-scripts" },
        { type: "doc", id: "browser-console-scripts" },
        { type: "doc", id: "terminal-commands" },
      ],
    },
    {
      type: "category",
      label: "Tools & Setup",
      collapsed: false,
      items: [
        { type: "doc", id: "vscode-setup" },
        { type: "doc", id: "pnpm-guide" },
        { type: "doc", id: "terminal-themes" },
        { type: "doc", id: "commit-lint-guide" },
        { type: "doc", id: "github-label-setup" },
      ],
    },
    {
      type: "category",
      label: "References",
      collapsed: false,
      items: [
        { type: "doc", id: "learning-platforms" },
        { type: "doc", id: "asset-filenames" },
        { type: "doc", id: "agent-skills" },
      ],
    },
  ],
}

export default sidebars