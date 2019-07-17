<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <div class="card" style="overflow: hidden">
            <div v-if="false" class="card-manu">
              <button
                type="button" class="btn btn-icon btn-primary btn-secondary" 
                :class="{ 'btn-loading': btnEdit.loading }" @click="onDonateEdit"
              >
                <i :class="['fe', (!btnEdit.mode ? 'fe-edit' : 'fe-x') ]" />
              </button>
            </div>
            <div v-if="!btnEdit.mode" class="donate-image" />
            <div v-if="!btnEdit.mode" class="card-body" v-html="markdown(donate.content)" />
            <div v-else class="card-body">
              <div class="form-group" style="margin-top: -20px;">
                <label class="form-label">Donate description</label>
                <textarea
                  v-model="donate.content" rows="12" class="form-control"
                  :disabled="!btnEdit.textarea" placeholder="Here can be your donate description with markdown."
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card p-3 mb-3">
            <adsbygoogle ad-slot="4314984147" ad-format="auto" data-full-width-responsive="true" :ad-style="{ display: 'block' }" />
          </div>
          <div class="card p-3 mb-3">
            <adsbygoogle ad-slot="1949934436" ad-format="auto" data-full-width-responsive="true" :ad-style="{ display: 'block' }" />
          </div>
        </div>
      </div>
      <div class="page-header">
        <h1 class="page-title">
          Donate
        </h1>
      </div>
      <div class="row">
        <div class="col-sm-12 col-lg-6 mb-3">
          <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/donate/scb-logo.jpg" class="card-img" alt="SCB">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">
                    <h5>Siam Commercial Bank <small class="d-none d-md-inline">(บัญชีธนาคารไทยพาณิชย์)</small></h5>
                  </h5>
                  <div class="card-text">
                    <button v-tippy="tooltip" v-clipboard="wallet.bank.scb" type="button" class="btn btn-link btn-tooltip" title="copied">
                      <b v-text="cleave(wallet.bank.scb, [3, 6])" />
                    </button>
                    <small class="d-block text-muted">นายกัณฑ์อเนก ทองคำ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/QR_SCB.jpg" class="card-img" alt="SCB">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">
                    Promptpay <small class="d-none d-md-inline">(พร้อมเพย์)</small>
                  </h5>
                  <div class="card-text">
                    <small class="d-block text-muted">นายกัณฑ์อเนก ทองคำ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6 mb-3">
          <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/donate/bbl-logo.jpg" class="card-img" alt="SCB">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">
                    <h5>Bangkok Bank <small class="d-none d-md-inline">(บัญชีธนาคารกรุงเทพ)</small></h5>
                  </h5>
                  <div class="card-text">
                    <button v-tippy="tooltip" v-clipboard="wallet.bank.bbl" type="button" class="btn btn-link btn-tooltip" title="copied">
                      <b v-text="cleave(wallet.bank.bbl, [3, 1, 5])" />
                    </button>
                    <small class="d-block text-muted">นายกัณฑ์อเนก ทองคำ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/QR_True.jpg" class="card-img" alt="True Wallet">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">
                    True Wallet <small class="d-none d-md-inline">(ทรูวอลเล็ต)</small>
                  </h5>
                  <div class="card-text">
                    <small class="d-block text-muted">นายกัณฑ์อเนก ทองคำ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6 mb-3">
          <div class="card card-aside">
            <div class="card-aside-column crypto-logo d-none d-md-inline" />
            <div class="card-body d-flex flex-column">
              <h5>Cryptocurrency <small class="d-none d-md-inline">(เงินดิจิตอล)</small></h5>
              <div class="d-flex align-items-center pt-2 mt-auto">
                <div class="avatar avatar-md mr-3">
                  BTC
                </div>
                <div>
                  <button v-tippy="tooltip" v-clipboard="wallet.bitcoin" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    {{ wallet.bitcoin }}
                  </button>
                  <small class="d-block text-muted">Bitcoin</small>
                </div>
              </div>
              <div class="d-flex align-items-center pt-2 mt-auto">
                <div class="avatar avatar-md mr-3">
                  ETH
                </div>
                <div>
                  <button v-tippy="tooltip" v-clipboard="wallet.ethereum" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    {{ wallet.ethereum }}
                  </button>
                  <small class="d-block text-muted">Ethereum</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6 mb-3 d-none">
          <div class="card card-aside">
            <a href="https://www.paypal.me/touno" target="_blank" class="card-aside-column paypal-logo d-none d-md-inline" />
            <div class="card-body d-flex flex-column">
              <h5><a href="https://www.paypal.me/touno" target="_blank">Paypal.me <small class="d-none d-md-inline">(เพย์แพล)</small></a></h5>
              <div class="text-muted">
                https://www.paypal.me/touno
              </div>
              <div class="d-flex align-items-center pt-5 mt-auto" style="padding-bottom: 1.75rem !important;">
                <div class="avatar dvgamerr mr-3" />
                <div>
                  <span class="text-default">กัณฑ์อเนก ทองคำ</span>
                  <small class="d-block text-muted">dv****r@hotmail.com</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-36 col-lg-18 d-none">
          <div class="card card-aside">
            <a href="https://www.buymeacoffee.com/tounoio" target="_blank" class="card-aside-column coffee-logo d-none d-md-inline" />
            <div class="card-body d-flex flex-column">
              <h5><a href="https://www.buymeacoffee.com/tounoio" target="_blank">Buy me a Coffee <small class="d-none d-md-inline">(ซื้อกาแฟให้ผมสิ)</small></a></h5>
              <div class="text-muted">
                https://www.buymeacoffee.com/tounoio
              </div>
              <div class="d-flex align-items-center pt-5 mt-auto">
                <div class="avatar dvgamerr mr-3" />
                <div>
                  <span class="text-default">TOUNO.io</span>
                  <small class="d-block text-muted">Opensource</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import md5 from 'md5'
