import { useEffect, useRef, useState } from 'react'
import Diagram from '../diagrams/Diagram'
import { DIAGRAMS } from '../diagrams/specs'
import activity from '../data/activity.json'
import { activities, certs, education, experience, moreRepos, profile, projects, stack, targets, timeline } from '../data/profile'
import { useInView, useMedia } from '../hooks'
import { Arrow, Panel, Reveal, Scramble, SectionHeading } from './ui'

const Wrap = ({ children, className = '' }) => (
  <div className={`mx-auto max-w-[1400px] px-4 md:px-6 ${className}`}>{children}</div>
)

/* ------------------------------------------------------------------ hero */

export function Hero({ ready }) {
  const taglines = [...profile.taglines, `${certs.length}× Certified`]
  return (
    <section id="top" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      <div className={`relative text-center transition-all duration-1000 ${ready ? 'opacity-100' : 'translate-y-5 opacity-0'}`}>
        <p className="label mb-8">// IDENTITY_VERIFIED</p>
        <h1 className="wordmark text-[32vw] leading-none md:text-[15rem]">{profile.mark}</h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-white/50 md:text-sm">{profile.name}</p>
        <p className="mt-8 flex h-8 items-center justify-center overflow-hidden font-mono text-sm uppercase tracking-[0.1em] text-white/70 md:text-2xl">
          <Scramble phrases={taglines} />
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a className="pill" href="#work">View work <Arrow /></a>
          <a className="pill" href="#contact">Contact <Arrow /></a>
        </div>
      </div>
      <a href="#about" className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40" aria-label="Scroll to content">
        <span className="micro">Scroll to explore</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'bob 1.6s ease-in-out infinite' }} aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  )
}

/* ------------------------------------------------------------------ logs */

const SRC_COLOR = { CERT: 'text-term', WORK: 'text-link', BUILD: 'text-white', GIT: 'text-white/60', EVENT: 'text-fuchsia-400', TARGET: 'text-amber-400' }

export function Logs() {
  const rows = [...timeline.filter((r) => r.ts !== 'NEXT'), ...activity]
    .sort((a, b) => a.ts.localeCompare(b.ts))
    .concat(timeline.filter((r) => r.ts === 'NEXT'))
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 }, true)
  const [shown, setShown] = useState(reduced ? rows.length : 0)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!inView || shown >= rows.length) return
    const t = setTimeout(() => setShown((n) => n + 1), 260)
    return () => clearTimeout(t)
  }, [inView, shown, rows.length])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown])

  return (
    <section id="logs" className="relative overflow-hidden border-t hairline py-24 md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <Wrap className="relative">
        <SectionHeading
          chip="LIVE"
          right={<><span className="label">NODE: TUNIS</span><span className="label">SOURCE: CREDLY + GITHUB</span></>}
        >
          System logs
        </SectionHeading>
        <Reveal>
          <div ref={ref}>
            <Panel>
              <div className="flex items-center justify-between border-b hairline bg-white/5 px-4 py-2 md:px-6 md:py-3">
                <div className="micro hidden gap-0 md:flex">
                  <span className="w-28">TIMESTAMP</span>
                  <span className="w-24">SOURCE</span>
                  <span>EVENT_DATA</span>
                </div>
                <span className="micro md:hidden">ACTIVITY_LOG</span>
                <span className="micro !text-white/30">MONITORING</span>
              </div>
              <div
                ref={bodyRef}
                data-lenis-prevent
                className="noscroll h-[400px] overflow-y-auto bg-black/20 px-4 py-4 font-mono text-xs leading-relaxed md:px-6 md:text-sm"
              >
                {shown === 0 && <p className="animate-pulse text-white/40">INITIALIZING DATA STREAM...</p>}
                {rows.slice(0, shown).map((r, i) => (
                  <p key={i} className="flex flex-wrap gap-x-0 py-1 md:flex-nowrap">
                    <span className="w-28 flex-none text-white/40">{r.ts}</span>
                    <span className={`w-24 flex-none ${SRC_COLOR[r.src] || 'text-white/60'}`}>[{r.src}]</span>
                    <span className="w-full text-white/90 md:w-auto">
                      {r.msg}
                      {i === shown - 1 && <span className="cursor-block" />}
                    </span>
                  </p>
                ))}
              </div>
            </Panel>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ------------------------------------------------------------------ work */

function StatusChip({ status }) {
  if (!status) return null
  return (
    <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.1em] text-amber-300">
      {status}
    </span>
  )
}

