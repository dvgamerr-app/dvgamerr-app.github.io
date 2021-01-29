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
            <div v-for="(e, i) in contactPrint" :key="'print-'+i" :class="['d-none', 'print-only','col-md-' + (12 / (contactPrint.length + 1)), 'col-sm-' + (12 / (contactPrint.length + 1) * 2) ]">
              <address>
                <img :src="e.qrcode" height="160" :alt="'QR ' + e.label" data-not-lazy>
              </address>
            </div>
            <div :class="['d-none', 'print-only','col-md-' + (12 / (contactPrint.length + 1)), 'col-sm-' + (12 / (contactPrint.length + 1) * 2) ]">
              <address v-for="(e, i) in contactTel" :key="'tel-'+i">
                <strong v-text="e.label" /><br>
                <fa :icon="e.icon" class="mr-1" />
                <a :href="e.url" :target="e.label !== 'EMAIL' && e.label !== 'MOBILE' ? '_blank' : ''" v-text="e.text" />
              </address>
            </div>
            <div v-for="(e, i) in contactView" :key="'view-'+i" :class="['d-print-none','col-md-' + (12 / (contactView.length)), 'col-sm-' + (12 / (contactView.length) * 2) ]">
              <address>
                <strong v-text="e.label" /><br>
                <fa :icon="e.icon" class="mr-1" />
                <a :href="e.url" :target="e.label !== 'EMAIL' && e.label !== 'MOBILE' ? '_blank' : ''" v-text="e.text" />
              </address>
            </div>
          </div>
          <div class="feedback-form d-print-none d-none">
            <div v-if="!sended">
              <h3>GET IN TOUCH</h3>
              <form v-tabindex @submit.prevent="onSendMessage">
                <div class="form-group">
                  <input
                    v-model="msg.name"
                    type="text"
                    required=""
                    tabindex="1"
                    class="form-control"
                    placeholder="Full Name"
                  >
                </div>
                <div class="form-group">
                  <input
                    v-model="msg.email"
                    type="email"
                    required=""
                    tabindex="2"
                    class="form-control"
                    placeholder="Email"
                  >
                </div>
                <div class="form-group">
                  <input v-model="msg.subject" type="text" class="form-control" tabindex="3" placeholder="Subject">
                </div>
                <div class="form-group">
                  <textarea
                    v-model="msg.text"
                    class="form-control"
                    rows="4"
                    required=""
                    tabindex="4"
                    placeholder="Write message"
                  />
                </div>
                <button
                  type="submit"
                  tabindex="5"
                  class="btn btn-primary"
                  :disabled="!msg.token || sending"
                  v-text="!msg.token ? 'Human Verify...' : sending ? 'Sending...' : 'Send'"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="sended" class="row d-print-none d-none">
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
/* eslint-disable nuxt/no-globals-in-created */
export default {
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
  // head: {
  //   script: [{ src: 'https://www.google.com/recaptcha/api.js?render=6LeefYsUAAAAAGhMamT5dd5gNOXvrtUl4ZG_IayA' }]
  // },
  computed: {
    contactPrint () {
      return this.contact.filter(e => e.print && e.label !== 'MOBILE' && e.label !== 'EMAIL')
    },
    contactTel () {
      return this.contact.filter(e => e.print && (e.label === 'MOBILE' || e.label === 'EMAIL'))
    },
    contactView () {
      return this.contact.filter(e => !e.print)
    }
  },
  created () {
    if (process.client) {
      const vm = this
      const recaptcha = () => {
        setTimeout(() => {
          if (!window.grecaptcha) { return recaptcha() }

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
      if (!this.msg.name || !this.msg.email || !this.msg.subject || !this.msg.text || !this.msg.token) { return }

      this.sending = true
      try {
        const { data } = await this.$axios.post('/api/email', this.msg)
        this.error = data.error
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
@media print {
  address a {
    color: #444;
    font-weight: bold;
    text-decoration: none !important;
  }
}
</style>
