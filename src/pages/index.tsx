import type { JSX } from "react"
import Link from "@docusaurus/Link"
import useBaseUrl from "@docusaurus/useBaseUrl"
import Layout from "@theme/Layout"
import Heading from "@theme/Heading"
import TrailIndex, { useTrails } from "@site/src/components/TrailIndex"
import styles from "./index.module.css"

function Contours({ total }: { total: number }): JSX.Element {
  return (
    <svg
      className={styles.contours}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M1250 140 C1000 120 920 260 760 240 S520 120 400 200 S180 330 -50 300" />
        <path d="M1250 200 C1020 180 950 320 780 300 S560 190 430 260 S200 390 -50 370" />
        <path d="M1250 260 C1050 250 990 380 810 370 S600 260 460 320 S230 450 -50 440" />
        <path d="M1250 330 C1080 320 1030 450 850 440 S640 330 500 390 S260 520 -50 520" />
        <path d="M1250 410 C1110 400 1070 520 890 515 S690 410 540 465 S300 600 -50 600" />
        <path d="M1250 500 C1140 490 1110 600 930 600 S740 500 590 550 S340 690 -50 690" />
        <ellipse cx="930" cy="160" rx="120" ry="48" />
        <ellipse cx="930" cy="160" rx="70" ry="26" />
        <ellipse cx="930" cy="160" rx="26" ry="10" />
      </g>
      <circle className={styles.summit} cx="930" cy="160" r="5" />
      <text className={styles.summitLabel} x="1062" y="164">
        summit: {total} pages
      </text>
    </svg>
  )
}

export default function Home(): JSX.Element {
  const trails = useTrails()
  const total = trails.reduce((sum, trail) => sum + trail.count, 0)
  const searchUrl = useBaseUrl("/search")

  return (
    <Layout
      title="Developer cheatsheets and guides"
      description="Developer cheatsheets, guides and curated links for web development, AI agents, system design, terminal tools and DevOps."
    >
      <header className={styles.hero}>
        <Contours total={total} />
        <div className={`container ${styles.heroInner}`}>
          <Heading as="h1" className={styles.title}>
            A developer handbook you can climb.
          </Heading>
          <p className={styles.lede}>
            Abdul's cheatsheets, guides and best links for web, AI, system
            design, the terminal and DevOps. Written to be skimmed: short
            sections and copy-paste commands.
          </p>
          <div className={styles.actions}>
            <form className={styles.search} action={searchUrl} role="search">
              <label htmlFor="home-search" className="sr-only">
                Search the handbook
              </label>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                id="home-search"
                name="q"
                type="search"
                placeholder={`Search ${total} pages`}
                autoComplete="off"
              />
            </form>
            <Link className={styles.cta} to="/resources">
              Browse resources
            </Link>
          </div>
        </div>
      </header>
      <main>
        <TrailIndex trails={trails} />
      </main>
    </Layout>
  )
}
