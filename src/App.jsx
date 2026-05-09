import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ExperienceCanvas from './experience/ExperienceCanvas.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

const GALLERY = [
  {
    src: '/wedding/venue-mandap.jpg',
    title: 'Candle-lit Royal Mandap',
    type: 'Garden wedding',
  },
  {
    src: '/wedding/beach-floral-aisle.jpg',
    title: 'Seaside Floral Aisle',
    type: 'Destination ceremony',
  },
  {
    src: '/wedding/night-gold-mandap.jpg',
    title: 'Gold Reflective Stage',
    type: 'Night reception',
  },
  {
    src: '/wedding/golden-bead-mandap.jpg',
    title: 'Golden Bead Mandap',
    type: 'Sunset celebration',
  },
  {
    src: '/wedding/garden-heart-stage.jpg',
    title: 'Garden Floral Stage',
    type: 'Engagement setup',
  },
  {
    src: '/wedding/seaside-pastel-mandap.jpg',
    title: 'Pastel Beach Mandap',
    type: 'Luxury beach wedding',
  },
]

const SERVICES = [
  ['Wedding Decoration', 'Venue styling, entrance design, aisle decor, guest zones, and complete ceremony ambience.'],
  ['Mandap Decoration', 'Royal mandaps with florals, drapes, chandeliers, gold details, and sacred-stage styling.'],
  ['Reception Setup', 'Premium reception stages, couple seating, lighting, tablescapes, and photo moments.'],
  ['Floral Decoration', 'Fresh floral walls, garlands, hanging installations, arches, and petal pathways.'],
  ['Destination Weddings', 'Beach, resort, palace, farmhouse, and outdoor wedding styling with travel-ready planning.'],
  ['Event Management', 'Concept, vendor coordination, decor execution, timelines, guest flow, and final production.'],
]

function Header({ activeId }) {
  const jumpTo = (event, id) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="site-header">
      <a className="brand-mark" href="#home" onClick={(event) => jumpTo(event, 'home')} aria-label="Royal Vows home">
        Royal Vows
      </a>
      <nav className="nav-pill" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeId === item.id ? 'is-active' : ''}
            onClick={(event) => jumpTo(event, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function SectionLabel({ eyebrow, title, copy }) {
  return (
    <div className="section-label reveal">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

function GalleryCard({ item, index }) {
  return (
    <article className={`gallery-card reveal gallery-card-${index + 1}`}>
      <img src={item.src} alt={item.title} loading={index < 2 ? 'eager' : 'lazy'} />
      <div>
        <span>{item.type}</span>
        <h3>{item.title}</h3>
      </div>
    </article>
  )
}

function ServiceCard({ title, copy, index }) {
  return (
    <article className="service-card reveal">
      <span>{String(index + 1).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  )
}

function ContactForm() {
  return (
    <form className="contact-card reveal">
      <label>
        Name
        <input name="name" type="text" autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        Phone or email
        <input name="contact" type="text" autoComplete="email" placeholder="How should we contact you?" />
      </label>
      <label>
        Event details
        <textarea name="message" rows="5" placeholder="Tell us about your date, venue, and decor vision." />
      </label>
      <button type="button">Send Enquiry</button>
    </form>
  )
}

export default function App() {
  const progressRef = useRef(0)
  const progressBarRef = useRef(null)
  const [activeId, setActiveId] = useState('home')
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), [])

  useEffect(() => {
    document.documentElement.style.setProperty('--active-section', activeId)
  }, [activeId])

  useGSAP(() => {
    const mainTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        progressRef.current = self.progress
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${self.progress})`
        }
      },
    })

    const sectionTriggers = sectionIds.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 65%',
        end: 'bottom 35%',
        onToggle: (self) => {
          if (self.isActive) setActiveId(id)
        },
      }),
    )

    const revealAnimation = gsap.fromTo(
      '.reveal',
      { y: 42, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.page-content',
          start: 'top 70%',
        },
      },
    )

    const batched = ScrollTrigger.batch('.reveal', {
      start: 'top 82%',
      onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out' }),
      onLeaveBack: (batch) => gsap.to(batch, { y: 28, autoAlpha: 0.35, duration: 0.35, ease: 'power2.out' }),
    })

    window.setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      mainTrigger.kill()
      sectionTriggers.forEach((trigger) => trigger.kill())
      revealAnimation.kill()
      batched.forEach((trigger) => trigger.kill())
    }
  }, [sectionIds])

  return (
    <div className="app-shell">
      <ExperienceCanvas progressRef={progressRef} activeId={activeId} />
      <Header activeId={activeId} />
      <div ref={progressBarRef} className="journey-progress" aria-hidden="true" />

      <main className="page-content">
        <section id="home" className="site-section hero-section">
          <div className="hero-copy reveal">
            <p className="eyebrow">Luxury Indian wedding decor and event management</p>
            <h1>Elegant wedding spaces designed with warmth, florals, and royal detail.</h1>
            <p>
              We create cinematic mandaps, reception stages, floral aisles, and complete event experiences with a
              premium dark green and gold design language.
            </p>
            <div className="hero-actions">
              <a href="#gallery">View Work</a>
              <a href="#contact">Plan an Event</a>
            </div>
          </div>

          <aside className="hero-showcase reveal" aria-label="Featured wedding decoration">
            <img src="/wedding/venue-mandap.jpg" alt="Royal candle-lit floral mandap" />
            <div>
              <span>Featured setup</span>
              <strong>Royal floral mandap with candle-lit aisle</strong>
            </div>
          </aside>
        </section>

        <section id="gallery" className="site-section gallery-section">
          <SectionLabel
            eyebrow="Portfolio"
            title="Wedding Decoration Gallery"
            copy="A clean cinematic showcase of mandaps, floral stages, seaside setups, and luxury celebration spaces."
          />
          <div className="gallery-grid">
            {GALLERY.map((item, index) => (
              <GalleryCard key={item.src} item={item} index={index} />
            ))}
          </div>
        </section>

        <section id="services" className="site-section services-section">
          <SectionLabel
            eyebrow="What we design"
            title="Premium Wedding and Event Services"
            copy="Every detail is planned to feel elegant in person and beautiful on camera."
          />
          <div className="services-grid">
            {SERVICES.map(([title, copy], index) => (
              <ServiceCard key={title} title={title} copy={copy} index={index} />
            ))}
          </div>
        </section>

        <section id="contact" className="site-section contact-section">
          <div className="contact-copy reveal">
            <span>Start your celebration</span>
            <h2>Tell us the mood, venue, and date. We will shape the wedding around it.</h2>
            <p>
              Share your event details and we will help you plan a refined decor concept with mandap, florals, lights,
              stage, guest zones, and production flow.
            </p>
            <div className="social-actions">
              <a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <ContactForm />
        </section>
      </main>
    </div>
  )
}
