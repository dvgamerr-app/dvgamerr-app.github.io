<template>
  <section v-if="!!coding" class="section-wrapper section-coding d-print-none">
    <div class="row">
      <div class="col-lg-9 col-md-11">
        <div class="section-title">
          <h2>My Coding</h2>
        </div>
      </div>
      <div class="col-lg-27 col-md-25 col-sm-36 d-grid stats">
        <div class="stats-item">
          <div class="value" v-text="getExperience()" />
          <div class="name">
            Work Experience
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="toNumber(coding.loc)" />
          <div class="name">
            Lines of Code
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="`${toNumber(coding.project)} (${toNumber(coding.opensource)})`" />
          <div class="name">
            Projects (opensource)
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="toNumber(coding.commits)" />
          <div class="name">
            Commits
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import coding from '~/../docs/data/coding.json'

dayjs.extend(relativeTime)

export default {
  data: () => ({ coding }),
  methods: {
    getExperience () {
      const worked = dayjs().diff(this.coding.experience, 'month') / 12
      const month = worked % 1 * 12
      return `${Math.floor(worked)} years ${Math.floor(month)} month${month > 1 ? 's' : ''}`
    },
    toNumber (n = 0) {
      return n / 1000000 < 1 && n / 1000 >= 1 ? `${parseInt(n / 1000 * 10) / 10}K` : (n / 1000000 >= 1 ? `${parseInt(n / 1000000 * 10) / 10}M` : n)
    }
  }
}
</script>
