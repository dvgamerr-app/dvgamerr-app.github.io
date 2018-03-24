<template>
<section id="skill">
  <div class="container">
    <div class="row">
      <div class="col-sm-18">
        <div class="section-title">
          <h2 v-text="$store.state.resume.skill.title"></h2>
          <p v-html="$store.state.resume.skill.detail"></p>
        </div>
      </div>
      <div class="col-sm-18">
        <div class="skill-thumb">
          <div v-for="item in $store.state.resume.skill.items" style="margin-bottom:15px;">
            <strong v-text="item.name"></strong>
            <span style="float: right;">{{`${item.percent}%`}}</span>
            <div class="progress">
              <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="100" aria-valuemin="0" :aria-valuemax="item.percent" :style="{ width: `${item.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>