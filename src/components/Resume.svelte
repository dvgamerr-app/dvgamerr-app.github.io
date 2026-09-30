<script lang="ts">
  import type { Lang } from '../i18n/utils'
  import type { Experience, Resume } from '../types'
  import CodingAssisted from './sections/CodingAssisted.svelte'
  import CodingDaytime from './sections/CodingDaytime.svelte'
  import CodingHistory from './sections/CodingHistory.svelte'
  import CodingRepos from './sections/CodingRepos.svelte'
  import CodingWorkType from './sections/CodingWorkType.svelte'
  import Contact from './sections/Contact.svelte'
  import Education from './sections/Education.svelte'
  import Skill from './sections/Skill.svelte'

  interface Props {
    lang: Lang
    resume: Resume
    experience: Experience
  }

  let { lang, resume, experience }: Props = $props()
</script>

<Contact {lang} {experience} />
<CodingRepos {lang} />
<CodingDaytime {lang} />
<CodingHistory {lang} />
<CodingWorkType {lang} />
<CodingAssisted {lang} />
<Skill {lang} {experience} />
<Education {lang} {resume} />
