export type ProjectTag =
  | 'Full‑Stack'
  | 'Dashboard'
  | 'Management'
  | 'Analytics'
  | 'POS'
  | 'Government'

export type Project = {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  coverImage: string
  screenshots: string[]
  tags: ProjectTag[]
  tech: string[]
  features: string[]
  github?: string
  demo?: string
  featured: boolean
  status: 'Completed' | 'In Progress' | 'Planned'
  year: string
}

export const PROJECT_TAGS: (ProjectTag | 'All')[] = [
  'All',
  'Full‑Stack',
  'Dashboard',
  'Management',
  'Analytics',
  'POS',
  'Government',
]

export const PROJECTS: Project[] = [
  {
    id: 'sowguardian',
    slug: 'sowguardian',
    title: 'SowGuardian',
    description:
      'A web-based sow farm management system with monitoring, scheduling, reports, and intervention tracking.',
    longDescription:
      'SowGuardian is a management platform designed for day-to-day farm operations. It focuses on visibility and consistency: analytics, pig monitoring, schedules, and intervention records with automated reminders.',
    category: 'Full Stack',
    coverImage: '/projects/sowguardian.svg',
    screenshots: ['/projects/sowguardian.svg', '/projects/city-hall-feedback.svg', '/projects/5js-grill-pos.svg'],
    tags: ['Full‑Stack', 'Dashboard', 'Management', 'Analytics'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'XAMPP'],
    features: [
      'Dashboard analytics',
      'Pig monitoring',
      'Scheduling system',
      'Reports generation',
      'SMS reminders',
    ],
    github: 'https://github.com/',
    demo: 'https://example.com',
    featured: true,
    status: 'Completed',
    year: '2026',
  },
  {
    id: 'city-hall-feedback',
    slug: 'city-hall-feedback',
    title: 'City Hall Feedback System',
    description:
      'A local government feedback and satisfaction monitoring web platform.',
    longDescription:
      'A feedback and survey system built for streamlined public sentiment reporting. It includes admin moderation, dynamic charting, and export-ready reports for decision-making.',
    category: 'Full Stack',
    coverImage: '/projects/city-hall-feedback.svg',
    screenshots: ['/projects/city-hall-feedback.svg', '/projects/sowguardian.svg', '/projects/5js-grill-pos.svg'],
    tags: ['Full‑Stack', 'Government', 'Analytics', 'Dashboard'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'Charting', 'XAMPP'],
    features: ['Survey analytics', 'Feedback reports', 'Dynamic charts', 'Admin dashboard'],
    github: 'https://github.com/',
    demo: 'https://example.com',
    featured: true,
    status: 'Completed',
    year: '2026',
  },
  {
    id: '5js-grill-pos',
    slug: '5js-grill-pos',
    title: "5J’s Grill POS",
    description: 'A restaurant point-of-sale system for order management and sales tracking.',
    longDescription:
      'A fast, cashier-friendly POS interface with reliable order flow and reporting. Built to reduce errors, speed up service, and provide management with clear sales visibility.',
    category: 'Full Stack',
    coverImage: '/projects/5js-grill-pos.svg',
    screenshots: ['/projects/5js-grill-pos.svg', '/projects/sowguardian.svg', '/projects/city-hall-feedback.svg'],
    tags: ['POS', 'Management', 'Dashboard'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'Thermal Print', 'XAMPP'],
    features: ['POS interface', 'Order management', 'Sales reports', 'Receipt printing'],
    github: 'https://github.com/',
    demo: 'https://example.com',
    featured: true,
    status: 'Completed',
    year: '2026',
  },
]

