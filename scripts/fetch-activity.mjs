// Refreshes src/data/activity.json with recent public GitHub pushes.
// Run with `npm run activity` (the deploy workflow runs it before each build).
// If GitHub is unreachable the existing file is kept, so a build never fails.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const USER = 'Houssemchabbeh'
const OUT = fileURLToPath(new URL('../src/data/activity.json', import.meta.url))

try {
  const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const events = await res.json()
  const seen = new Set()
  const rows = []
  for (const ev of events) {
    if (ev.type !== 'PushEvent') continue
    const repo = ev.repo.name.split('/')[1]
    if (repo === USER) continue // profile repo: only automated refreshes
    const day = ev.created_at.slice(0, 10)
    if (seen.has(repo)) continue // newest push per repository only
    seen.add(repo)
    const branch = (ev.payload.ref || '').replace('refs/heads/', '')
    const first = ev.payload.commits?.[0]?.message?.split('\n')[0]
    const name = repo.length > 32 ? `${repo.slice(0, 30)}…` : repo
    rows.push({ ts: day, src: 'GIT', msg: `${name} :: ${first || `latest push to ${branch || 'main'}`}` })
    if (rows.length >= 8) break
  }
  writeFileSync(OUT, JSON.stringify(rows.reverse(), null, 2) + '\n')
  console.log(`activity: wrote ${rows.length} rows`)
} catch (err) {
  console.warn(`activity: kept existing file (${err.message})`)
}
