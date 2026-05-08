import { useState } from 'react'

export default function Contact({ number }) {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <section id="contact" className="content-section contact-section">
      <div className="section-marker reveal-item">
        <span>{number}</span>
        <strong>Book</strong>
      </div>

      <div className="contact-layout">
        <div className="section-copy narrow">
          <p className="eyebrow reveal-line">Contact / book</p>
          <h2 className="reveal-line">Bring DJ NEXUS into the room.</h2>
          <p className="body-large reveal-line">
            For clubs, private events, festival support slots, and brand nights, send the core
            details and the booking desk will respond with routing, technical needs, and rate
            availability.
          </p>
        </div>

        <form className="booking-form reveal-item" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Event date
            <input name="eventDate" type="date" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" required />
          </label>
          <button type="submit">Send Booking Request</button>
          {sent && <p className="form-note">Booking request received. Expect a reply within 24 hours.</p>}
        </form>
      </div>
    </section>
  )
}
