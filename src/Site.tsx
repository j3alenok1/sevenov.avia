import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Fleet } from './components/Fleet'
import { Services } from './components/Services'
import { Pricing } from './components/Pricing'
import { Advantages } from './components/Advantages'
import { Team } from './components/Team'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

export function Site() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Fleet />
        <Services />
        <Pricing />
        <Advantages />
        <Team />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
