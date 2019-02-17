<template>
  <section v-if="contact.length > 0" class="section-wrapper section-contact">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Contact</h2>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div v-for="e in contact" :key="contact.indexOf(e)" :class="[ 'col-md-' + (12 / contact.length), 'col-sm-' + (12 / contact.length * 2)]">
              <address>
                <strong v-text="e.label" /><br>
                <fa :icon="e.icon" />
                <a :href="e.url" :target="e.label !== 'EMAIL' ? '_blank' : ''" v-text="e.text" />
              </address>
            </div>
          </div>
          <div class="feedback-form d-print-none">
            <div v-if="!sended">
              <h3>GET IN TOUCH</h3>
              <form v-tabindex @submit.prevent="onSendMessage">
                <div class="form-group">
                  <input v-model="msg.name" type="text" required="" tabindex="1" class="form-control" placeholder="Full Name">
                </div>
                <div class="form-group">
                  <input v-model="msg.email" type="email" required="" tabindex="2" class="form-control" placeholder="Email">
                </div>
                <div class="form-group">
                  <input v-model="msg.subject" type="text" class="form-control" tabindex="3" placeholder="Subject">
                </div>
                <div class="form-group">
                  <textarea v-model="msg.text" class="form-control" rows="4" required="" tabindex="4" placeholder="Write message" />
                </div>
                <button 
                  type="submit" tabindex="5" class="btn btn-primary"
                  :disabled="!msg.token || sending" v-text="!msg.token ? 'Human Verify...' : sending ? 'Sending...' : 'Send'"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="sended" class="row d-print-none">
        <div class="col-md-12 text-center">
          <h2 v-if="!error">
            Thank you for your interest in us.
          </h2>
          <h2 v-else v-text="error" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  head: {
    script: [ { src: 'https://www.google.com/recaptcha/api.js?render=6LeefYsUAAAAAGhMamT5dd5gNOXvrtUl4ZG_IayA' } ]
  },
  props: {
    editor: { type: Boolean },
    contact: { type: Array, default: () => ([]) },
    grecaptcha: { type: String, default: () => ('') }
  },
  data: () => ({
    sending: false,
    sended: false,
    error: '',
    msg: {
      name: '',
      email: '',
      subject: '',
      token: '',
      text: ''
    }
  }),
  created () {
    if (process.client) {
      let vm = this
      let recaptcha = () => {
        setTimeout(() => {
          if (!window.grecaptcha) return recaptcha()
          
          window.grecaptcha.ready(async () => {
            vm.msg.token = await window.grecaptcha.execute(this.grecaptcha, { action: 'action_name' })
          })
        }, 100)
      }
      recaptcha()
    }
  },
  methods: {
    async onSendMessage () {
      if (!this.msg.name || !this.msg.email || !this.msg.subject || !this.msg.text || !this.msg.token) return

      this.sending = true
      try {
        const { data } = await this.$axios.post('/api/email', this.msg)
      } catch (ex) {
        this.error = ex.response.data.error
      }
      this.sended = true
      this.sending = false
    }
  }
}
</script>
<style>
.grecaptcha-badge {
  display: none;
}
</style>
