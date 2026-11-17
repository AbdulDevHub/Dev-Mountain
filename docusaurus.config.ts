import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
  title: "Dev Mountain",
  tagline: "Curated Dev Resources • Dynamic UI • T-Rex Energy",
  favicon: "img/favicon.svg",

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      type: "text/css",
    },
  ],

  url: "https://dev-mountain.vercel.app",
  baseUrl: "/",
  trailingSlash: false,

  organizationName: "AbdulDevHub",
  projectName: "Dev-Mountain",

  future: {
    v4: true,
    faster: true,
  },

  onBrokenLinks: "throw",

  headTags: [
    {
      tagName: "link",
      attributes: { rel: "preconnect", href: "https://fonts.googleapis.com" },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Dev Mountain",
        url: "https://dev-mountain.vercel.app",
        description:
          "Developer cheatsheets, guides and curated links for web, AI, system design, terminal and DevOps.",
        author: {
          "@type": "Person",
          name: "Abdul Khan",
          url: "https://github.com/AbdulDevHub",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://dev-mountain.vercel.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }),
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
    mermaid: true,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },
  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: "/resources",
        language: ["en"],
      },
    ],
  ],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/AbdulDevHub/Dev-Mountain/tree/main/",
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/AbdulDevHub/Dev-Mountain/tree/main/",
          onInlineAuthors: "ignore",
          onUntruncatedBlogPosts: "ignore",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: null,
          priority: null,
          ignorePatterns: ["/tags/**", "/blog/tags/**", "/search"],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "resources",
        path: "resources",
        routeBasePath: "resources",
        sidebarPath: "./sidebars-resources.ts",
        editUrl: "https://github.com/AbdulDevHub/Dev-Mountain/tree/main/",
        showLastUpdateTime: true,
      },
    ],
  ],

  themeConfig: {
    image: "img/social-card.png",
    metadata: [
      {
        name: "keywords",
        content:
          "developer cheatsheets, programming guides, web development, AI agents, system design, terminal commands, devops, docusaurus",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "author", content: "Abdul Khan" },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Dev Mountain",
      hideOnScroll: true,
      logo: {
        alt: "Dev Mountain logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docusaurus Guide",
        },
        {
          type: "docSidebar",
          sidebarId: "resourcesSidebar",
          docsPluginId: "resources",
          position: "left",
          label: "Resources",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/about", label: "About", position: "left" },
        {
          href: "https://github.com/AbdulDevHub/Dev-Mountain",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Docusaurus Guide",
              to: "/docs/intro",
            },
            {
              label: "Resources",
              to: "/resources",
            },
            {
              label: "Learning Platforms",
              to: "/resources/references-knowledge/learning-platforms",
            },
          ],
        },
        {
          title: "Projects",
          items: [
            {
              label: "Agent Skills Factory",
              href: "https://github.com/AbdulDevHub/Agent-Skills-Factory",
            },
            {
              label: "AbdulDevHub on GitHub",
              href: "https://github.com/AbdulDevHub",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "About Me",
              to: "/about-me",
            },
            {
              label: "GitHub",
              href: "https://github.com/AbdulDevHub/Dev-Mountain",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dev Mountain by Abdul Khan. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
