const events = [
  { date: 'Jun 12, 2026', city: 'Brooklyn, NY', venue: 'Prism Hall' },
  { date: 'Jul 04, 2026', city: 'Los Angeles, CA', venue: 'Echo Yard' },
  { date: 'Aug 22, 2026', city: 'Chicago, IL', venue: 'Substation 27' },
  { date: 'Sep 18, 2026', city: 'Miami, FL', venue: 'Harbor Room' },
  { date: 'Oct 09, 2026', city: 'Austin, TX', venue: 'The Voltage Room' },
]

export default function Events({ number }) {
  return (
    <section id="events" className="content-section events-section">
      <div className="section-marker reveal-item">
        <span>{number}</span>
        <strong>Events</strong>
      </div>

      <div className="section-copy wide">
        <p className="eyebrow reveal-line">Upcoming shows</p>
        <h2 className="reveal-line">Next rooms on the circuit.</h2>

        <div className="event-list" aria-label="Upcoming DJ NEXUS events">
          {events.map((event) => (
            <article className="event-row reveal-item" key={`${event.date}-${event.city}`}>
              <time>{event.date}</time>
              <div>
                <h3>{event.city}</h3>
                <p>{event.venue}</p>
              </div>
              <a href="#contact" aria-label={`Request tickets for ${event.city}`}>
                Tickets
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
