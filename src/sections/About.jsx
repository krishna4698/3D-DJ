const tags = ['Melodic Techno', 'Afro House', 'Bass House', 'Future Garage', 'Peak-Time Edits']

export default function About({ number }) {
  return (
    <section id="about" className="content-section about-section">
      <div className="section-marker reveal-item">
        <span>{number}</span>
        <strong>About</strong>
      </div>

      <div className="section-copy narrow">
        <p className="eyebrow reveal-line">Transmission profile</p>
        <h2 className="reveal-line">Nine years active. One room-shaking signal.</h2>
        <p className="body-large reveal-line">
          DJ NEXUS is the stage identity of Arin Vale, a club selector and producer known for
          cinematic builds, clean low-end pressure, and sets that move from hypnotic grooves into
          full-spectrum festival energy. Since 2017, NEXUS has shaped midnight rooms across North
          America with a sound designed for dancers who want melody, grit, and lift in the same
          breath.
        </p>

        <div className="stats-grid reveal-item" aria-label="DJ NEXUS career stats">
          <div>
            <span>2017</span>
            <strong>Active Since</strong>
          </div>
          <div>
            <span>640+</span>
            <strong>Live Sets</strong>
          </div>
          <div>
            <span>31</span>
            <strong>Cities Played</strong>
          </div>
        </div>

        <div className="tag-cloud reveal-item" aria-label="DJ NEXUS genres">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
