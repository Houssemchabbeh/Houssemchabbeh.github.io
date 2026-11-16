import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { Boot, Cursor, Footer, Nav } from './components/Chrome'
import { About, Certs, Contact, Experience, Hero, Logs, Stack, Work } from './components/Sections'
import Diagram from './diagrams/Diagram'
import { DIAGRAMS } from './diagrams/specs'

const params = new URLSearchParams(window.location.search)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const skipBoot = reducedMotion || params.has('noboot')
  const [ready, setReady] = useState(skipBoot)
  const done = useCallback(() => setReady(true), [])

  // Smooth scrolling on desktop pointers only; phones keep native scrolling.
  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const lenis = new Lenis({ anchors: true })
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Dev aid: ?d=gaming&scene=1&step=2 renders one diagram alone, frozen.
  const only = params.get('d')
  if (only && DIAGRAMS[only]) {
    return (
      <div className="p-2">
        <Diagram spec={DIAGRAMS[only]} initialScene={+params.get('scene') || 0} initialStep={+params.get('step') || 0} autoplay={false} />
      </div>
    )
  }

  // Dev aid: ?s=stack,certs renders only those sections (for tall screenshots).
  const pickSections = params.get('s')
  if (pickSections) {
    const map = { hero: Hero, about: About, logs: Logs, work: Work, stack: Stack, certs: Certs, experience: Experience, contact: Contact }
    return (
      <main className="static-shot">
        {pickSections.split(',').map((k) => {
          const C = map[k]
          return C ? <C key={k} ready /> : null
        })}
      </main>
    )
  }

  return (
    <>
      {!skipBoot && !ready && <Boot onDone={done} />}
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <div className="relative bg-black">
          <About />
          <Logs />
          <Work />
          <Stack />
          <Certs />
          <Experience />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
