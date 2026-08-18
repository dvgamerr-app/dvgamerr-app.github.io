import coding from '../i18n/coding.json'
import experience from '../i18n/experience.json'
import resumeEn from '../i18n/resume.en.json'
import resumeTh from '../i18n/resume.th.json'

const workDetails = {
  en: import.meta.glob('../components/work/en/*.md', { eager: true, import: 'default', query: '?raw' }),
  th: import.meta.glob('../components/work/th/*.md', { eager: true, import: 'default', query: '?raw' }),
}

const labels = {
  en: {
    coding: 'Coding summary',
    commits: 'Commits',
    contact: 'Contact',
    education: 'Education',
    languages: 'Top coding languages',
    lines: 'Lines of code',
    location: 'Location',
    openSource: 'open source',
    present: 'Present',
    projects: 'Projects',
    skills: 'Skills',
    updated: 'Updated',
    work: 'Work experience',
  },
  th: {
    coding: 'สรุปสถิติการเขียนโค้ด',
    commits: 'จำนวนคอมมิต',
    contact: 'ช่องทางติดต่อ',
    education: 'การศึกษา',
    languages: 'ภาษาโปรแกรมที่ใช้งานมากที่สุด',
    lines: 'จำนวนบรรทัดโค้ด',
    location: 'ที่อยู่',
    openSource: 'โอเพนซอร์ส',
    present: 'ปัจจุบัน',
    projects: 'โปรเจกต์',
    skills: 'ทักษะ',
    updated: 'อัปเดต',
    work: 'ประสบการณ์ทำงาน',
  },
}

const skillLabels = {
  en: { coding: 'Programming', os: 'Operating systems and cloud', sql: 'Databases', tools: 'Tools' },
  th: { coding: 'การเขียนโปรแกรม', os: 'ระบบปฏิบัติการและคลาวด์', sql: 'ฐานข้อมูล', tools: 'เครื่องมือ' },
}

const publicContactLabels = new Set(['devto', 'email', 'github', 'wakatime', 'website'])

export function renderResumeMarkdown(lang = 'en') {
  const locale = lang === 'th' ? 'th' : 'en'
  const resume = locale === 'th' ? resumeTh : resumeEn
  const text = labels[locale]
  const topLanguages = experience.coding.top5.map(
    ({ caption, commits, loc }) => `- ${caption}: ${formatNumber(commits)} commits, ${formatNumber(loc)} lines`,
  )

  const lines = [
    `# ${resume.fullname} — ${resume.job}`,
    '',
    `> ${cleanText(resume.detail)}`,
    '',
    `- ${text.location}: ${resume.location}`,
    `- Website: https://dvgamerr.app${locale === 'th' ? '/th/' : '/'}`,
    '',
    `## ${text.contact}`,
    '',
    ...renderContacts(),
    '',
    `## ${text.projects}`,
    '',
    ...renderProjects(),
    '',
    `## ${text.coding}`,
    '',
    `- ${text.updated}: ${String(coding.updated).slice(0, 10)}`,
    `- ${text.lines}: ${formatNumber(coding.loc)}`,
    `- ${text.projects}: ${formatNumber(coding.total)} (${formatNumber(coding.public)} ${text.openSource})`,
    `- ${text.commits}: ${formatNumber(coding.commits)}`,
    `- WakaTime: ${coding.wakatime}`,
    '',
    `### ${text.languages}`,
    '',
    ...topLanguages,
    '',
    `## ${text.skills}`,
    '',
    ...renderSkills(locale),
    `## ${text.education}`,
    '',
    ...renderEducation(resume),
    '',
    `## ${text.work}`,
    '',
    ...renderWork(locale, resume, text.present),
  ]

  return `${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim()
}

function findWorkDetails(lang, filename) {
  const entry = Object.entries(workDetails[lang]).find(([path]) => path.endsWith(`/${filename}`))
  return entry ? String(entry[1]).trim() : ''
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US')
}

function formatPeriod(begin, quit, present) {
  const start = String(begin).slice(0, 7)
  const end = quit ? String(quit).slice(0, 7) : present
  return `${start} – ${end}`
}

function renderContacts() {
  const unique = new Set()

  return experience.contact
    .filter(({ label, url }) => publicContactLabels.has(label) && !url.startsWith('tel:'))
    .filter(({ url }) => {
      if (unique.has(url)) return false
      unique.add(url)
      return true
    })
    .map(({ label, text, url }) => `- [${label}: ${text}](${url})`)
}

function renderEducation(resume) {
  return resume.education.map(({ branch, location, major, range }) => `- **${range} — ${major}**, ${location}: ${branch}`)
}

function renderProjects() {
  return experience.repos.map(({ description, name, stargazers_count: stars, svn_url: url }) => {
    const details = cleanText(description)
    const popularity = stars ? ` (${formatNumber(stars)} GitHub ${stars === 1 ? 'star' : 'stars'})` : ''
    return `- [${name}](${url})${details ? `: ${details}` : ''}${popularity}`
  })
}

function renderSkills(lang) {
  return Object.entries(experience.skill).flatMap(([group, skills]) => {
    const visibleSkills = skills.filter((skill) => skill.toLowerCase() !== 'hack').sort((a, b) => a.localeCompare(b))
    if (!visibleSkills.length) return []
    return [`### ${skillLabels[lang][group] || group}`, '', visibleSkills.join(', '), '']
  })
}

function renderWork(lang, resume, present) {
  return resume.work.flatMap((employer) => {
    if (!employer.work || !Array.isArray(employer.level)) return []

    return [
      `### ${employer.work}`,
      '',
      ...employer.level.flatMap((role) => {
        const details = findWorkDetails(lang, role.file)
        return [`#### ${role.job} (${formatPeriod(role.begin, role.quit, present)})`, '', details, '']
      }),
    ]
  })
}
