import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

const WEDDING_PHOTOS = [
  {
    src: '/wedding/venue-mandap.jpg',
    title: 'Royal Venue Mandap',
    kicker: 'Garden ceremony',
    copy: 'Layered florals, candle warmth, and a mandap composed like the first frame of a wedding film.',
    layout: 'wide',
    align: 'left',
  },
  {
    src: '/wedding/beach-floral-aisle.jpg',
    title: 'Seaside Floral Aisle',
    kicker: 'Destination vows',
    copy: 'A soft coastal aisle with ivory blooms, pastel edges, and calm negative space around the couple.',
    layout: 'portrait',
    align: 'right',
    secondary: '/wedding/seaside-pastel-mandap.jpg',
  },
  {
    src: '/wedding/night-gold-mandap.jpg',
    title: 'Gold Night Stage',
    kicker: 'Reception glow',
    copy: 'Champagne reflections and cinematic lighting turn the evening stage into a warm luxury set.',
    layout: 'full',
    align: 'center',
  },
  {
    src: '/wedding/golden-bead-mandap.jpg',
    title: 'Golden Bead Mandap',
    kicker: 'Sacred detail',
    copy: 'Suspended textures, polished gold, and a quiet floral rhythm create depth without visual noise.',
    layout: 'overlap',
    align: 'left',
    secondary: '/wedding/floral-canopy.jpg',
  },
  {
    src: '/wedding/garden-heart-stage.jpg',
    title: 'Garden Floral Stage',
    kicker: 'Engagement setting',
    copy: 'A romantic garden composition with sculpted blooms and a stage designed for emotional portraits.',
    layout: 'portrait',
    align: 'right',
  },
  {
    src: '/wedding/seaside-pastel-mandap.jpg',
    title: 'Pastel Beach Mandap',
    kicker: 'Open-air wedding',
    copy: 'A serene palette for ocean light, built with airy drapes and floral softness.',
    layout: 'wide',
    align: 'left',
  },
  {
    src: '/wedding/royal-red-mandap.jpg',
    title: 'Royal Red Mandap',
    kicker: 'Traditional luxury',
    copy: 'Deep ceremonial color, ornate floral framing, and a mandap presence that feels regal on camera.',
    layout: 'full',
    align: 'center',
  },
  {
    src: '/wedding/floral-canopy.jpg',
    title: 'Floral Canopy Moment',
    kicker: 'Soft overhead detail',
    copy: 'An intimate floral canopy with graceful layering for vows, portraits, and slow guest arrival.',
    layout: 'overlap',
    align: 'right',
    secondary: '/wedding/garden-heart-stage.jpg',
  },
]

const SERVICES = [
  ['Wedding Decoration', 'Complete ceremony styling, entrances, aisle moments, guest zones, and elegant venue transformation.'],
  ['Floral Design', 'Fresh floral arches, canopies, garlands, hanging installations, centerpieces, and photo-ready layers.'],
  ['Reception Setup', 'Luxury stages, couple seating, tablescapes, backdrops, lounge accents, and camera-conscious styling.'],
  ['Mandap Decoration', 'Royal, minimal, beach, garden, and traditional mandaps built with balanced sacred detail.'],
  ['Lighting Design', 'Warm cinematic light, chandelier glow, pathway lighting, and reception ambience for every frame.'],
]

const PARTICLES = Array.from({ length: 36 }, (_, index) => ({
  x: `${(index * 29) % 100}%`,
  y: `${12 + ((index * 17) % 76)}%`,
  size: `${3 + (index % 5)}px`,
  delay: `${-(index % 9) * 1.1}s`,
  drift: `${18 + (index % 7) * 7}px`,
}))

function Header({ activeId, onNavigate }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#home" onClick={(event) => onNavigate(event, 'home')} aria-label="Royal Vows home">
        Royal Vows
      </a>
      <nav className="nav-pill" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeId === item.id ? 'is-active' : ''}
            onClick={(event) => onNavigate(event, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function ParticleField({ dense = false }) {
  const particles = dense ? PARTICLES : PARTICLES.slice(0, 24)

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={`${particle.x}-${index}`}
          style={{
            '--x': particle.x,
            '--y': particle.y,
            '--size': particle.size,
            '--delay': particle.delay,
            '--drift': particle.drift,
          }}
        />
      ))}
    </div>
  )
}

