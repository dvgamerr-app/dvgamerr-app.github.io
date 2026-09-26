<script lang="ts">
  import type { Snippet } from 'svelte'

  import dayjs from 'dayjs'
  import 'dayjs/locale/th'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import numeral from 'numeral'

  import photo from '../../assets/kk_00248.webp?url'
  import { type Lang, useTranslations } from '../../i18n/utils'
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
        <div class="block md:flex justify-end print:hidden">
          <img
            src={photo}
            width="510"
            height="620"
            loading="eager"
            decoding="async"
            alt={`${resume.fullname} - profile photo`}
            class="w-full h-[60vh] sm:h-64 lg:h-auto object-cover rounded-none md:rounded-lg shadow-none md:shadow-md"
          />
        </div>
      </div>
      <div class="md:col-span-6">
        <div class="flex items-center justify-between gap-4 relative">
          <h1 class="flex flex-1 uppercase th-label mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {resume.fullname}
          </h1>
        </div>
        <span class="th-label block mt-1 text-lg font-medium text-gray-600 dark:text-gray-300 print:hidden">{resume.job}</span>
        <span class="th-label hidden print:block text-xl font-semibold text-gray-900">{resume.fullname_th}</span>
        {@render badges?.()}
        <p contenteditable="false" class="mt-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm md:text-base">{resume.detail}</p>
        <div class="mt-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-[0.8] print:hidden">{resume.nickname}</strong>
              <strong class="hidden print:block font-medium th-label leading-[0.8] text-gray-900">
                {resume.nickname}&nbsp;{#if lang === 'en'}<span class="text-gray-600">({resume.nickname_th})</span>{/if}
              </strong>
              <small class="uppercase mt-0.5 text-gray-500 dark:text-gray-400">{t('head.nickname')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-[0.8]">{showBirthday()}</strong>
              <small class="uppercase mt-0.5 text-gray-500 dark:text-gray-400"
                >{t('head.age')}&nbsp;{showAge().replace('years', t('head.age.old'))}</small
              >
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 flex flex-wrap gap-x-2">
                {#each Object.entries(resume.language) as [name, level], i (name)}
                  <div class={['flex items-center gap-1', i !== 0 && 'lg:block hidden']}>
                    <span class="capitalize leading-[0.8]">{name}</span>
                    <small class="uppercase text-xs text-gray-500 leading-[0.8]">({level})</small>
                  </div>
                {/each}
              </strong>
              <small class="uppercase mt-0.5 text-gray-500 dark:text-gray-400">{t('head.language')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-[0.8] text-gray-900">{resume.religion}</strong>
              <small class="uppercase mt-0.5 text-gray-500">{t('head.religion')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-[0.8] text-gray-900">{resume.national}</strong>
              <small class="uppercase mt-0.5 text-gray-500">{t('head.nationality')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-[0.8] text-gray-900">{showNationalId()}</strong>
              <small class="uppercase mt-0.5 text-gray-500">{t('head.national_id')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-[0.8]">{resume.location}</strong>
              <small class="uppercase mt-0.5 text-gray-500 dark:text-gray-400">{t('head.location')}</small>
            </div>
            <div class="flex flex-col justify-start">
              <strong class="font-medium th-label text-gray-900 dark:text-gray-100 leading-[0.8] print:hidden">{showSalary()}</strong>
              <small class="uppercase mt-0.5 text-gray-500 dark:text-gray-400 print:hidden">{t('head.income')}</small>
              <strong class="hidden print:block font-medium th-label leading-[0.8] text-gray-900">{showSalaryFull()}</strong>
              <small class="uppercase hidden print:block mt-0.5 text-gray-500">{t('head.salary')}</small>
            </div>
            <div class="print:flex flex-col justify-start hidden">
              <strong class="font-medium th-label leading-[0.8] text-gray-900">{showExpect()}</strong>
              <small class="uppercase mt-0.5 text-gray-500">{t('head.salary.expect')}</small>
            </div>
            <div class="flex flex-col leading-[0.8] print:hidden">
              {#if experience.interview}
                <span class="inline-block rounded-none bg-green-600/90 text-white text-xs px-2 py-0.5 -mt-1.5 font-medium w-fit">
                  {t('head.availability.yes')}
                </span>
              {:else}
                <span class="inline-block rounded-none bg-red-600/90 text-white text-xs px-2 py-0.5 -mt-1.5 font-medium w-fit">
                  {t('head.availability.no')}
                </span>
              {/if}
              <small class="uppercase mt-1.5 text-gray-500 dark:text-gray-400">{t('head.availability')}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
