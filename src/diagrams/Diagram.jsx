import { useEffect, useMemo, useRef, useState } from 'react'
import { ICONS } from './icons'
import { useInView, useMedia } from '../hooks'

/*
  Data-driven animated architecture diagram.

  spec = {
    name, size: { d: [w, h], m: [w, h] },
    groups: [{ id, kind, label, sub, d: [x, y, w, h], m: [x, y, w, h] }],
    nodes:  [{ id, icon, label, sub, ml, msub, d: [x, y], m: [x, y], lp, mlp }],
    edges:  [{ id, from, to, via, mvia, label, dashed, color, only }],
    scenes: [{ id, label, tag, cumulative, steps: [{ c, e, n, s }] }],
  }
  Every node/group has a desktop ("d") and a phone ("m") position, so the same
  diagram is redrawn top-to-bottom on narrow screens instead of being shrunk.
*/

const GROUP = {
  aws: { stroke: '#ff9900' },
  vpc: { stroke: '#8c4fff' },
  az: { stroke: '#38bdf8', dash: '5 4' },
  subnet: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.035)' },
  private: { stroke: '#2dd4bf', fill: 'rgba(45,212,191,0.03)' },
  asg: { stroke: '#ed7100', dash: '6 4', fill: 'rgba(237,113,0,0.04)' },
  host: { stroke: '#ed7100' },
  openstack: { stroke: '#ed1944' },
  k8s: { stroke: '#326ce5', dash: '6 4', fill: 'rgba(50,108,229,0.04)' },
  vm: { stroke: 'rgba(255,255,255,0.32)', fill: 'rgba(255,255,255,0.03)' },
  box: { stroke: 'rgba(255,255,255,0.28)' },
  dashed: { stroke: 'rgba(255,255,255,0.35)', dash: '5 4' },
}

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
const toward = (a, b, r) => {
  const d = dist(a, b) || 1
  return [a[0] + ((b[0] - a[0]) * r) / d, a[1] + ((b[1] - a[1]) * r) / d]
}