import marked from 'marked'
import numeral from 'numeral'
import moment from 'moment'

export default {
  head () {
    return {
      title: 'Donate Me ❤ ',
      meta: [
        { property: 'fb:app_id', content: `1819497478353835` },
        { property: 'og:url', content: `https://mr.touno.io/donate` },
        { property: 'og:type', content: `article` },
        { property: 'og:title', content: `Donate me ❤` },
        { property: 'og:updated_time', content: 1537712005 },
        { property: 'og:description', content: `If you like my software and other modules, please consider buying me a coffee. Thank you for your support!` },
        { property: 'og:image', content: `https://mr.touno.io/images/fb-donate.jpg` }
      ]
    }
  },
  data () {
    return {
      btnEdit: {
        textarea: true,
        mode: false,
        loading: false
      },
      tooltip: {
        trigger: 'click',
        hideOnClick: true,
        placement: 'right',
        arrow: true,
        duration: 600
      }
    }
  },
  async asyncData () {
    return {
      wallet: {
        paypal: '',
        coffee: 'https://www.buymeacoffee.com/dvgamerr',
        bitcoin: '3JbW8wZNy16JTUPhWunZb9zsESnATcAJjW',
        ethereum: '0xbfc756dcBeFa3921fa2D5125115f85e20a88f3B6',
        bank: {
          scb: '4088294384',
          bbl: '0867214769'
        }
      },
      donate: {
        content: '**Thank you everyone for supporting me**,  whether donations. \n\nArticle publishing Sharing information with me This is the kind of help that I would like to thank everyone very much.\n\nOpen source software of the developer. No policy to charge. Or any trading. To access add-ons in the developer\'s software or applications. But it will be necessary to advertise. All expenses incurred through the development of open source software or applications are paid by **Google Adsense**. The donation to the developer directly is only a user\'s choice.',
        member: 0,
        paid: 0
      }
    }
  },
  methods: {
    markdown (content) {
      return marked(content)
    },
    moment (date) {
      return moment(date)
    },
    toNumber (value) {
      return numeral(value).format('0,0')
    },
    toBitcoin (value) {
      return numeral(value).format('0,0.########')
    },
    toMoney (value) {
      return numeral(value).format('0,0.##')
    },
    userAvatar () {
      return `url(//www.gravatar.com/avatar/${md5(this.profile.email)}?s=120)`
    },
    cleave (d, b) {
      let index = 0
      let text = ''
      for (let i = 0; i < b.length; i++) {
        text += `${d.substr(index, b[i])}-`
        index += b[i]
      }
      return `${text}${d.substr(index, d.length - index)}`
    },
    toogleEdit () {
      this.btnEdit.mode = !this.btnEdit.mode
    },
    onDonateEdit () {
      if (this.btnEdit.mode) {
        this.btnEdit.textarea = false
        this.btnEdit.loading = true
        // this.$axios.post('/api/content/donate/description', {
        //   desc: this.donate.content
        // }).then(() => {
        //   this.toogleEdit()
        //   this.btnEdit.textarea = true
        //   this.btnEdit.loading = false
        // }).catch(ex => {
        //   console.log(ex)
        // })
      } else {
        this.toogleEdit()
      }
    }
  },
  created () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
  }
}
</script>

<style>
.btn-tooltip {
  padding: 0px;
  font-size: 1rem;
  text-transform: capitalize;
}
.bank-logo {
  background-image: url('/images/donate/bank-logo.jpg');
}
.scb-logo {
  background-image: url('/images/donate/scb-logo.jpg');
}
.bbl-logo {
  background-image: url('/images/donate/bbl-logo.jpg');
}
.pp-logo {
  background-image: url('/images/donate/pp-logo.jpg');
}
.coffee-logo {
  background-image: url('/images/donate/coffee-logo.jpg');
}
.paypal-logo {
  background-image: url('/images/donate/paypal-logo.jpg');
}
.crypto-logo {
  background-image: url('/images/donate/crypto-logo.jpg');
}
.card .donate-image {
  background-image: url(/images/fb-donate.jpg);
  background-position: top center;
  width: 100%;
  background-size: cover;
  margin-top: -10px;

}
@media (min-width: 320px) {
  .donate-image {
    height: 220px;
  }
}
@media (min-width: 578px) {
  .donate-image {
    height: 280px;
  }
}
@media (min-width: 768px) {
  .donate-image {
    height: 360px;
  }
}
@media (min-width: 992px) {
  .donate-image {
    height: 360px;
  }
}
@media (min-width: 1280px) {
  .donate-image {
    height: 400px;
  }
}

</style>
