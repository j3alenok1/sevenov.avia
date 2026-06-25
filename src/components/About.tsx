import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import './About.css'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__grid">
          <ScrollReveal className="about__text">
            <span className="section-label">О компании</span>
            <h2 className="section-title">
              Надёжная обработка<br />полей с воздуха
            </h2>
            <p className="about__desc">
              <strong>{siteConfig.pilot.name}</strong> — пилот с опытом
              более {siteConfig.pilot.experience} в сельскохозяйственной авиации. Собственный парк из {siteConfig.aircraft.count} самолётов
              АН-2 с распылительным оборудованием, штат специалистов и база из {siteConfig.pilot.clients} хозяйств.
            </p>
            <p className="about__desc">
              Выполняем авиаобработку полей по всему Казахстану — внесение гербицидов, инсектицидов,
              ядов, химикатов и удобрений. Быстро, равномерно и в оптимальные сроки для вашей культуры.
            </p>

            <div className="about__highlights">
              {siteConfig.advantages.slice(0, 3).map((item) => (
                <div key={item.title} className="about__highlight">
                  <div className="about__highlight-icon">✦</div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="about__visual" delay={150}>
            <div className="about__card-stack">
              <div className="about__card about__card--main">
                <div className="about__card-photo">
                  <img
                    src={siteConfig.images.about}
                    alt="АН-2 на поле — Константин Семёнов"
                    loading="lazy"
                  />
                </div>
                <div className="about__card-info">
                  <span className="about__card-label">Главный пилот</span>
                  <strong>{siteConfig.pilot.name}</strong>
                  <span>{siteConfig.pilot.experience} · {siteConfig.pilot.treatedArea}</span>
                </div>
              </div>

              <div className="about__metrics">
                <div className="about__metric">
                  <strong>{siteConfig.pilot.experience}</strong>
                  <span>в небе</span>
                </div>
                <div className="about__metric">
                  <strong>{siteConfig.pilot.clients}</strong>
                  <span>хозяйств</span>
                </div>
                <div className="about__metric">
                  <strong>24/7</strong>
                  <span>на связи</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={200}>
          <div className="about__regions">
            <p className="about__regions-title">Культуры, с которыми работаем:</p>
            <div className="about__regions-list">
              {siteConfig.crops.map((crop) => (
                <span key={crop} className="about__region-tag about__region-tag--crop">{crop}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="about__regions about__regions--mt">
            <p className="about__regions-title">Работаем по всем регионам:</p>
            <div className="about__regions-list">
              {siteConfig.regions.map((city) => (
                <span key={city} className="about__region-tag">{city}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