function Project({ p, index }) {
  return (
    <article className="relative border-b hairline pb-16 pt-8 md:pb-24">
      <Reveal>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="label">
            {String(index + 1).padStart(2, '0')} // {p.kicker} — {p.year}
          </span>
          <StatusChip status={p.status} />
        </div>
        <div className="overflow-hidden pb-2">
          <h3 className="text-massive glitch" data-text={p.title}>{p.title}</h3>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-white/70 md:text-lg">{p.summary}</p>
            {p.repo && (
              <a className="pill mt-6" href={p.repo} target="_blank" rel="noreferrer">
                View repository <Arrow />
              </a>
            )}
          </div>
          <ul className="space-y-3 lg:col-span-7">
            {p.facts.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-relaxed text-white/80 md:text-base">
                <span className="mt-0.5 flex-none font-mono text-term">&gt;</span>
                {f}
              </li>
            ))}
            <li className="flex flex-wrap gap-2 pt-3">
              {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        {p.diagram ? (
          <Diagram spec={DIAGRAMS[p.diagram]} />
        ) : (
          <div className="viewer flex h-56 flex-col items-center justify-center gap-4">
            <span className="bracket tl" /><span className="bracket tr" /><span className="bracket bl" /><span className="bracket br" />
            <span className="h-10 w-10 animate-spin rounded-full border border-white/20 border-t-term" />
            <span className="micro">{p.pending}</span>
          </div>
        )}
      </Reveal>
    </article>
  )
}

