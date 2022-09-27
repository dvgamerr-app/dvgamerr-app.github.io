<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import relativeTime from 'dayjs/plugin/relativeTime'
import data from '~/../docs/data/resume.json'

import 'bootstrap/dist/js/bootstrap.esm'

dayjs.extend(relativeTime)

const { birthday, salary, interview, social } = data
const { fullname: enName, national, religion, national_id, language, location, job, detail } = data['en']
const { fullname: thName } = data['th']

export default {
  data () {
    return {
      enName,
      thName,
      birthday,
      national,
      religion,
      national_id,
      language,
      salary,
      interview,
      location,
      job,
      detail,
      social,
      printTippy: {
        arrow: true,
        arrowType: 'round',
        showOnInit: true,
        animateFill: false,
        animation : 'shift-toward'
      }
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code === this.$i18n.locale)
    },
    showNationalD () {
      const [ , ...id ] = /(\d)(\d{4})(\d{5})(\d{2})(\d{1}).*/ig.exec(this.national_id)
      return id.join(' ')
    },
    showBirthday () {
      const bd = dayjs(this.birthday)
      return bd.format('MMMM DD, YYYY')
    },
    showAge () {
      const bd = dayjs(this.birthday)
      return bd.fromNow(true)
    },
    showSalary () {
      const perHour = Math.round(this.salary.base / 20 / 8 / this.salary.rate * 100) / 100
      return `${this.salary.currency}${perHour} per hour`
    },
    showSalaryFull () {
      return `${numeral(this.salary.base).format('0,0')} THB`
    },
    showExpect () {
      return `${numeral(this.salary.expect).format('0,0')} THB`
    }
  },
  methods: {
    onSignIn () {
      if (this.$auth.loggedIn) {
        this.$notify({
          title: `Hello, ${this.$auth.user.fullName}!`,
          text: `${this.$auth.user.job} (${this.$auth.user.level})`
        })
        return
      }

      return this.$auth.loginWith('sso')
    },
    onPrint () {
      print()
    },
    onSchemaMode () {
      if (this.$colorMode.preference == 'light') {
        this.$colorMode.preference = 'dark'
      } else {
        this.$colorMode.preference = 'light'
      }
    }
  },
  created () {
    console.log('loggedIn:', this.$auth.loggedIn)
  }
}
</script>
<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 col-md-11 d-none d-md-block">
          <div class="profile-img d-flex justify-content-end">
            <img src="~assets/avatar_20221008.webp" loading="lazy" width="230" height="280" alt="">
          </div>
        </div>
        <div class="col-lg-27 col-md-25 col-sm-36 name-wrapper">
          <h1 class="name th-label" v-text="$t('fullname')" />
          <span class="d-print-none th-label" v-text="$t('job')" />
          <span class="d-print-only th-label th-name" v-text="$t('subname')" />
          <div class="d-print-none mt-1">
            <img alt="wakatime" height="20" loading="lazy" src="https://wakatime.com/badge/user/06633b1c-3ba7-44c2-ab5d-08e47ccc87ab.svg?style=flat-square&color=blue" />
            <img alt="follow" width="100" height="20" loading="lazy" src="https://img.shields.io/github/followers/dvgamerr?logo=github&style=flat-square&color=yellow" />
            <img alt="counter" width="120" height="20" loading="lazy" src="https://komarev.com/ghpvc/?username=dvgamerr&label=page views&style=flat-square&color=green" />
          </div>
          <p contenteditable="false" class="mt-3" v-text="detail" />
          <div>
            <div class="grid-personal">
              <div class="personal nickname">
                <strong class="d-print-none">KEM</strong>
                <strong class="d-print-only">KEM <span class="th-label">(เขม)</span></strong>
                <small>Nick Name</small>
              </div>
              <div class="personal birthday">
                <strong v-text="showBirthday" />
                <small>birth ({{ showAge }} old)</small>
              </div>
              <div class="personal language">
                <strong>
                  <div v-for="(v, i) in language" :key="i" class="lang">
                    {{ i }}
                    <small class="level" v-text="`(${v})`" />
                  </div>
                </strong>
                <small>language</small>
              </div>
              <div class="personal religion d-print-only">
                <strong v-text="religion" />
                <small>religion</small>
              </div>

              <div class="personal nationality d-print-only">
                <strong v-text="national" />
                <small>nationality</small>
              </div>
              <div class="personal national-id d-print-only">
                <strong v-text="showNationalD" />
                <small>National ID</small>
              </div>
              <div class="personal location">
                <strong v-text="location" />
                <small>current location</small>
              </div>
              <div class="personal current-salary">
                <strong class="d-print-none" v-text="showSalary" />
                <strong class="d-print-only" v-text="showSalaryFull" />
                <small>current salary</small>
              </div>
              <div class="personal expect-salary d-print-only">
                <strong v-text="showExpect" />
                <small>Expect salary</small>
              </div>
              <div class="personal interview d-print-none">
                <span v-if="!interview" class="badge bg-danger">NO</span>
                <span v-else class="badge bg-success">YES</span>
                <small>interview availability</small>
              </div>
            </div>


            <ul class="social-icon my-3 d-print-none">
              <li>
                <a href="#" @click.prevent="onSignIn">
                  <font-awesome-icon :icon="$auth.loggedIn ? 'user-tie' : 'right-to-bracket'" />
                </a>
              </li>
              <div class="dropdown d-none">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <font-awesome-icon icon="globe" />
                </button>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <li><a class="dropdown-item active" href="#">EN</a></li>
                  <li><a class="dropdown-item" href="#">TH</a></li>
                </ul>
              </div>

              <li style="margin-right:1em" content="If want CV." v-tippy="printTippy">
                <a href="#" rel="noopener noreferrer" @click.prevent="onPrint"><font-awesome-icon icon="print" /></a>
              </li>
              <li>
                <a href="#" rel="noopener noreferrer" @click.prevent="onSchemaMode">
                  <font-awesome-icon :icon="$colorMode.value == 'light' ? 'lightbulb' : 'moon'" />
                  <span v-text="`${$colorMode.value != 'light' ? 'dark' : 'light'} Mode`" style="text-transform: capitalize;" />
                </a>
              </li>
              <li style="margin-right:1em;text-transform:uppercase;">
                <nuxt-link v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code === 'th'?'en':'th')">{{ locale.code }}</nuxt-link>
              </li>
              <!-- <li v-for="e in social" :id="`img-${e.name}`" :key="e.name">
                <a :href="e.link" target="_blank" rel="noopener noreferrer"><font-awesome-icon :icon="e.icon" /></a>
              </li> -->
            </ul>
          </div>

        </div>

      </div>
      <notifications position="bottom right"/>
    </div>
  </header>
