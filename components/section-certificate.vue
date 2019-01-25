<template>
<section v-if="certificate.length > 0" class="certificate-section pt-3 pb-3">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title"><h2>Certificates</h2></div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div v-for="e in certificate" :key="certificate.indexOf(e)" class="col-md-6">
            <div class="profile-item">
              <div class="media">
                <div class="media-left">
                  <a target="_blank" :href="e.cert"><img class="media-object" :src="e.icon" :alt="e.exam"></a>
                </div>
                <div class="media-body">
                  <h3 class="media-heading">
                    <a target="_blank" :href="e.cert" v-text="e.exam"></a>
                    <small v-text="toAchievement(e)"></small>
                  </h3>{{e.detail}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    editor: { type: Boolean },
    certificate: { type: Array, default: () => ([]) }
  },
  methods: {
    toAchievement (e) {
      return moment(e.achievement).format('MMMM DD, YYYY')
    }
  }
}
</script>
<style scoped>
.media-left {
  padding-right: 6px;
}
.media-heading {
  line-height: 1.2em;
}
.media-heading * {
  display: block;
}
</style>
