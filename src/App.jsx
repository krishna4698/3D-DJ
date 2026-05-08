import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProgress } from '@react-three/drei'
import ExperienceCanvas from './experience/ExperienceCanvas.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CHAPTERS = [
  {
    id: 'hero',
    number: '01',
    label: 'Launch',
    progress: 0,
    color: '#8b5cff',
    eyebrow: 'Outer space signal',
    title: 'DJ NEXUS',
    copy: 'Scroll to fly forward through a futuristic DJ universe built from light, bass, stage energy, and floating visuals.',
  },
  {
    id: 'tunnel',
    number: '02',
    label: 'Tunnel',
    progress: 0.18,
    color: '#00d9ff',
    eyebrow: 'Neon corridor',
    title: 'Neon pulse tunnel',
    copy: 'The camera pushes through rings, beat-reactive lights, particles, fog, and speed lines.',
  },
  {
    id: 'stage',
    number: '03',
    label: 'Stage',
    progress: 0.42,
    color: '#ff2bd6',
    eyebrow: 'Main stage reveal',
    title: 'Mainstage reveal',
    copy: 'Speakers breathe with the beat while lasers sweep across a black-space concert floor.',
  },
  {
    id: 'about',
    number: '04',
    label: 'About',
    progress: 0.62,
    color: '#4dffb8',
    eyebrow: 'Hologram profile',
    title: 'Hologram profile',
    copy: 'Floating UI panels introduce the artist with a premium festival-tech visual language.',
  },
  {
    id: 'gallery',
    number: '05',
    label: 'Gallery',
    progress: 0.78,
    color: '#b4ff00',
    eyebrow: '3D memory wall',
    title: 'Floating photo wall',
    copy: 'Artist photos and DJ visuals sit inside the world as parallax panels instead of normal page images.',
  },
  {
    id: 'booking',
    number: '06',
    label: 'Booking',
    progress: 0.96,
    color: '#ffffff',
    eyebrow: 'Final approach',
    title: 'Booking console',
    copy: 'The journey stops at a glowing contact interface built like a command console.',
  },
]

function getActiveChapter(progress) {
  let active = 0

  CHAPTERS.forEach((chapter, index) => {
    if (progress >= chapter.progress - 0.04) {
      active = index
    }
  })

  return active
}

function LoadingOverlay() {
  const { progress, active } = useProgress()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (progress >= 100 && !active) {
      const timeout = window.setTimeout(() => setHidden(true), 650)
      return () => window.clearTimeout(timeout)
    }

    setHidden(false)
    return undefined
  }, [active, progress])

  return (
    <div className={`loading-screen ${hidden ? 'is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="loading-orbit">
        <span />
        <span />
        <span />
      </div>
      <p>Initializing DJ flight path</p>
      <strong>{Math.round(progress)}%</strong>
    </div>
  )
}

function Hud({ activeIndex, onJump }) {
  const active = CHAPTERS[activeIndex]

  return (
    <header className="hud">
      <a className="hud-logo" href="#hero" onClick={(event) => onJump(event, 0)} aria-label="DJ NEXUS launch">
        DJ NEXUS
      </a>

      <nav className="hud-nav" aria-label="Cinematic journey navigation">
        {CHAPTERS.map((chapter, index) => (
          <a
            key={chapter.id}
            className={`hud-link ${index === activeIndex ? 'is-active' : ''}`}
            href={`#${chapter.id}`}
            onClick={(event) => onJump(event, index)}
          >
            <span>{chapter.number}</span>
            {chapter.label}
          </a>
        ))}
      </nav>

      <div className="hud-readout" aria-hidden="true">
        <span>{active.number}</span>
        <strong>{active.label}</strong>
      </div>
    </header>
  )
}

function ActiveChapterPanel({ chapter }) {
  return (
    <aside key={chapter.id} className="chapter-overlay" aria-live="polite">
      <p>{chapter.eyebrow}</p>
      <h1>{chapter.title}</h1>
      <span>{chapter.copy}</span>
    </aside>
  )
}

function BookingConsole({ active }) {
  return (
    <form className={`booking-console ${active ? 'is-active' : ''}`}>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        Event signal
        <textarea name="message" rows="4" />
      </label>
      <button type="button">Send Booking Signal</button>
    </form>
  )
}

export default function App() {
  const scrollRef = useRef(null)
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const progressBarRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeChapter = CHAPTERS[activeIndex]
  const progressStops = useMemo(() => CHAPTERS.map((chapter) => chapter.progress), [])

  useEffect(() => {
    document.documentElement.style.setProperty('--chapter-color', activeChapter.color)
  }, [activeChapter])

  useGSAP(
    () => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return undefined

      gsap.fromTo(
        '.hud',
        { autoAlpha: 0, y: -18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.35 },
      )

      const trigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
        onUpdate: (self) => {
          progressRef.current = self.progress
          velocityRef.current = self.getVelocity()

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`
          }

          const nextIndex = getActiveChapter(self.progress)
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
        },
      })

      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      return () => trigger.kill()
    },
    { scope: scrollRef },
  )

  const jumpTo = (event, index) => {
    event.preventDefault()
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: maxScroll * progressStops[index],
      behavior: 'smooth',
    })
  }

  return (
    <div className="app-shell">
      <ExperienceCanvas progressRef={progressRef} velocityRef={velocityRef} activeIndex={activeIndex} />
      <LoadingOverlay />
      <Hud activeIndex={activeIndex} onJump={jumpTo} />
      <ActiveChapterPanel chapter={activeChapter} />
      <BookingConsole active={activeIndex === CHAPTERS.length - 1} />

      <div ref={progressBarRef} className="journey-progress" aria-hidden="true" />

      <main ref={scrollRef} className="scroll-journey">
        {CHAPTERS.map((chapter) => (
          <section key={chapter.id} id={chapter.id} className="journey-panel" aria-label={chapter.label} />
        ))}
      </main>

      <div className="scanlines" aria-hidden="true" />
    </div>
  )
}
