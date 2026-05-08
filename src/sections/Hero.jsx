export default function Hero({ number }) {
  return (
    <section id="hero" className="content-section hero-section">
      <div className="section-marker reveal-item">
        <span>{number}</span>
        <strong>Hero</strong>
      </div>

      <div className="hero-lockup">
        <p className="eyebrow reveal-line">Live from the signal room</p>
        <h1 className="reveal-line">DJ NEXUS</h1>
        <p className="hero-subtitle reveal-line">Enter The Sound</p>
        <p className="hero-copy reveal-line">
          A pressure-built fusion of techno, bass, afro house, and late-night club voltage.
        </p>
      </div>
    </section>
  )
}
