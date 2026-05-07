export type Skill = {
  name: string
  level: number // 0-100
}

export type SkillCategory = {
  id: string
  title: string
  items: Skill[]
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'React', level: 84 },
      { name: 'Tailwind', level: 86 },
      { name: 'JavaScript', level: 82 },
      { name: 'HTML/CSS', level: 88 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'PHP', level: 80 },
      { name: 'Node.js', level: 72 },
      { name: 'MySQL', level: 78 },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: [
      { name: 'GitHub', level: 82 },
      { name: 'XAMPP', level: 86 },
      { name: 'VS Code', level: 85 },
      { name: 'Cursor AI', level: 76 },
    ],
  },
]

