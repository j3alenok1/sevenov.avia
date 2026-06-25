import { siteConfig } from '../config/site'
import './Footer.css'

const footerLinks = [
  { href: '#about', label: 'О нас' },
  { href: '#fleet', label: 'Самолёты' },
  { href: '#services', label: 'Услуги' },
  { href: '#pricing', label: 'Расценки' },
  { href: '#contact', label: 'Контакты' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <strong>{siteConfig.name}</strong>
          <p>{siteConfig.tagline}</p>
        </div>

        <nav className="footer__nav">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="footer__contacts">
          <a href={`tel:+${siteConfig.contacts.phoneRaw}`}>{siteConfig.contacts.phone}</a>
          <a href={siteConfig.contacts.instagram} target="_blank" rel="noopener noreferrer">
            {siteConfig.contacts.instagramHandle}
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {year} {siteConfig.name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
