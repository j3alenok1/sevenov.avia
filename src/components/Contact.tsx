import { useState, type FormEvent } from 'react'
import { siteConfig } from '../config/site'
import { api } from '../api/client'
import { ScrollReveal } from './ScrollReveal'
import './Contact.css'

export function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      await api.submitLead(form)
      setStatus('success')
      setForm({ name: '', phone: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось отправить заявку')
    }
  }

  const openWhatsApp = () => {
    const text = `Здравствуйте! Интересует авиаобработка полей.`
    window.open(
      `https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__layout">
          <ScrollReveal className="contact__info">
            <span className="section-label">Контакты</span>
            <h2 className="section-title">Свяжитесь с нами</h2>
            <p className="contact__desc">
              Ответим в течение 30 минут. Рассчитаем стоимость обработки по площади, культуре и препарату.
            </p>

            <div className="contact__items">
              <a href={`tel:+${siteConfig.contacts.phoneRaw}`} className="contact__item">
                <div className="contact__item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <span>Телефон</span>
                  <strong>{siteConfig.contacts.phone}</strong>
                </div>
              </a>

              <a href={`mailto:${siteConfig.contacts.email}`} className="contact__item">
                <div className="contact__item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{siteConfig.contacts.email}</strong>
                </div>
              </a>

              <div className="contact__item">
                <div className="contact__item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <span>Режим работы</span>
                  <strong>{siteConfig.contacts.workHours}</strong>
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span>Адрес</span>
                  <strong>{siteConfig.contacts.address}</strong>
                </div>
              </div>
            </div>

            <div className="contact__socials">
              <button type="button" onClick={openWhatsApp} className="contact__social contact__social--wa">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>
              <a
                href={siteConfig.contacts.instagram}
                className="contact__social contact__social--ig"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                {siteConfig.contacts.instagramHandle}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal className="contact__form-wrap" delay={150}>
            <form className="contact__form card" onSubmit={handleSubmit}>
              <h3>Оставить заявку</h3>
              <p>Заполните форму — заявка сохранится, мы свяжемся с вами</p>

              {status === 'success' && (
                <p className="contact__success">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
              )}
              {status === 'error' && (
                <p className="contact__error">{errorMsg}</p>
              )}

              <label className="contact__field">
                <span>Ваше имя</span>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === 'loading'}
                />
              </label>

              <label className="contact__field">
                <span>Телефон</span>
                <input
                  type="tel"
                  required
                  placeholder="+7 (702) 240-06-00"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={status === 'loading'}
                />
              </label>

              <label className="contact__field">
                <span>Сообщение</span>
                <textarea
                  rows={4}
                  placeholder="Площадь в га, культура, препарат, регион, желаемые даты..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={status === 'loading'}
                />
              </label>

              <button type="submit" className="btn btn-primary contact__submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