function SectionIntro({ eyebrow, title, copy }) {
  return (
    <div className="section-intro reveal-copy">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

function Hero({ onExplore }) {
  return (
    <section id="home" className="hero-section site-section">
      <div className="hero-ambient parallax-bg" aria-hidden="true">
        <div className="light-orb light-orb-one" />
        <div className="light-orb light-orb-two" />
        <div className="hero-photo-veil">
          <img src="/wedding/night-gold-mandap.jpg" alt="" />
        </div>
      </div>
      <ParticleField dense />

      <div className="hero-content">
        <motion.div
          className="hero-load"
          initial={{ opacity: 0, y: 42, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Cinematic wedding decor studio</p>
          <h1>Luxury Wedding Decorations</h1>
          <p className="hero-subtext">We create unforgettable wedding experiences.</p>
          <a className="gold-button" href="#gallery" onClick={(event) => onExplore(event, 'gallery')}>
            Explore Our Work
          </a>
        </motion.div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

function CinematicPhoto({ item, index }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className={`photo-scene photo-${item.layout} photo-${item.align}`}>
      <div className="photo-copy reveal-copy parallax-soft">
        <span>{number} / {item.kicker}</span>
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
      </div>

      <figure className="photo-frame">
        <div className="frame-halo" aria-hidden="true" />
        <div className="image-mask">
          <img className="photo-image" src={item.src} alt={item.title} loading={index < 2 ? 'eager' : 'lazy'} />
        </div>
        <figcaption>{item.kicker}</figcaption>
      </figure>

      {item.secondary && (
        <figure className="floating-photo float-layer" aria-hidden="true">
          <img src={item.secondary} alt="" loading="lazy" />
        </figure>
      )}
    </article>
  )
}

function PhotoShowcase() {
  return (
    <section id="gallery" className="showcase-section site-section">
      <SectionIntro
        eyebrow="Wedding stories"
        title="A cinematic reveal of mandaps, florals, aisles, and reception stages."
        copy="Each image enters like a quiet scene change, with soft masks, parallax depth, and warm champagne light."
      />

      <div className="photo-story">
        {WEDDING_PHOTOS.map((item, index) => (
          <CinematicPhoto key={item.src} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

function Marquee() {
  const marqueeRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const marqueePhotos = [...WEDDING_PHOTOS, ...WEDDING_PHOTOS]

  useEffect(() => {
    if (!marqueeRef.current) return undefined
    if (!('IntersectionObserver' in window)) {
      setIsActive(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
      },
      { rootMargin: '180px 0px' },
    )

    observer.observe(marqueeRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={marqueeRef} className={`marquee-section ${isActive ? 'is-active' : ''}`} aria-label="Wedding decor image reel">
      <div className="marquee-heading reveal-copy">
        <span>Luxury decor reel</span>
        <p>Florals, lights, mandaps, and soft wedding details in continuous motion.</p>
      </div>
      <div className="marquee-viewport">
        <div className="marquee-track">
          {marqueePhotos.map((item, index) => (
            <figure className="marquee-item" key={`${item.src}-${index}`}>
              <img src={item.src} alt={index < WEDDING_PHOTOS.length ? item.title : ''} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="services-section site-section">
      <SectionIntro
        eyebrow="What we craft"
        title="Premium decoration services for weddings that need to feel personal and cinematic."
        copy="From sacred ceremony design to reception atmosphere, every layer is planned for movement, memory, and emotion."
      />
      <div className="services-grid">
        {SERVICES.map(([title, copy], index) => (
          <article className="service-card reveal-card" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  const burstParticles = useMemo(() => Array.from({ length: 18 }, (_, index) => index), [])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
    setBurstKey((key) => key + 1)
    event.currentTarget.reset()
  }

  return (
    <section id="contact" className="contact-section site-section">
      <ParticleField />
      <div className="contact-copy reveal-copy">
        <span>Begin the celebration</span>
        <h2>Let's Create Your Dream Wedding</h2>
        <p>
          Share the date and a few details. We will shape a refined decor concept around your venue, family rituals,
          light, florals, and the feeling you want guests to remember.
        </p>
      </div>

      <form className="contact-form reveal-card" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required />
        </label>
        <label>
          Event Date
          <input name="eventDate" type="date" required />
        </label>
        <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit">
          Send Wedding Enquiry
        </motion.button>

        <AnimatePresence>
          {sent && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="burst" key={burstKey} aria-hidden="true">
                {burstParticles.map((particle) => (
                  <span key={`${burstKey}-${particle}`} style={{ '--i': particle }} />
                ))}
              </div>
              Your enquiry has been received with care.
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </section>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const lenisRef = useRef(null)
  const progressBarRef = useRef(null)
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const mobileScroll = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches

    if (mobileScroll) {
      ScrollTrigger.normalizeScroll(false)
      window.setTimeout(() => ScrollTrigger.refresh(), 250)
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis
    const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
      else lenis.off?.('scroll', ScrollTrigger.update)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const handleNavigate = (event, id) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.45, offset: 0 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useGSAP(
    () => {
      const mobileAnimations = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`
          }
        },
      })

      NAV_ITEMS.forEach((item) => {
        ScrollTrigger.create({
          trigger: `#${item.id}`,
          start: 'top 58%',
          end: 'bottom 42%',
          onToggle: (self) => {
            if (self.isActive) setActiveId(item.id)
          },
        })
      })

      const revealCopy = (once = false) => {
        gsap.utils.toArray('.reveal-copy').forEach((element) => {
          gsap.fromTo(
            element,
            { y: mobileAnimations ? 26 : 46, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: mobileAnimations ? 0.72 : 1.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: mobileAnimations ? 'top 88%' : 'top 82%',
                toggleActions: 'play none none reverse',
                once,
              },
            },
          )
        })
      }

      const revealCards = (once = false) => {
        gsap.utils.toArray('.reveal-card').forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: mobileAnimations ? 24 : 44, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: mobileAnimations ? 0.68 : 0.9,
              delay: mobileAnimations ? 0 : (index % 3) * 0.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: mobileAnimations ? 'top 90%' : 'top 84%',
                toggleActions: 'play none none reverse',
                once,
              },
            },
          )
        })
      }

      gsap.to('.hero-content', {
        y: mobileAnimations ? 28 : 72,
        scale: mobileAnimations ? 0.97 : 0.9,
        autoAlpha: mobileAnimations ? 0.42 : 0.18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: mobileAnimations ? 0.45 : 1.2,
        },
      })

      if (!mobileAnimations) {
        gsap.to('.parallax-bg', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.6,
          },
        })
      }

      revealCopy(mobileAnimations)

      gsap.utils.toArray('.photo-scene').forEach((scene, index) => {
        const image = scene.querySelector('.photo-image')
        const mask = scene.querySelector('.image-mask')
        const floatLayer = scene.querySelector('.float-layer')

        gsap.fromTo(
          scene,
          { y: mobileAnimations ? 34 : 92, autoAlpha: mobileAnimations ? 0 : 0.22 },
          {
            y: 0,
            autoAlpha: 1,
            duration: mobileAnimations ? 0.82 : 1.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene,
              start: mobileAnimations ? 'top 88%' : 'top 80%',
              toggleActions: 'play none none reverse',
              once: mobileAnimations,
            },
          },
        )

        gsap.fromTo(
          mask,
          { clipPath: mobileAnimations ? 'inset(8% 0% 8% 0%)' : 'inset(18% 0% 18% 0%)', scale: 0.96 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: mobileAnimations ? 0.82 : 1.35,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene,
              start: mobileAnimations ? 'top 86%' : 'top 76%',
              toggleActions: 'play none none reverse',
              once: mobileAnimations,
            },
          },
        )

        if (mobileAnimations) {
          gsap.set(image, { scale: 1.02, yPercent: 0 })
        } else {
          gsap.fromTo(
            image,
            { scale: 1.16, yPercent: -7 },
            {
              scale: 1.03,
              yPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            },
          )
        }

        if (floatLayer && !mobileAnimations) {
          gsap.to(floatLayer, {
            yPercent: index % 2 === 0 ? -18 : 16,
            rotate: index % 2 === 0 ? -4 : 4,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.8,
            },
          })
        }
      })

      revealCards(mobileAnimations)

      if (!mobileAnimations) {
        gsap.utils.toArray('.parallax-soft').forEach((element) => {
          gsap.to(element, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          })
        })
      }

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.fonts?.ready?.then(refresh)
      window.setTimeout(refresh, 500)

      return () => {
        window.removeEventListener('load', refresh)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="app-shell">
      <Header activeId={activeId} onNavigate={handleNavigate} />
      <div ref={progressBarRef} className="journey-progress" aria-hidden="true" />
      <main>
        <Hero onExplore={handleNavigate} />
        <PhotoShowcase />
        <Marquee />
        <Services />
        <Contact />
      </main>
    </div>
  )
}
