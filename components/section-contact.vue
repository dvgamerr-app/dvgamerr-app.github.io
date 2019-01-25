<template>
<section class="section-contact pt-3 pb-3" v-if="contact.length > 0">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>Contact</h2>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div v-for="e in contact" :key="contact.indexOf(e)"  :class="[ 'col-md-' + (12 / contact.length), 'col-sm-' + (12 / contact.length * 2)]" >
            <address>
              <strong v-text="e.label"></strong><br>
              <fa :icon="e.icon"/> <a :href="e.url" :target="e.label !== 'EMAIL' ? '_blank' : ''" v-text="e.text"></a>
            </address>
          </div>
        </div>
        <div class="feedback-form d-print-none">
          <div v-if="!sended">
            <h3>GET IN TOUCH</h3>
            <form v-tabindex @submit.prevent="onSendMessage">
              <div class="form-group">
                <input type="text" required="" tabindex="1" class="form-control" v-model="msg.name" placeholder="Full Name">
              </div>
              <div class="form-group">
                <input type="email" required="" tabindex="2" class="form-control" v-model="msg.email" placeholder="Email">
              </div>
              <div class="form-group">
                <input type="text" class="form-control" tabindex="3" v-model="msg.subject" placeholder="Subject">
              </div>
              <div class="form-group">
                <textarea class="form-control" rows="4" required="" tabindex="4" v-model="msg.text" placeholder="Write message"></textarea>
              </div>
              <button type="submit" tabindex="5" class="btn btn-primary" 
                :disabled="!msg.token || sending" v-text="!msg.token ? 'Human Verify...' : sending ? 'Sending...' : 'Send'"></button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row d-print-none" v-if="sended">
      <div class="col-md-12 text-center">
        <h2>Thank you for your interest in us.</h2>
      </div>
    </div>
  </div>
</section>
</template>
<script>
const axios = require('axios')

export default {
  head: {
    script: [ { src: 'https://www.google.com/recaptcha/api.js?render=6LeefYsUAAAAAGhMamT5dd5gNOXvrtUl4ZG_IayA' } ]
  },
  props: {
    editor: { type: Boolean },
    contact: { type: Array, default: () => ([]) },
    grecaptcha: { type: String }
  },
  data: () => ({
    sending: false,
    sended: false,
    msg: {
      name: '',
      email: '',
      subject: '',
      token: '',
      text: ''
    }
  }),
  methods: {
    async onSendMessage () {
      if (!this.msg.name || !this.msg.email || !this.msg.subject || !this.msg.text || !this.msg.token) return

      this.sending = true
      try {
        const { data } = await axios.post('/api/email', this.msg)
        this.sended = true
      } catch (ex) {
        console.log(ex)
      }
      this.sending = false
    }
  },
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
  }
}
</script>
<style>
.grecaptcha-badge {
  display: none;
}
</style>
