import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import './Pricing.css'

export function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Расценки</span>
          <h2 className="section-title">Прозрачные цены</h2>
          <p className="section-subtitle">
            Стоимость зависит от площади, культуры и типа препарата.
            Точный расчёт — за 2 часа после заявки.
          </p>
        </ScrollReveal>

        <div className="pricing__grid">
          {siteConfig.pricing.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 80}>
              <article className={`pricing__card card ${plan.popular ? 'pricing__card--popular' : ''}`}>
                {plan.popular && <span className="pricing__badge">Популярно</span>}
                <h3 className="pricing__name">{plan.name}</h3>
                <div className="pricing__price">
                  <strong>{plan.price}</strong>
                  <span>{plan.unit}</span>
                </div>
                <ul className="pricing__features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8l3 3 7-7" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Хочу узнать стоимость: ${plan.name}`)}`}
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} pricing__btn`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Запросить расчёт
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="pricing__disclaimer">
            * Цены указаны ориентировочно за 1 гектар и зависят от культуры, препарата, площади и региона.
            Минимальный заказ — от 100 га. Для крупных хозяйств — сезонный договор со скидкой.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
