import React from "react"
import Layout from "@theme/Layout"
import Head from "@docusaurus/Head"
import Link from "@docusaurus/Link"

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
        <meta
          name="description"
          content="Learn more about this project, its mission, and resources."
        />
      </Head>

      <div
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <h1 style={{ color: "#25c2a0", marginBottom: "1rem" }}>
          About This Project
        </h1>

        <p>
          Welcome! This project is a curated collection of resources, tutorials,
          UI/UX experiments, and motion design examples for developers and
          designers. The goal is to make it easier to explore and reference
          high-quality tools, libraries, and learning platforms.
        </p>

        <section style={{ marginTop: "2rem", padding: "1.25rem", border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", background: "var(--ifm-code-background)" }}>
          <h2 style={{ marginTop: 0 }}>👤 Author & Personal Bio</h2>
          <p style={{ marginBottom: "1rem" }}>
            Looking for Abdul Hadi Khan's personal profile, background, resume details, technical skills, and complete project portfolio?
          </p>
          <Link
            className="button button--primary button--md"
            to="/about-me"
          >
            View About Me Page →
          </Link>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h2>🎯 Mission</h2>
          <p>
            Our mission is to create a central hub where developers and
            designers can quickly find inspiration, tutorials, and ready-to-use
            frontend snippets, without having to dig through multiple sites.
          </p>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h2>📚 Resources Included</h2>
          <ul>
            <li>Learning platforms for coding and AI</li>
            <li>UI libraries, frameworks, and component systems</li>
            <li>Frontend motion and animation experiments</li>
            <li>Assets, SVGs, icons, and GIFs for prototyping</li>
            <li>Commit conventions and productivity tips</li>
          </ul>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h2>🤝 Contributing</h2>
          <p>
            Feel free to suggest new resources, UI experiments, or motion
            examples. Contributions make this hub stronger and more useful for
            the community!
          </p>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h2>📬 Contact</h2>
          <p>
            You can reach out via the project repository, or submit suggestions
            directly through the blog pages for new resources.
          </p>
        </section>
      </div>
    </Layout>
  )
}
