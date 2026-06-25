import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import { ServiceIcon } from './ServiceIcon'
import './Services.css'

export function Services() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Услуги</span>
          <h2 className="section-title">Виды работ</h2>
          <p className="section-subtitle">
            Полный спектр авиаобработки для агрохолдингов, фермерских хозяйств и частных землевладельцев
          </p>
        </ScrollReveal>

        <div className="services__grid">
          {siteConfig.services.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 80}>
              <article className="services__card card">
                <div className="services__icon">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="services__title">{service.title}</h3>
                <p className="services__desc">{service.description}</p>
                <a
                  href={`https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует услуга: ${service.title}`)}`}
                  className="services__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Узнать стоимость →
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
