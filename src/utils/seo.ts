import photo from '../assets/kk_00248.webp'
import experience from '../i18n/experience.json'
import resumeEn from '../i18n/resume.en.json'
import type { Lang } from '../i18n/utils'

export const SITE = 'https://dvgamerr.app'

export const pageUrl = (lang: Lang) => `${SITE}${lang === 'th' ? '/th/' : '/'}`

const PERSON_ID = `${SITE}/#person`
const WEBSITE_ID = `${SITE}/#website`

// Public profiles of the same person; `sameAs` and `rel="me"` let search engines merge them into one entity.
export const profileLinks = () => {
  const urls = [...experience.contact.map((contact) => contact.url), ...experience.social.map((social) => social.link)]
  const isProfile = (url: string) => /^https:\/\/(github\.com|www\.linkedin\.com|wakatime\.com|dev\.to)\//.test(url)
  const key = (url: string) => url.replace('wakatime.com/@', 'wakatime.com/').replace(/\/$/, '')
  return [...new Map(urls.filter(isProfile).map((url) => [key(url), url])).values()]
}

interface PageMeta {
  title: string
  description: string
}

// Person facts always come from the English resume so both language pages describe the same entity.
export function buildStructuredData(lang: Lang, { title, description }: PageMeta) {
  const url = pageUrl(lang)
  const [givenName, ...familyName] = resumeEn.fullname.split(' ')
  const email = experience.contact.find((contact) => contact.url.startsWith('mailto:'))?.url.replace('mailto:', '')
  const codingSkills = experience.skill.coding.filter((skill) => skill.toLowerCase() !== 'hack')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': WEBSITE_ID,
        '@type': 'WebSite',
        alternateName: ['dvgamerr', resumeEn.fullname],
        inLanguage: ['en-US', 'th-TH'],
        name: 'dvgamerr.app',
        publisher: { '@id': PERSON_ID },
        url: `${SITE}/`,
      },
      {
        '@id': `${url}#profile`,
        '@type': 'ProfilePage',
        dateModified: new Date().toISOString(),
        description,
        inLanguage: lang === 'th' ? 'th-TH' : 'en-US',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
        name: title,
        url,
      },
      {
        '@id': PERSON_ID,
        '@type': 'Person',
        address: { '@type': 'PostalAddress', addressCountry: 'TH', addressLocality: 'Bangkok' },
        alternateName: [resumeEn.fullname_th, resumeEn.nickname, resumeEn.nickname_th, 'dvgamerr', 'Kananek T.'],
        alumniOf: resumeEn.education
          .filter((education) => /university|college/i.test(education.location))
          .map((education) => ({ '@type': 'EducationalOrganization', name: education.location.split(',')[0] })),
        description: resumeEn.detail,
        email,
        familyName: familyName.join(' '),
        givenName,
        image: new URL(photo.src, SITE).href,
        jobTitle: resumeEn.job,
        knowsAbout: [...resumeEn.hero.words, ...codingSkills],
        knowsLanguage: ['th', 'en'],
        name: resumeEn.fullname,
        nationality: { '@type': 'Country', name: 'Thailand' },
        sameAs: profileLinks(),
        url: `${SITE}/`,
        worksFor: { '@type': 'Organization', name: resumeEn.seo.worksFor },
      },
    ],
  }
}
