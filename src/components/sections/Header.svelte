<script lang="ts">
  import type { Snippet } from 'svelte'

  import dayjs from 'dayjs'
  import 'dayjs/locale/th'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import numeral from 'numeral'

  import photo from '../../assets/kk_00248.webp?url'
  import { type Lang, useTranslations } from '../../i18n/utils'
  import { pill } from '../../lib/ui'
  import type { Experience, Resume } from '../../types'

  dayjs.extend(relativeTime)

  interface Props {
    lang: Lang
    resume: Resume
    experience: Experience
    /** Astro named slot; hosts the client-side ProfileBadges island. */
    badges?: Snippet
  }

  let { lang, resume, experience, badges }: Props = $props()

  const t = $derived(useTranslations(lang))
  const birthday = $derived(dayjs(experience.birthday))

  const showAge = () => birthday.fromNow(true)
  const showBirthday = () =>
    lang === 'en' ? birthday.locale('en').format('MMMM DD, YYYY') : birthday.add(543, 'y').locale('th').format('DD MMMM YYYY')

  const showNationalId = () => {
    const [, ...id] = /(\d)(\d{4})(\d{5})(\d{2})(\d{1}).*/gi.exec(resume.national_id) ?? []
    return id.join(' ')
  }

  // Monthly income spreads the yearly extra across 12 months on top of the base salary.
  const monthlyIncome = $derived(experience.salary.base + experience.salary.extra / 12)

  const showSalary = () => {
    const { day, hour } = experience.salary
    const perHourTHB = Math.round((monthlyIncome / day / hour) * 100) / 100

    if (lang === 'en') {
      const rate = experience.currencry.sell
      const perHourUSD = Math.round((perHourTHB / rate) * 100) / 100
      return `${t('head.salary.currency')}${perHourUSD} ${t('head.salary.hour')}`
    }
    return `${perHourTHB} ${t('head.salary.currency')}${t('head.salary.hour')}`
  }
  const showSalaryFull = () => `${numeral(monthlyIncome).format('0,0')} THB`
  const showExpect = () => `${numeral(experience.salary.expect).format('0,0')} THB`
</script>

<section id="resume" class="scroll-reveal scroll-mt-4 pt-0 pb-8 md:py-12 print:pt-0 print-text-gray-900">
  <div class="max-w-7xl mx-auto px-4">
    <div class="md:grid md:grid-cols-8 md:gap-8">
      <div class="md:col-span-2">
        <div class="relative block md:flex justify-end print:hidden">
          <span class="absolute top-0 left-0 z-10 h-px w-12 bg-(--text-color-link)" aria-hidden="true"></span>
          <img
            src={photo}
            width="510"
            height="620"
            loading="lazy"
            decoding="async"
            alt={`${resume.fullname} - profile photo`}
            class="w-full h-[60vh] sm:h-64 lg:h-auto object-cover ring-1 ring-gray-900/10 dark:ring-white/10"
          />
        </div>
      </div>
      <div class="md:col-span-6">
        <p class="eyebrow mt-6 md:mt-1 text-(--text-color-link) print:hidden">{resume.job}</p>
        <div class="flex items-center justify-between gap-4 relative">
          <!-- The hero owns the page h1; this h2 keeps the former 36px h1 size from global.css. -->
          <h2 class="flex flex-1 uppercase th-label mt-2 text-[36px]! font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {resume.fullname}
          </h2>
        </div>
        <span class="th-label hidden print:block text-xl font-semibold text-gray-900">{resume.fullname_th}</span>
        {@render badges?.()}
        <p contenteditable="false" class="mt-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm md:text-base">{resume.detail}</p>
        <div class="mt-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-6 print:hidden">{resume.nickname}</strong>
              <strong class="hidden print:block font-medium th-label leading-6 text-gray-900">
                {resume.nickname}&nbsp;{#if lang === 'en'}<span class="text-gray-600">({resume.nickname_th})</span>{/if}
              </strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400">{t('head.nickname')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-6">{showBirthday()}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400"
                >{t('head.age')}&nbsp;{showAge().replace('years', t('head.age.old'))}</small
              >
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 flex flex-wrap gap-x-2 leading-6">
                {#each Object.entries(resume.language) as [name, level], i (name)}
                  <div class={['items-center gap-1', i !== 0 ? 'hidden lg:flex' : 'flex']}>
                    <span class="capitalize">{name}</span>
                    <small class="uppercase text-xs text-gray-500">({level})</small>
                  </div>
                {/each}
              </strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400">{t('head.language')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-6 text-gray-900">{resume.religion}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500">{t('head.religion')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-6 text-gray-900">{resume.national}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500">{t('head.nationality')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-6 text-gray-900">{showNationalId()}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500">{t('head.national_id')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-6">{resume.location}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400">{t('head.location')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-6 print:hidden">{showSalary()}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400 print:hidden">{t('head.income')}</small>
              <strong class="hidden print:block font-medium th-label leading-6 text-gray-900">{showSalaryFull()}</strong>
              <small class="eyebrow hidden print:block mt-1 text-[10px] text-gray-500">{t('head.salary')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-6 text-gray-900">{showExpect()}</strong>
              <small class="eyebrow mt-1 text-[10px] text-gray-500">{t('head.salary.expect')}</small>
            </div>
            <div class="flex flex-col print:hidden">
              <div class="flex h-6 items-center">
                {#if experience.interview}
                  <span class={pill('success', 'sm')}>
                    <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
                    {t('head.availability.yes')}
                  </span>
                {:else}
                  <span class={pill('danger', 'sm')}>
                    <span class="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true"></span>
                    {t('head.availability.no')}
                  </span>
                {/if}
              </div>
              <small class="eyebrow mt-1 text-[10px] text-gray-500 dark:text-gray-400">{t('head.availability')}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
