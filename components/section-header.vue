<template>
<header class="header">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="profile-img"><img src="~assets/icon.jpg" class="img-fluid" alt=""/></div>
        <!-- Profile Image -->
      </div>
      <div class="col-md-9">
        <div class="name-wrapper">
          <h1 class="name" v-text="resume.fullname"></h1>
          <span v-text="resume.job"></span>
        </div>
        <p v-html="resume.detail"></p>
        <div class="row">
          <div class="col-md-4">
            <div class="personal-details">
              <strong v-text="showBirthday"></strong>
              <small>BIRTH</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="personal-details">
              <strong v-text="resume.national"></strong>
              <small>NATIONALITY</small>
            </div>
          </div>
          <div class="col-md-5">
            <div class="personal-details">
              <strong v-html="resume.language"></strong>
              <small>LANGUAGE</small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="personal-details">
              <strong v-text="resume.location"></strong>
              <small>CURRENT LOCATION</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="personal-details">
              <strong v-text="showSalary"></strong>
              <small>CURRENT SALARY</small>
            </div>
          </div>
          <div class="col-md-5">
            <div class="personal-details">
              <strong v-html="showInterview"></strong>
              <small>INTERVIEW AVAILABILITY</small>
            </div>
          </div>
        </div>
        <ul class="social-icon d-print-none">
          <li v-for="e in resume.social" :key="e.name" :id="`img-${e.name}`">
            <a :href="e.link" target="_blank"><i :class="[ e.icon ]"></i></a>
            <!-- <b-tooltip :target="`img-${e.name}`">{{e.alt}}</b-tooltip> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    resume: {
      type: Object,
      default () {
        return {
          fullname:'',
          birthday: new Date(),
          national: '',
          language: '',
          salary: '',
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
      let bd = moment(this.resume.birthday)
      return `${bd.format('MMMM DD, YYYY')} (${bd.fromNow()})`
    },
    showInterview () {
      return this.resume.interview ? 'Yes' : 'No'
    },
    showSalary () {
      let perHour = Math.round(this.resume.salary.base / 20 / 8 / this.resume.salary.rate * 100) / 100
      return `${this.resume.salary.currency}${perHour} per hour`
    }
  }
}
</script>

<style scoped>

/*-----------------------------
* NAVIGATION & HEADER STYLE
*-----------------------------*/

.header {
  padding    : 50px 0;
  margin     : 0;
  position   : relative;
  border-top : 5px solid #ff5722;
}

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
</style>
