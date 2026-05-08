import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  FolderKanban,
  Home,
  Mail,
  MessageSquareQuote,
  Sparkles,
  User,
} from 'lucide-react'

export type NavItem = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: Home },
  { id: 'about', label: 'About', href: '#about', icon: User },
  { id: 'skills', label: 'Skills', href: '#skills', icon: Sparkles },
  { id: 'projects', label: 'Projects', href: '#projects', icon: FolderKanban },
  { id: 'experience', label: 'Experience', href: '#experience', icon: BriefcaseBusiness },
  { id: 'testimonials', label: 'Testimonials', href: '#testimonials', icon: MessageSquareQuote },
  { id: 'certificates', label: 'Certificates', href: '#certificates', icon: BadgeCheck },
  { id: 'contact', label: 'Contact', href: '#contact', icon: Mail },
]

