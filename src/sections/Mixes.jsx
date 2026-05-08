const mixes = [
  { title: 'Afterburn Radio 042', duration: '58:14', mood: 'Peak-time techno and orange-lit warehouse pressure' },
  { title: 'Neon Warehouse', duration: '44:30', mood: 'Bass house cuts with chrome synth stabs' },
  { title: 'Midnight Signal', duration: '62:08', mood: 'Melodic techno, deep vocals, and slow-burn tension' },
  { title: 'Coastal Pressure', duration: '39:52', mood: 'Afro house percussion for warm rooftop hours' },
  { title: 'Chrome Ritual', duration: '51:26', mood: 'Future garage textures into late club breaks' },
  { title: 'Sunrise Afterhours', duration: '47:10', mood: 'Dreamy closers and glowing final-track energy' },
]

export default function Mixes({ number }) {
  return (
    <section id="mixes" className="content-section mixes-section">
      <div className="section-marker reveal-item">
        <span>{number}</span>
        <strong>Mixes</strong>
      </div>

      <div className="mixes-heading">
        <p className="eyebrow reveal-line">Current rotation</p>
        <h2 className="reveal-line">Six transmissions for dark rooms and fast lights.</h2>
      </div>

      <div className="mixes-rail" aria-label="DJ NEXUS mix tracks">
        <div className="mixes-track">
          {mixes.map((mix, index) => (
            <article className="mix-card reveal-item" key={mix.title}>
              <span className="mix-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{mix.title}</h3>
                <p>{mix.mood}</p>
              </div>
              <footer>
                <span>{mix.duration}</span>
                <button type="button" aria-label={`Play ${mix.title}`}>
                  <span className="play-icon" aria-hidden="true" />
                  Play
                </button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
