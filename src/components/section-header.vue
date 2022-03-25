<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="profile-img">
            <img src="~assets/logo.jpg" loading="lazy" class="img-fluid" alt="">
          </div>
          <!-- Profile Image -->
        </div>
        <div class="col-md-9">
          <div class="name-wrapper">
            <h1 class="name">
              {{ resume.fullname }}
            </h1>
            <span>
              {{ resume.job }}
            </span>
            <div class="d-print-none clear-p" v-html="$md.render(badge)" />
          </div>
          <p contenteditable="false" v-html="$md.render(resume.detail)" />
          <div class="row">
            <div class="col-md-4">
              <div class="personal-details">
                <strong v-text="showBirthday" />
                <small>BIRTH</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="personal-details">
                <strong v-text="resume.national" />
                <small>NATIONALITY</small>
              </div>
            </div>
            <div class="col-md-5">
              <div class="personal-details">
                <strong v-html="resume.language" />
                <small>LANGUAGE</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="personal-details">
                <strong v-text="resume.location" />
                <small>CURRENT LOCATION</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="personal-details">
                <strong class="d-print-none" v-text="showSalary" />
                <strong class="d-none print-only" v-text="showSalaryFull" />
                <small>CURRENT SALARY</small>
              </div>
            </div>
            <div class="col-md-5">
              <div class="personal-details">
                <span class="badge" :class="[resume.interview ? 'badge-success' : 'badge-danger','d-print-none']">
                  {{ resume.interview ? 'YES' : 'NO' }}
                </span>
                <small class="d-print-none">INTERVIEW AVAILABILITY</small>
                <strong class="d-none print-only" v-text="showExpect" />
                <small class="d-none print-only">EXPECT SALARY</small>
              </div>
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
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import relativeTime from 'dayjs/plugin/relativeTime'
import data from '~/../docs/data.json'

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
      },
      badge: '![counter](https://komarev.com/ghpvc/?username=dvgamerr&color=orange&label=Page%20View&style=flat-square) [![wakatime](https://wakatime.com/badge/user/06633b1c-3ba7-44c2-ab5d-08e47ccc87ab.svg?&color=orange&style=flat-square)](https://wakatime.com/@06633b1c-3ba7-44c2-ab5d-08e47ccc87ab)'
    }
  },
  computed: {
    showBirthday () {
      const bd = dayjs(this.resume.birthday)
      return `${bd.format('MMMM DD, YYYY')} (${bd.fromNow()})`
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
    onPrint () {
      print()
    }
  }
}
</script>

<style scoped>
/*-----------------------------
* NAVIGATION & HEADER STYLE
*-----------------------------*/
@media print {
  .header {
    border-top : none !important;
  }
}

.header .profile-img {
  margin-right : 30px;
}

.header .name-wrapper {
  margin-bottom : 30px;
}

.header .name-wrapper h1 {
  text-transform : uppercase;
  line-height    : 1;
  margin         : 0 0 5px;
}

.header .name-wrapper span {
  font-size : 24px;
  color     : #ff5722;
}

.header .personal-details {
  margin : 10px 0;
}

.header .personal-details strong {
  font-size   : 13px;
  color       : #444444;
  display     : block;
  line-height : 1;
}

.header .personal-details small {
  font-size : 12px;
}

.header .personal-details span {
  color : #989898;
}

.header .personal-details span.badge {
  color : #FFF;
  display: table;
  padding: 4px 5px 2px;
  margin-top: -4px;
}

@media (max-width : 768px) {
  .header {
    padding    : 20px 0;
  }

  .header .profile-img {
    margin: 0 0 30px;
  }
}

@media (max-width : 600px){
  .header {
    padding: 20px;
  }
}

/*
 * -------------------
 * Social Icon
 * -------------------
 */

.social-icon {
  margin  : 20px 0;
  padding : 0;
  display : block;
}

.social-icon li {
  display : inline-block;
  margin  : 0 2px;
}

.social-icon li a {
  display       : block;
  font-size     : 12px;
  color         : #333333;
  width         : 34px;
  height        : 34px;
  line-height   : 33px;
  text-align    : center;
  border-radius : 2px;
  border        : 2px solid #eeeeee;
}

.social-icon li a:hover {
  border-color : #cccccc;
}

@media print {
  .header .personal-details small {
    font-weight: bold;
  }
}

</style>
