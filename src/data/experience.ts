export type ExperienceItem = {
  id: string
  role: string
  org: string
  team: string
  period: string
  bullets: string[]
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'malaybalay-internship',
    role: 'Intern',
    org: 'Malaybalay City Hall',
    team: 'MIS Department',
    period: 'Internship',
    bullets: [
      'Assisted in web systems and office digitization efforts.',
      'Worked on feedback systems, admin workflows, and basic analytics.',
      'Supported document processing and streamlining internal requests.',
    ],
  },
]