</template>

<style lang="scss">
// @media (max-width: 576px){
//   .header {
//     padding: 1.8em;
//   }
// }

.header {
  .profile-img img {
    object-fit: cover;
    max-width: 230px;
    width: 100%;
  }

  .name-wrapper {
    margin-bottom: 2em;

    > h1 {
      text-transform: uppercase;
      color: var(--text-primary);
      line-height: 2rem;
      margin: -.12em 0 .2em;
    }

    > span {
      font-size: 1.5rem;
      color: var(--text-color-link);
    }
    > span.th-name {
      font-size: 2rem;
    }

  }
  .grid-personal {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: .2em;
    grid-row-gap: .2em;
    .personal {
      margin: 10px 0;

      strong {
        text-transform: uppercase;
        font-size: .9rem;
        font-weight: bold;
        color: var(--text-secondary-value);
        display: block;
        line-height: 1;
      }

      small {
        text-transform: uppercase;
        font-weight: normal;
        font-size: .75rem;
      }

      span {
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      span.badge {
        color: #FFF;
        display: table;
        padding: 4px 5px 2px;
        margin: -4px 0 1px 0;
      }

      .lang {
        display: inline-block;
        margin-right: 0.4em;
      }

    }
  }
}

.social-icon {
  display: flex;
  flex-direction: row;
  gap: .3em;

  > li > a {
    display: block;
    font-size: .85rem;
    color: var(--menu-color);
    line-height: 2.1rem;
    padding: 0 .75em;
    text-align: center;
    border-radius: 2px;
    border: 2px solid var(--menu-border-color);
    font-weight: bold;

    &:hover {
      border-color: var(--menu-border-color-hover);
    }
  }
}

</style>
