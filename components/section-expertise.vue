<template>
  <section v-if="expertise.length > 0" class="section-wrapper section-expertise">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>My Specialities</h2>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div v-for="e in expertise" :key="expertise.indexOf(e)" class="col-md-6">
              <div class="expertise-item">
                <h3 v-text="e.subject" />
                <p v-html="marked(e.detail)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import marked from 'marked'

export default {
  props: {
    editor: { type: Boolean },
    expertise: { type: Array, default: () => ([]) }
  },
  methods: {
    marked (text) {
      return marked(text)
    }
  }
}
</script>

<style>
.expertise-item {
  margin-bottom : 20px;
}

.expertise-item h3 {
  text-transform : uppercase;
  margin-bottom  : 5px;
}
.expertise-item code {
  font-size: 90%;
  color: #ff5722;
}
@media print {
  .expertise-item code {
    color: #444;
    font-weight: bold;
  }
}

</style>
