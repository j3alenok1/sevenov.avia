import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import './Fleet.css'

export function Fleet() {
  const { aircraft } = siteConfig

  return (
    <section className="section fleet" id="fleet">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Парк</span>
          <h2 className="section-title">{aircraft.fullName}</h2>
          <p className="section-subtitle">
            Проверенная машина для низколетного опрыскивания — взлетает с полевых площадок
            рядом с посевами. В нашем распоряжении {aircraft.count} борта с распылительным оборудованием.
          </p>
        </ScrollReveal>

        <div className="fleet__layout">
          <ScrollReveal className="fleet__showcase" delay={100}>
            <div className="fleet__plane-visual">
              <img
                src={siteConfig.images.fleet}
                alt="АН-2 — сельскохозяйственная авиация"
                className="fleet__photo"
                loading="lazy"
              />
              <div className="fleet__model-badge">{aircraft.model}</div>
            </div>
          </ScrollReveal>

          <div className="fleet__specs">
            {aircraft.specs.map((spec, i) => (
              <ScrollReveal key={spec.label} delay={i * 60}>
                <div className="fleet__spec card">
                  <span className="fleet__spec-label">{spec.label}</span>
                  <strong className="fleet__spec-value">{spec.value}</strong>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={200}>
          <div className="fleet__note">
            <p>
              АН-2 — основа сельхозавиации Казахстана. Низкая скорость полёта обеспечивает
              равномерное нанесение препарата, а возможность взлёта с грунта позволяет
              базироваться прямо у обрабатываемого поля.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
