import type { JSX } from "react"
import Link from "@docusaurus/Link"
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client"
import sidebars from "@site/sidebars-resources"
import styles from "./styles.module.css"

type Item = { type?: string; id?: string; label?: string; items?: Item[] }

export type Trail = { label: string; count: number; to: string }

function docIds(items: Item[] = []): string[] {
  return items.flatMap((item) =>
    item.type === "category" ? docIds(item.items) : item.id ? [item.id] : [],
  )
}

/** One entry per sidebar category in sidebars-resources.ts, largest first. */
export function useTrails(): Trail[] {
  const docs = useAllDocsData().resources?.versions[0]?.docs ?? []
  const pathById = new Map(docs.map((doc) => [doc.id, doc.path]))
  const root = (sidebars as Record<string, Item[]>).resourcesSidebar ?? []

  return root
    .filter((item) => item.type === "category" && item.label)
    .map((category) => {
      const ids = docIds(category.items)
      return {
        label: category.label as string,
        count: ids.length,
        to: pathById.get(ids[0]) ?? "/resources",
      }
    })
    .sort((a, b) => b.count - a.count)
}

export default function TrailIndex({ trails }: { trails: Trail[] }): JSX.Element {
  return (
    <section className={styles.section} aria-labelledby="trail-index">
      <div className="container">
        <h2 id="trail-index" className={styles.title}>
          Trail index
        </h2>
        <p className={styles.note}>
          {trails.length} topics, sorted by how many pages they hold.
        </p>
        <ul className={styles.list}>
          {trails.map((trail) => (
            <li key={trail.label}>
              <Link className={styles.trail} to={trail.to}>
                <span>{trail.label}</span>
                <span className={styles.count}>
                  {trail.count}
                  <span className="sr-only"> pages</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
