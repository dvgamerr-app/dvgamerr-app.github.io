<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import relativeTime from 'dayjs/plugin/relativeTime'
import data from '~/../docs/data/resume.json'

dayjs.extend(relativeTime)

const { birthday, salary, interview, social } = data
const { fullname, national, language, location, job, detail } = data['en']

export default {
  props: {
    editor: { type: Boolean },
    resume: {
      type: Object,
      default () {
        return {
          fullname,
          birthday,
          national,
          language,
          salary,
          interview,
          location,
          job,
          detail,
          social
        }
      }
    }
  },
  data () {
    return {
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
    showBirthday () {
      const bd = dayjs(this.resume.birthday)
      return bd.format('MMMM DD, YYYY')
    },
    showAge () {
      const bd = dayjs(this.resume.birthday)
      return bd.fromNow(true)
    },
    showSalary () {
      const perHour = Math.round(this.resume.salary.base / 20 / 8 / this.resume.salary.rate * 100) / 100
      return `${this.resume.salary.currency}${perHour} per hour`
    },
    showSalaryFull () {
      return `${numeral(this.resume.salary.base).format('0,0')} THB`
    },
    showExpect () {
      return `${numeral(this.resume.salary.expect).format('0,0')} THB`
    }
  },
  methods: {
    onSignIn () {
      if (this.$auth.loggedIn) {
        this.$notify({
          title: 'Important message',
          text: 'Hello user!'
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
          <h1 class="name" v-text="resume.fullname" />
          <span v-text="resume.job" />
          <div class="d-print-none mt-1">
            <img alt="wakatime" height="20" loading="lazy" src="https://wakatime.com/badge/user/06633b1c-3ba7-44c2-ab5d-08e47ccc87ab.svg?style=flat-square&color=blue" />
            <img alt="follow" width="100" height="20" loading="lazy" src="https://img.shields.io/github/followers/dvgamerr?logo=github&style=flat-square&color=yellow" />
            <img alt="counter" width="120" height="20" loading="lazy" src="https://komarev.com/ghpvc/?username=dvgamerr&label=page views&style=flat-square&color=green" />
          </div>
          <p contenteditable="false" class="mt-3" v-text="resume.detail" />
          <div>
            <div class="grid-personal">
              <div class="personal">
                <strong v-text="showBirthday" />
                <small>BIRTH ({{ showAge }} old)</small>
              </div>
              <div class="personal">
                <strong v-text="resume.national" />
                <small>NATIONALITY</small>
              </div>
              <div class="personal">
                <strong>
                  <div v-for="(v, i) in resume.language" :key="i" class="lang">
                    {{ i }}
                    <span class="level" v-text="`(${v})`" />
                  </div>
                </strong>
                <small>LANGUAGE</small>
              </div>
              <div class="personal">
                <strong v-text="resume.location" />
                <small>CURRENT LOCATION</small>
              </div>
              <div class="personal">
                <strong class="d-print-none" v-text="showSalary" />
                <strong class="d-none print-only" v-text="showSalaryFull" />
                <small>CURRENT SALARY</small>
              </div>
              <div class="personal">
                <span v-if="!resume.interview" class="badge bg-danger d-print-none">NO</span>
                <span v-else class="badge bg-success">YES</span>
                <small class="d-print-none">INTERVIEW AVAILABILITY</small>
                <strong class="d-none print-only" v-text="showExpect" />
                <small class="d-none print-only">EXPECT SALARY</small>
              </div>
            </div>

            <ul class="social-icon my-3 d-print-none">
              <li>
                <a href="#" @click.prevent="onSignIn">
                  <font-awesome-icon :icon="$auth.loggedIn ? 'user-tie' : 'right-to-bracket'" />
                </a>
              </li>
              <li style="margin-right:1em">
                <a href="#" rel="noopener noreferrer" @click.prevent="onSchemaMode">
                  <font-awesome-icon :icon="$colorMode.value != 'light' ? 'lightbulb' : 'moon'" />
                </a>
              </li>
              <li content="If want CV." v-tippy="printTippy">
                <a href="#" rel="noopener noreferrer" @click.prevent="onPrint"><font-awesome-icon icon="print" /></a>
              </li>


              <!-- <li v-for="e in resume.social" :id="`img-${e.name}`" :key="e.name">
                <a :href="e.link" target="_blank" rel="noopener noreferrer"><font-awesome-icon :icon="e.icon" /></a>
              </li> -->
            </ul>
          </div>

        </div>
        <!-- <div class="col-36 d-md-none">
          <div class="grid-personal">
            <div class="personal">
              <strong v-text="showBirthday" />
              <small>BIRTH</small>
            </div>
            <div class="personal">
              <strong v-text="resume.national" />
              <small>NATIONALITY</small>
            </div>
            <div class="personal">
              <strong>
                <div v-for="(v, i) in resume.language" :key="i" class="lang">
                  {{ i }}
                  <span class="level" v-text="`(${v})`" />
                </div>
              </strong>
              <small>LANGUAGE</small>
            </div>
            <div class="personal">
              <strong v-text="resume.location" />
              <small>CURRENT LOCATION</small>
            </div>
            <div class="personal">
              <strong class="d-print-none" v-text="showSalary" />
              <strong class="d-none print-only" v-text="showSalaryFull" />
              <small>CURRENT SALARY</small>
            </div>
            <div class="personal">
              <strong v-if="!resume.interview" class="d-print-none">NO</strong>
              <span v-else class="badge badge-success">YES</span>
              <small class="d-print-none">INTERVIEW AVAILABILITY</small>
              <strong class="d-none print-only" v-text="showExpect" />
              <small class="d-none print-only">EXPECT SALARY</small>
            </div>
          </div>

          <ul class="social-icon d-print-none">
            <li v-show="resume.social.length" content="If want CV." v-tippy="printTippy" id="img-print" class="mr-3">
              <a href="#" rel="noopener noreferrer" @click.prevent="onPrint"><font-awesome-icon icon="print" /></a>
            </li>
            <li v-for="e in resume.social" :id="`img-${e.name}`" :key="e.name">
              <a :href="e.link" target="_blank" rel="noopener noreferrer"><font-awesome-icon :icon="e.icon" /></a>
            </li>
          </ul>
        </div> -->
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
      margin: 0 0 5px;
    }

    > span {
      font-size: 24px;
      color: var(--text-color-link);
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
        font-size: 13px;
        font-weight: bold;
        color: var(--text-secondary-value);
        display: block;
        line-height: 1;
      }

      small {
        font-weight: normal;
        font-size: 12px;
      }

      span {
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      span.badge {
        color: #FFF;
        display: table;
        padding: 4px 5px 2px;
        margin: -4px 0 -3px 0;
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

  li a {
    display: block;
    font-size: .85rem;
    color: var(--menu-color);
    width: 34px;
    height: 34px;
    line-height: 33px;
    text-align: center;
    border-radius: 2px;
    border: 2px solid var(--menu-border-color);

    &:hover {
      border-color: var(--menu-border-color-hover);
    }
  }
}

</style>
