import { siteConfig } from '../config/site'
import { ScrollReveal } from './ScrollReveal'
import './Team.css'

export function Team() {
  return (
    <section className="section team" id="team">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Команда</span>
          <h2 className="section-title">Наш штат</h2>
          <p className="section-subtitle">
            Пилоты, авиахимики и механики — команда, которая знает поля Казахстана
          </p>
        </ScrollReveal>

        <div className="team__grid">
          {siteConfig.team.map((member, i) => (
            <ScrollReveal key={member.role} delay={i * 80}>
              <div className="team__card card">
                <div className="team__avatar">
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle cx="24" cy="18" r="10" fill="rgba(74,158,255,0.2)" stroke="#4a9eff" strokeWidth="1" />
                    <path d="M8 44c0-8 7-14 16-14s16 6 16 14" fill="rgba(74,158,255,0.1)" stroke="#4a9eff" strokeWidth="1" />
                  </svg>
                </div>
                <span className="team__role">{member.role}</span>
                <strong className="team__name">{member.name}</strong>
                <span className="team__exp">{member.exp}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
