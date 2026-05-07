import { AboutSection } from '../components/sections/AboutSection'
import { CertificatesSection } from '../components/sections/CertificatesSection'
import { ContactSection } from '../components/sections/ContactSection'
import { CurrentlyWorkingSection } from '../components/sections/CurrentlyWorkingSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { HeroSection } from '../components/sections/HeroSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { SITE } from '../constants/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle(`${SITE.name} (${SITE.nickname}) — Portfolio`)

  return (
    <div className="scrollbar-premium">
      <HeroSection />
      <AboutSection />
      <CurrentlyWorkingSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <TestimonialsSection />
      <CertificatesSection />
      <ContactSection />
    </div>
  )
}

