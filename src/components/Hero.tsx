import { siteConfig } from '../config/site'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden="true">
        <img
          src={siteConfig.images.hero}
          alt=""
          className="hero__bg-img"
          fetchPriority="high"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Работаем по всему Казахстану
        </div>

        <h1 className="hero__title">
          Авиаобработка полей<br />
          <span className="hero__title-accent">на АН-2</span>
        </h1>

        <p className="hero__subtitle">
          {siteConfig.description}
        </p>

        <div className="hero__stats">
          <div className="hero__stat">
            <strong>{siteConfig.pilot.experience}</strong>
            <span>опыта</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>{siteConfig.aircraft.count}</strong>
            <span>самолёта АН-2</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>{siteConfig.pilot.treatedArea}</strong>
            <span>обработано</span>
          </div>
        </div>

        <div className="hero__actions">
          <a href="#contact" className="btn btn-primary">
            Заказать обработку
          </a>
          <a
            href={`https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent('Здравствуйте! Интересует авиаобработка полей.')}`}
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать в WhatsApp
          </a>
        </div>
      </div>

      <div className="hero__scroll">
        <a href="#about" aria-label="Прокрутить вниз">
          <span />
        </a>
      </div>
    </section>
  )
}