function edgeGeometry(edge, byId, L, radius, labelPad) {
  const resolve = (ref) =>
    Array.isArray(ref) ? { p: ref, node: false, pad: 0 } : { p: byId[ref][L] || byId[ref].d, node: true, pad: labelPad(byId[ref]) }
  // a line leaving/entering a node on its label side starts beyond the label
  const extra = (end, other) => (other[1] - end.p[1] > Math.abs(other[0] - end.p[0]) * 0.7 ? end.pad : 0)
  const a = resolve(L === 'm' && edge.mfrom ? edge.mfrom : edge.from)
  const b = resolve(L === 'm' && edge.mto ? edge.mto : edge.to)
  const via = (L === 'm' ? edge.mvia : edge.via) || []
  const pts = [a.p, ...via, b.p]
  if (a.node) pts[0] = toward(pts[0], pts[1], radius + extra(a, pts[1]))
  if (b.node) pts[pts.length - 1] = toward(pts[pts.length - 1], pts[pts.length - 2], radius + 3 + extra(b, pts[pts.length - 2]))
  let len = 0
  let best = { l: -1, mid: pts[0] }
  for (let i = 0; i < pts.length - 1; i++) {
    const l = dist(pts[i], pts[i + 1])
    len += l
    if (l > best.l) best = { l, mid: [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2] }
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  return { d, len, mid: best.mid }
}

function NodeIcon({ icon, s }) {
  const def = ICONS[icon] || { type: 'glyph', text: '?', color: '#888' }
  if (def.type === 'img') {
    return (
      <image
        href={def.url}
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        style={def.invert ? { filter: 'invert(1) brightness(1.8)' } : undefined}
      />
    )
  }
  const tile = (
    <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={5} fill="#0b0b0b" stroke={def.color} strokeOpacity={0.55} />
  )
  if (def.type === 'path') {
    const k = (s * 0.58) / 24
    return (
      <>
        {tile}
        <g transform={`translate(${-12 * k},${-12 * k}) scale(${k})`}>
          <path d={def.d} fill={def.color} />
        </g>
      </>
    )
  }
  return (
    <>
      {tile}
      <text y={s * 0.09} textAnchor="middle" fontSize={s * (def.text.length > 3 ? 0.24 : 0.28)} fontWeight="700" fill={def.color}>
        {def.text}
      </text>
    </>
  )
}

export default function Diagram({ spec, initialScene = 0, initialStep = 0, autoplay = true }) {
  const mobile = useMedia('(max-width: 767px)')
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const L = mobile ? 'm' : 'd'
  const [W, H] = spec.size[L]
  const S = mobile ? 30 : 42 // icon size
  const F = mobile ? 8.6 : 11 // label font
  const F2 = mobile ? 7.4 : 9.4 // sub font

  const [sceneIdx, setSceneIdx] = useState(initialScene)
  const [stepIdx, setStepIdx] = useState(initialStep)
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { threshold: 0.2 })

  const scene = spec.scenes[sceneIdx]
  const step = scene.steps[Math.min(stepIdx, scene.steps.length - 1)]

  useEffect(() => {
    if (!autoplay || reduced || !inView || scene.steps.length < 2) return
    const t = setTimeout(() => setStepIdx((i) => (i + 1) % scene.steps.length), 3400)
    return () => clearTimeout(t)
  }, [autoplay, reduced, inView, scene, stepIdx])

  const labelPad = useMemo(
    () => (n) => {
      const lp = (mobile ? n.mlp : n.lp) || 'b'
      if (lp !== 'b') return 0
      const label = mobile && n.ml !== undefined ? n.ml : n.label
      const sub = mobile && n.msub !== undefined ? n.msub : n.sub
      return (label ? F + 4 : 0) + (sub ? F2 + 3 : 0)
    },
    [mobile, F, F2],
  )
  const byId = useMemo(() => Object.fromEntries(spec.nodes.map((n) => [n.id, n])), [spec])
  const edges = useMemo(
    () =>
      spec.edges
        .filter((e) => !e.only || e.only === L)
        .map((e) => ({ ...e, g: edgeGeometry(e, byId, L, S / 2 + 4, labelPad) })),
    [spec, byId, L, S, labelPad],
  )

  const active = useMemo(() => {
    const set = new Set()
    const upto = scene.cumulative ? scene.steps.slice(0, stepIdx + 1) : [step]
    upto.forEach((st) => (st.e || []).forEach((id) => set.add(id)))
    return set
  }, [scene, step, stepIdx])

  const states = step.s || {}
  const lit = useMemo(() => {
    const set = new Set(step.n || [])
    edges.forEach((e) => {
      if (!active.has(e.id)) return
      const f = L === 'm' && e.mfrom ? e.mfrom : e.from
      const t = L === 'm' && e.mto ? e.mto : e.to
      if (!Array.isArray(f)) set.add(f)
      if (!Array.isArray(t)) set.add(t)
    })
    Object.keys(states).forEach((id) => set.add(id))
    return set
  }, [edges, active, step, states, L])
  const dimOthers = lit.size > 0

  const pick = (i) => {
    setSceneIdx(i)
    setStepIdx(0)
  }

  return (
    <div ref={wrapRef} className="viewer">
      <span className="bracket tl" /><span className="bracket tr" />
      <span className="bracket bl" /><span className="bracket br" />

      <div className="flex items-center justify-between gap-3 border-b hairline bg-black/50 px-4 py-3">
        <span className="micro truncate !text-white/70">{spec.name}</span>
        <span className="micro flex flex-none items-center gap-2">
          <span className="led" /> <span className="hidden xs:inline">LIVE_DIAGRAM</span>
        </span>
      </div>

      <div role="tablist" aria-label="Diagram views" className="noscroll flex gap-2 overflow-x-auto border-b hairline px-4 py-3">
        {spec.scenes.map((sc, i) => (
          <button key={sc.id} role="tab" aria-selected={i === sceneIdx} className="tab" onClick={() => pick(i)}>
            {sc.label}
          </button>
        ))}
      </div>

      <svg
        className="dg block h-auto w-full"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${spec.name}: ${scene.label}. ${step.c}`}
      >
        <defs>
          <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="rgba(255,255,255,0.28)" />
          </marker>
          <marker id="arr-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#ffffff" />
          </marker>
        </defs>

        {spec.groups.map((g) => {
          const [x, y, w, h] = g[L] || g.d
          const st = GROUP[g.kind] || GROUP.box
          const label = (mobile && g.ml) || g.label
          const sub = mobile ? g.msub : g.sub
          return (
            <g key={g.id}>
              <rect x={x} y={y} width={w} height={h} rx={6} fill={st.fill || 'none'} stroke={st.stroke} strokeOpacity={0.75} strokeDasharray={st.dash} />
              {label && (
                <text x={x + 9} y={g.lpos === 'b' ? y + h - 6 : y + F + 5} fontSize={F2 + 0.6} fill={st.stroke} fontWeight="700" letterSpacing="0.04em">
                  {label}
                </text>
              )}
              {sub && (
                <text x={x + 9} y={y + F * 2 + 8} fontSize={F2} fill="rgba(255,255,255,0.45)">
                  {sub}
                </text>
              )}
            </g>
          )
        })}

        {edges.map((e) => {
          const on = active.has(e.id)
          const color = e.color || '#22c55e'
          const dur = Math.min(4, Math.max(1, e.g.len / 120))
          return (
            <g key={e.id}>
              <path
                className="edge-line"
                d={e.g.d}
                fill="none"
                stroke={on ? '#ffffff' : 'rgba(255,255,255,0.9)'}
                strokeOpacity={on ? 0.75 : dimOthers ? 0.13 : 0.3}
                strokeWidth={on ? 1.5 : 1}
                strokeDasharray={e.dashed ? '4 4' : undefined}
                markerEnd={on ? 'url(#arr-on)' : 'url(#arr)'}
              />
              {on && !reduced &&
                [0, 0.5].map((off) => (
                  <circle key={off} r={mobile ? 2.4 : 3} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                    <animateMotion dur={`${dur}s`} begin={`-${(dur * off).toFixed(2)}s`} repeatCount="indefinite" path={e.g.d} />
                  </circle>
                ))}
              {e.label && (!mobile || e.ml) && (on || !dimOthers) && (
                <g transform={`translate(${e.g.mid[0]},${e.g.mid[1]})`}>
                  <text
                    textAnchor="middle"
                    dy={3}
                    fontSize={F2}
                    fill={on ? '#fff' : 'rgba(255,255,255,0.55)'}
                    stroke="#000"
                    strokeWidth={4}
                    paintOrder="stroke"
                  >
                    {(mobile && e.ml !== true && e.ml) || e.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {spec.nodes.map((n) => {
          const [x, y] = n[L] || n.d
          const st = states[n.id]
          const dim = dimOthers && !lit.has(n.id)
          const label = mobile && n.ml !== undefined ? n.ml : n.label
          const sub = mobile && n.msub !== undefined ? n.msub : n.sub
          const lp = (mobile ? n.mlp : n.lp) || 'b'
          const side = lp === 'r' || lp === 'l'
          const tx = lp === 'r' ? S / 2 + 7 : lp === 'l' ? -S / 2 - 7 : 0
          const anchor = lp === 'r' ? 'start' : lp === 'l' ? 'end' : 'middle'
          const ty = side ? (sub ? -1 : 4) : lp === 't' ? -S / 2 - (sub ? F2 + 9 : 7) : S / 2 + F + 3
          const tagColor = st === 'down' ? '#ef4444' : '#22c55e'
          const tag = { down: 'DOWN', new: 'NEW', promoted: 'PROMOTED', restore: 'RESTORED', restart: 'RESTARTING' }[st]
          return (
            <g key={n.id} className="node" transform={`translate(${x},${y})`} opacity={st === 'down' ? 0.55 : dim ? 0.3 : 1}>
              {(st === 'new' || st === 'promoted' || st === 'hot' || st === 'restore') && !reduced && (
                <circle className="ring" r={S * 0.72} fill="none" stroke="#22c55e" strokeWidth={1.5} />
              )}
              <NodeIcon icon={n.icon} s={S} />
              {st === 'down' && (
                <g stroke="#ef4444" strokeWidth={2.2} strokeLinecap="round">
                  <line x1={-S / 2} y1={-S / 2} x2={S / 2} y2={S / 2} />
                  <line x1={S / 2} y1={-S / 2} x2={-S / 2} y2={S / 2} />
                </g>
              )}
              {tag && (
                <text y={-S / 2 - 6} textAnchor="middle" fontSize={F2} fontWeight="700" fill={tagColor} stroke="#000" strokeWidth={3} paintOrder="stroke">
                  {tag}
                </text>
              )}
              {label && (
                <text x={tx} y={ty} textAnchor={anchor} fontSize={F} fill="#fff" fillOpacity={0.9} stroke="#000" strokeWidth={3} paintOrder="stroke">
                  {label}
                </text>
              )}
              {sub && (
                <text x={tx} y={ty + F2 + 3} textAnchor={anchor} fontSize={F2} fill="rgba(255,255,255,0.5)" stroke="#000" strokeWidth={3} paintOrder="stroke">
                  {sub}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div className="flex min-h-[92px] items-start gap-3 border-t hairline bg-black/50 px-4 py-3 md:min-h-[68px] md:items-center">
        <div className="flex flex-none gap-1.5">
          {scene.steps.map((_, i) => (
            <button
              key={i}
              className="stepdot"
              aria-current={i === stepIdx ? 'step' : undefined}
              aria-label={`Step ${i + 1}`}
              onClick={() => setStepIdx(i)}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
        <p className="font-mono text-[12px] leading-relaxed text-white/80 md:text-[13px]" aria-live="polite">
          {scene.tag && <span className="mr-2 text-term">[{scene.tag}]</span>}
          {step.c}
        </p>
      </div>
    </div>
  )
}
