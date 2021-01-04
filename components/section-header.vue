<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="profile-img">
            <img src="~assets/icon.jpg" loading="lazy" class="img-fluid" alt="">
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
            <div class="d-print-none clear-p" v-html="marked('![](https://komarev.com/ghpvc/?username=dvgamerr&color=orange&label=Page%20View&style=flat-square)')" />
          </div>
          <p v-html="resume.detail" />
          <div v-if="!resume.error" class="row">
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
          <div v-if="!resume.error" class="row">
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
            <li v-show="resume.social.length" id="img-print" class="mr-3">
              <a href="#" rel="noopener noreferrer" @click.prevent="onPrint"><fa icon="print" /></a>
            </li>
            <li v-for="e in resume.social" :id="`img-${e.name}`" :key="e.name">
              <a :href="e.link" target="_blank" rel="noopener noreferrer"><fa :icon="e.icon" /></a>
              <!-- <b-tooltip :target="`img-${e.name}`">{{e.alt}}</b-tooltip> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import dayjs from 'dayjs'
import marked from 'marked'
import numeral from 'numeral'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default {
  props: {
    editor: { type: Boolean },
    resume: {
      type: Object,
      default () {
        return {
          error: null,
          fullname: '',
          birthday: new Date(),
          national: '',
          language: '',
          salary: {
            base: 1,
            expect: 1,
            rate: 1,
            day: 30,
            hour: 8,
            currency: 'THB'
          },
          interview: '',
          location: '',
          job: '',
          detail: '',
          social: []
        }
      }
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
    },
    marked (text) {
      return marked(text)
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
