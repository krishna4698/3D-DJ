import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './components/Scene.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Mixes from './sections/Mixes.jsx'
import Events from './sections/Events.jsx'
import Contact from './sections/Contact.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SECTIONS = [
  { id: 'hero', number: '01', label: 'Hero', color: '#ff3c00' },
  { id: 'about', number: '02', label: 'About', color: '#00f0ff' },
  { id: 'mixes', number: '03', label: 'Mixes', color: '#ff00aa' },
  { id: 'events', number: '04', label: 'Events', color: '#aaff00' },
  { id: 'contact', number: '05', label: 'Book', color: '#ffffff' },
]

export default function App() {
  const appRef = useRef(null)
  const progressRef = useRef(0)
  const progressBarRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    document.documentElement.style.setProperty('--section-color', SECTIONS[activeIndex].color)
  }, [activeIndex])

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      progressRef.current = Math.min(1, Math.max(0, progress))

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progressRef.current})`
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) {
      return undefined
    }

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const smooth = { x: pointer.x, y: pointer.y }
    let rafId = 0

    const move = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
    }

    const render = () => {
      smooth.x += (pointer.x - smooth.x) * 0.18
      smooth.y += (pointer.y - smooth.y) * 0.18
      ring.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0) translate(-50%, -50%)`
      rafId = window.requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', move, { passive: true })
    rafId = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', move)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  useGSAP(
    () => {
      gsap.defaults({ ease: 'power3.out', duration: 0.8 })

      const sectionEls = gsap.utils.toArray('.content-section')

      sectionEls.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })

        gsap.fromTo(
          section.querySelectorAll('.section-marker, .reveal-line, .reveal-item'),
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              end: 'top 30%',
              scrub: 1,
            },
          },
        )
      })

      const mixesSection = document.querySelector('#mixes')
      const mixTrack = document.querySelector('.mixes-track')

      if (mixesSection && mixTrack) {
        const media = gsap.matchMedia()

        media.add('(min-width: 761px)', () => {
          gsap.to(mixTrack, {
            x: () => {
              const edge = Math.min(window.innerWidth * 0.08, 96)
              return Math.min(0, window.innerWidth - mixTrack.scrollWidth - edge)
            },
            ease: 'none',
            scrollTrigger: {
              trigger: mixesSection,
              start: 'top top',
              end: () => `+=${Math.max(1100, mixTrack.scrollWidth * 0.72)}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => setActiveIndex(2),
              onEnterBack: () => setActiveIndex(2),
              onUpdate: (self) => {
                if (self.isActive) setActiveIndex(2)
              },
            },
          })
        })
      }

      const navItems = gsap.utils.toArray('.nav-link')
      navItems.forEach((link) => {
        const targetId = link.getAttribute('href')
        const target = targetId ? document.querySelector(targetId) : null
        if (!target) return

        ScrollTrigger.create({
          trigger: target,
          start: 'top 45%',
          end: 'bottom 45%',
          toggleClass: { targets: link, className: 'is-active' },
        })
      })

      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: appRef },
  )

  return (
    <div ref={appRef} className="site-shell">
      <Scene
        activeIndex={activeIndex}
        sectionColors={SECTIONS.map((section) => section.color)}
        scrollProgressRef={progressRef}
      />

      <div ref={progressBarRef} className="scroll-progress" aria-hidden="true" />

      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />

      <header className="site-nav">
        <a className="nav-logo" href="#hero" aria-label="DJ NEXUS home">
          DJ NEXUS
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {SECTIONS.map((section) => (
            <a key={section.id} className="nav-link" href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="section-indicator" key={SECTIONS[activeIndex].id} aria-hidden="true">
        <span>{SECTIONS[activeIndex].number}</span>
        <strong>{SECTIONS[activeIndex].label}</strong>
      </div>

      <div className="eq-widget" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <span key={index} style={{ '--bar-delay': `${index * 0.07}s` }} />
        ))}
      </div>

      <main className="sections">
        <Hero number="01" />
        <About number="02" />
        <Mixes number="03" />
        <Events number="04" />
        <Contact number="05" />
      </main>

      <div className="scanline-overlay" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />
    </div>
  )
}
