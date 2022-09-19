<template>
  <div>
    <section-header />
    <div>
      <section-contact/>
      <section-coding />
      <section-coding-history />
      <section-coding-daytime />
      <section-expertise />
      <section-skill />
      <section-education class="d-none print-only" />
    </div>
    <p class="pagebreak" />
    <section v-for="(e, i) in work" :key="i" :class="e.pagebreak ? 'pagebreak' : 'section-wrapper section-work pt-3 pb-3'">
      <div v-if="!e.pagebreak" class="container">
        <div class="row">
          <div class="col-md-3">
            <div class="section-title">
              <h2>Work Experience</h2>
              <span v-show="e.range.worked <= 0" class="badge badge-success">NEW JOB</span>
            </div>
          </div>
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-12">
                <div class="content-job">
                  <small v-if="isResigning(e.range)" v-text="getWorkPeriod(e.range)" style="margin-top: -2px;display: block;" />
                  <small v-else v-text="getWorkStart(e.range)" style="margin-top: -2px;display: block;" />
                  <h3 v-show="!e.jobs" v-text="e.job" />
                  <h4 v-text="e.work" />
                  <div v-if="!e.jobs" v-show="workfile[e.file]" class="markdown pt-1" v-html="$md.render(workfile[e.file])" />
                  <div class="content-subjob" v-else>
                    <div v-for="(j, l) in e.jobs" :key="l">
                      <h3 v-text="j.job" />
                      <small v-text="getWorkPeriod(j.range)" />
                      <div class="markdown pt-1" v-html="$md.render(workfile[j.file])" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <p class="pagebreak" />
    <div>
      <section-education class="d-print-none" />
      <section-certificate class="d-print-none" />
    </div>
    <page-footer />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import data from '~/../docs/data/resume.json'
import workfile from '~/../docs/data/work.json'

const { work } = data['en']

const getWorkedYear = range => {
  const begin = dayjs(range.begin)
  const quit = dayjs(range.quit || undefined)
  range.worked = quit.diff(begin.add(-1, 's'), 'year', true)
  return range
}


for (const item of work) {
  if (item.jobs && item.jobs.length > 0) {
    for (const subItem of item.jobs) {
      getWorkedYear(subItem.range)
    }
  }

  if (!item.range) continue
  getWorkedYear(item.range)
  console.log(item.range)
}


export default {
  data: () => ({ work, workfile }),
  head () {
    return {
      title: 'Mr. Kananek T.'
    }
  },
  computed: {
    isNewJob () {
      return
    }
  },
  methods: {
    isResigning ({ quit }) {
      return !!quit
    },
    getWorkStart ({ begin }) {
      begin = dayjs(begin).diff(dayjs().add(-1, 's'), 'month', true)
      const day = parseInt((begin % 1) * dayjs().daysInMonth())
      return `Start in ${Math.floor(begin) > 0 ? `${Math.floor(begin)} month` : ''} ${day} day${day > 1 ? 's' : ''}`
    },
    getWorkPeriod ({ worked, begin, quit }) {
      const newJob = dayjs(begin).diff(dayjs(), 'second') > 0

      begin = dayjs(begin).format('MMMM YYYY')
      quit = quit ? `- ${dayjs(quit).format('MMMM YYYY')}` : !newJob ? '- Present' : ''

      const month = worked % 1 * 12
      const day = parseInt(worked % 1 * dayjs().daysInMonth())

      console.log({ year: worked, month, day })

      const timeDiff = (worked > 0 ? `${Math.floor(worked)} year` : '') + (parseInt(month) > 0 ? ` ${parseInt(month)} month` : '')
      return `${newJob ? 'Start in ' : ''}${begin} ${quit}${timeDiff === '' ? '' : ` (${timeDiff})` }`
    }
  },
}
</script>

<style lang="scss">
.content-job {
  margin-bottom: 20px;

  h3 {
    margin: 0 0 10px;
    line-height: 1;
    font-weight: bold;
    text-transform: uppercase;
  }
  h4 {
    margin: 0;
    line-height: 1;
  }
  small {
    color: #888888;
  }
  p {
    margin-top: 15px;
    margin-bottom: 0px;
  }

  ul {
    margin: 0 0 0 5px;
    li::before {
      content: '•';
      margin-right: 5px;
    }
  }

  .badge {
    padding-top: 5px;
  }

  .content-subjob {
    padding: 15px 0px 0px 0px;
    > div {
      padding: 10px 0px;
      h3 {
        margin: 0px;
      }
    }
  }

}
</style>
