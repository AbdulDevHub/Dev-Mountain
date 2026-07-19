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
        { type: "doc", id: "getting-started/docusaurus-syntax-reference" },
        { type: "doc", id: "getting-started/docusaurus-react-mdx-reference" },
        { type: "doc", id: "getting-started/markdown-cheatsheet" },
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
        { type: "doc", id: "web-fundamentals/html-quick-reference" },
        { type: "doc", id: "web-fundamentals/css-quick-reference" },
        { type: "doc", id: "web-fundamentals/sass-cheatsheet" },
        { type: "doc", id: "web-fundamentals/javascript-quick-reference" },
        { type: "doc", id: "web-fundamentals/typescript-quick-reference" },
        { type: "doc", id: "web-fundamentals/tailwind-cheatsheet" },
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
        { type: "doc", id: "programming-languages/python-quick-reference" },
        { type: "doc", id: "programming-languages/java-quick-reference" },
        { type: "doc", id: "programming-languages/c-pointers" },
        { type: "doc", id: "programming-languages/sql" },
        { type: "doc", id: "programming-languages/uv-python" },
      ],
    },

    // =========================
    // Frameworks & Libraries
    // =========================
    {
      type: "category",
      label: "Frameworks & Libraries",
      collapsed: true,
      items: [
        { type: "doc", id: "frameworks-libraries/react" },
        { type: "doc", id: "frameworks-libraries/nestjs" },
        { type: "doc", id: "frameworks-libraries/electronjs" },
        { type: "doc", id: "frameworks-libraries/threejs" },
        { type: "doc", id: "frameworks-libraries/gsap" },
        {
          type: "doc",
          id: "frameworks-libraries/frontend-frameworks-comparison",
        },
        {
          type: "doc",
          id: "frameworks-libraries/backend-frameworks-comparison",
        },
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
        { type: "doc", id: "cs-concepts/recursion-fundamentals" },
        { type: "doc", id: "cs-concepts/uml-diagrams" },
        { type: "doc", id: "cs-concepts/regex-cheatsheet" },
        { type: "doc", id: "cs-concepts/design-patterns" },
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
        { type: "doc", id: "scripting-automation/frontend-snippets" },
        { type: "doc", id: "scripting-automation/python-scripts" },
        { type: "doc", id: "scripting-automation/browser-console-scripts" },
        { type: "doc", id: "scripting-automation/terminal-commands" },
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
        { type: "doc", id: "tools-workflow/vscode-setup" },
        { type: "doc", id: "tools-workflow/pnpm-guide" },
        { type: "doc", id: "tools-workflow/terminal-themes" },
        { type: "doc", id: "tools-workflow/commit-lint-guide" },
        { type: "doc", id: "tools-workflow/github-label-setup" },
        { type: "doc", id: "tools-workflow/wsl-dev-setup" },
        { type: "doc", id: "tools-workflow/git-cheatsheet" },
        { type: "doc", id: "tools-workflow/tooling-config-cheatsheet" },
        { type: "doc", id: "tools-workflow/home-directory-map" },
        { type: "doc", id: "tools-workflow/chmod-and-file-mode-basics" },
        { type: "doc", id: "tools-workflow/windows-file-attributes" },
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
        { type: "doc", id: "design-ui/ui-libraries-and-animation" },
        { type: "doc", id: "design-ui/ui-motion-and-inspiration" },
      ],
    },

    // =========================
    // Infrastructure & DevOps
    // =========================
    {
      type: "category",
      label: "Infrastructure & DevOps",
      collapsed: true,
      items: [
        { type: "doc", id: "infrastructure-devops/linux" },
        { type: "doc", id: "infrastructure-devops/powershell" },
        { type: "doc", id: "infrastructure-devops/nginx" },
        { type: "doc", id: "infrastructure-devops/aws" },
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
        { type: "doc", id: "ai-systems/ai-architecture-workflow" },
        { type: "doc", id: "ai-systems/agent-skills" },
        { type: "doc", id: "ai-systems/rag-mcp-fundamentals" },
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
        { type: "doc", id: "quality-testing-performance/software-testing" },
        { type: "doc", id: "quality-testing-performance/accessibility-tools" },
        {
          type: "doc",
          id: "quality-testing-performance/seo-performance-basics",
        },
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
        { type: "doc", id: "security-privacy/learn-cybersecurity" },
        { type: "doc", id: "security-privacy/ubol-custom-filters" },
      ],
    },

    // =========================
    // Project Management
    // =========================
    {
      type: "category",
      label: "Project Management",
      collapsed: true,
      items: [
        { type: "doc", id: "project-management/scrum" },
        { type: "doc", id: "project-management/agile" },
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
        { type: "doc", id: "references-knowledge/learning-platforms" },
        { type: "doc", id: "references-knowledge/asset-filenames" },
        {
          type: "doc",
          id: "references-knowledge/swe-roles-and-specializations",
        },
        { type: "doc", id: "references-knowledge/web-monetization" },
      ],
    },
  ],
}

export default sidebars
