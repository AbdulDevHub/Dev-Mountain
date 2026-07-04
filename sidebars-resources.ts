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
      collapsed: true,
      items: [
        { type: "doc", id: "ui-libraries-and-animation" },
        { type: "doc", id: "ui-motion-and-inspiration" },
      ],
    },
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
    {
      type: "category",
      label: "Tools & Setup",
      collapsed: true,
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
      collapsed: true,
      items: [
        { type: "doc", id: "learning-platforms" },
        { type: "doc", id: "asset-filenames" },
        { type: "doc", id: "agent-skills" },
      ],
    },
    {
      type: "doc",
      id: "docusaurus-syntax-reference",
    },
    {
      type: "doc",
      id: "docusaurus-react-mdx-reference",
    },
    {
      type: "doc",
      id: "learn-cybersecurity",
    },
    {
      type: "doc",
      id: "python-quick-reference",
    }
  ],
}

export default sidebars