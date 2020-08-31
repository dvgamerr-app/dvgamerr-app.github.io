<template>
  <section v-if="skillHeader.length > 0" class="section-wrapper section-skills">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Skills</h2>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div v-for="i in skillHeader" :key="i" class="col-md-6 skill-list">
              <h3 class="mb-1" v-text="i" />
              <ul class="pb-3">
                <li v-for="item in skill[i]" :key="skill[i].indexOf(item)" v-text="item" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    editor: { type: Boolean },
    skill: { type: Object, default: () => ({}) }
  },
  computed: {
    skillHeader () {
      return Object.keys(this.skill)
    }
  }
}
</script>
<style scoped>
.skill-list h3 {
  text-transform: uppercase;
}
.skill-list li {
  display: inline-block;
  padding-right: 4px;
}
.skill-list li:after {
  content: ',';
}
.skill-list li:last-child:after {
  content: '' !important;
}

.progress-item {
  position : relative;
}

.progress-item .progress-title {
  font-size     : 12px;
  font-weight   : 400;
  display       : inline-block;
  margin-bottom : 5px;
}

.progress-item .progress {
  height        : 2px;
  box-shadow    : none;
  border-radius : 0;
  background    : transparent;
}

.progress-item .progress-bar {
  background-color : #ff5722;
  box-shadow       : none;
  text-align       : right;
}

.progress-item .progress-percent {
  font-size        : 10px;
  background-color : #313131;
  position         : absolute;
  top              : 5px;
  padding          : 0 8px;
  border-radius    : 3px;
}

.progress-item .progress-percent::before {
  content      : "";
  position     : absolute;
  left         : 0;
  bottom       : -4px;
  border-top   : 6px solid #313131;
  border-right : 8px solid transparent;
}

@media (max-width: 768px) {
  .progress-wrapper {
    margin-bottom: 50px;
  }
}

</style>