export function Work() {
  return (
    <section id="work" className="overflow-x-hidden border-t hairline py-20 md:py-28">
      <Wrap>
        <SectionHeading right={<span className="label">ARCHITECTURES: ANIMATED // TAP A VIEW TO EXPLORE</span>}>
          Selected works
        </SectionHeading>
        <div className="space-y-16 md:space-y-28">
          {projects.map((p, i) => <Project key={p.id} p={p} index={i} />)}
        </div>

        <Reveal className="mt-16">
          <p className="label mb-4">// MORE_REPOSITORIES</p>
          <div className="grid gap-4 md:grid-cols-3">
            {moreRepos.map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="block">
                <Panel className="h-full p-0">
                  <div className="p-5">
                    <p className="flex items-center justify-between gap-3 font-mono text-sm font-bold">
                      <span className="truncate">&gt; {r.name}</span> <Arrow size={14} />
                    </p>
                    <p className="mt-2 text-sm text-white/60">{r.note}</p>
                  </div>
                </Panel>
              </a>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ----------------------------------------------------------------- stack */

export function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t hairline py-24 md:py-32">
      <span className="pointer-events-none absolute -right-6 top-10 select-none text-[28vw] font-black leading-none tracking-[-0.05em] text-white/[0.03]" aria-hidden="true">
        STACK
      </span>
      <Wrap className="relative">
        <SectionHeading right={<><span className="label">SYSTEM_STATUS: OPTIMIZED</span><span className="label">MODULES: {stack.length} LOADED</span></>}>
          Tech arsenal
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-2">
          {stack.map((g, i) => (
            <Reveal key={g.title} delay={i * 70}>
              <Panel title={`● ● ●  ${g.pid}`} right={g.title} className="h-full">
                <div className="flex flex-wrap gap-2 p-5">
                  {g.items.map((it) => <span key={it} className="chip">&gt; {it}</span>)}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ----------------------------------------------------------------- certs */

const fmt = (ym) => {
  const [y, m] = ym.split('-')
  return `${['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][+m - 1]} ${y}`
}

export function Certs() {
  return (
    <section id="certs" className="relative border-t hairline py-24 md:py-32">
      <Wrap>
        <SectionHeading chip={`${String(certs.length).padStart(2, '0')} ACTIVE`} right={<span className="label">VERIFIED_ON: CREDLY</span>}>
          Certifications
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certs.map((c, i) => (
            <Reveal key={c.name} delay={i * 50}>
              <Panel className="h-full">
                <div className="flex h-full min-h-[150px] flex-col justify-between gap-4 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="micro truncate">{c.issuer}</span>
                    <span className="led flex-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    {c.img && (
                      <img src={c.img} alt="" width="72" height="72" loading="lazy" className="h-[72px] w-[72px] flex-none object-contain" />
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-2xl font-bold tracking-[-0.03em]">{c.short}</p>
                      <p className="mt-1 text-xs leading-snug text-white/60">{c.name}</p>
                    </div>
                  </div>
                  <span className="micro">ISSUED: {fmt(c.date)}</span>
                </div>
              </Panel>
            </Reveal>
          ))}
          {targets.map((t) => (
            <Reveal key={t.name}>
              <div className="flex h-full min-h-[150px] flex-col justify-between gap-4 border border-dashed border-amber-400/40 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="micro truncate">{t.issuer}</span>
                  <span className="h-3 w-3 flex-none animate-spin rounded-full border border-white/20 border-t-amber-400" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-[-0.03em] text-white/70">{t.short}</p>
                  <p className="mt-1 text-xs leading-snug text-white/50">{t.name}</p>
                </div>
                <span className="micro !text-amber-300">NEXT_TARGET: {t.status}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <a className="pill" href={profile.links.credly} target="_blank" rel="noreferrer">
            Verify on Credly <Arrow />
          </a>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ------------------------------------------------------------ experience */

export function Experience() {
  return (
    <section id="experience" className="relative border-t hairline py-24 md:py-32">
      <Wrap>
        <SectionHeading right={<span className="label">RECORDS: {experience.length} INTERNSHIPS</span>}>
          Experience
        </SectionHeading>
        <div className="space-y-12">
          {experience.map((x, i) => (
            <Reveal key={x.org}>
              <Panel title={`SEQ_${String(i + 1).padStart(2, '0')} // ${x.period}`} right={x.role}>
                <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <h3 className="text-2xl font-bold tracking-[-0.03em] md:text-4xl">{x.org}</h3>
                    <p className="label mt-3 !normal-case !tracking-normal !text-white/60">{x.project}</p>
                    {x.headline && (
                      <p className="mt-6 border-l-2 border-white/30 pl-4 text-base leading-relaxed text-white/80">{x.headline}</p>
                    )}
                  </div>
                  <div className="lg:col-span-7">
                    <ul className="space-y-3">
                      {x.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-white/80 md:text-base">
                          <span className="mt-0.5 flex-none font-mono text-term">&gt;</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {x.tools.map((t) => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </div>
                </div>
                {x.diagram && (
                  <div className="px-3 pb-3 md:px-8 md:pb-8">
                    <Diagram spec={DIAGRAMS[x.diagram]} />
                  </div>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {[
            { title: 'SPEC_SHEET // EDUCATION', rows: education },
            { title: 'SPEC_SHEET // EVENTS + LANGUAGES', rows: activities },
          ].map((sheet) => (
            <Reveal key={sheet.title}>
              <Panel title={sheet.title} className="h-full">
                <dl>
                  {sheet.rows.map((e) => (
                    <div key={e.k} className="flex gap-4 border-b hairline p-5 last:border-b-0">
                      <dt className="micro w-14 flex-none pt-1">{e.k}</dt>
                      <dd>
                        <p className="font-mono text-sm font-bold">{e.v}</p>
                        <p className="mt-1 text-sm text-white/60">{e.sub}</p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ----------------------------------------------------------------- about */

export function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t hairline py-24 md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <span className="pointer-events-none absolute -left-4 top-4 select-none text-[40vw] font-black leading-none tracking-[-0.05em] text-white/[0.03] md:text-[22rem]" aria-hidden="true">
        01
      </span>
      <Wrap className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label mb-6">— IDENTITY_VERIFIED // {profile.role}</p>
            <h2 className="text-5xl font-bold leading-[0.9] tracking-[-0.05em] md:text-8xl">
              {profile.name.split(' ')[0]}
              <span className="block text-white/20">{profile.name.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="mt-8 border-l-2 border-white/40 pl-4 text-lg leading-relaxed text-white/90 md:text-xl">
              {profile.statement}
            </p>
            {profile.bio.map((b) => (
              <p key={b} className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">{b}</p>
            ))}
            <p className="label mt-6">LOCATION: {profile.location}</p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <Panel title="PORTRAIT.ASCII" right="RENDER: SVG">
              <img src="./portrait.svg" alt={`${profile.name}, ASCII portrait`} className="block w-full" />
            </Panel>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

/* --------------------------------------------------------------- contact */

export function Contact() {
  const l = profile.links
  const links = [
    { k: 'EMAIL', v: l.email, href: `mailto:${l.email}` },
    { k: 'LINKEDIN', v: 'houssem-ben-chabbeh', href: l.linkedin },
    { k: 'GITHUB', v: 'Houssemchabbeh', href: l.github },
    { k: 'CREDLY', v: `${certs.length} active badges`, href: l.credly },
    ...(l.cv ? [{ k: 'CV', v: 'Download PDF', href: l.cv }] : []),
  ]
  return (
    <section id="contact" className="relative overflow-hidden border-t hairline py-24 md:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <Wrap className="relative">
        <SectionHeading chip="AVAILABLE" right={<span className="label">LINKS: {links.length}</span>}>
          Get in touch
        </SectionHeading>
        <Reveal>
          <p className="max-w-2xl border-l-2 border-white/40 pl-4 text-lg leading-relaxed text-white/80 md:text-xl">
            E-mail and LinkedIn are the fastest ways to reach me.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-5">
            {links.map((x) => (
              <a key={x.k} href={x.href} target={x.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block">
                <Panel className="h-full">
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p className="micro">{x.k}</p>
                      <p className="mt-1 truncate font-mono text-sm font-bold">{x.v}</p>
                    </div>
                    <Arrow />
                  </div>
                </Panel>
              </a>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}
