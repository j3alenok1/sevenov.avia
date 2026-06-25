import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import './Advantages.css'

export function Advantages() {
  return (
    <section className="section advantages" id="advantages">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Преимущества</span>
          <h2 className="section-title">Почему выбирают нас</h2>
        </ScrollReveal>

        <div className="advantages__grid">
          {siteConfig.advantages.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 70}>
              <div className="advantages__item card">
                <span className="advantages__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
