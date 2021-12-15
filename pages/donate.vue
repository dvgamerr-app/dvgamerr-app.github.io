<template>
  <header class="header">
    <div class="container">
      <div class="page-header mt-5">
        <h1 class="page-title">
          Donate
        </h1>
      </div>
      <div class="row">
        <div class="col-sm-12 col-lg-6 mb-3">
          <div class="card">
            <div v-if="false" class="card-manu">
              <button
                type="button"
                class="btn btn-icon btn-primary btn-secondary"
                :class="{ 'btn-loading': btnEdit.loading }"
                @click="onDonateEdit"
              />
            </div>
            <div v-if="!btnEdit.mode" class="donate-image" />
            <div v-if="!btnEdit.mode" class="card-body" v-html="$md.render(donate.content)" />
            <div v-else class="card-body">
              <div class="form-group" style="margin-top: -20px;">
                <label class="form-label">Donate description</label>
                <textarea
                  v-model="donate.content"
                  rows="12"
                  class="form-control"
                  :disabled="!btnEdit.textarea"
                  placeholder="Here can be your donate description with markdown."
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6 mb-3">
          <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/donate/scb-logo.jpg" class="card-img" loading="lazy" alt="SCB">
              </div>
              <div class="col-md-8 p-1">
                <div class="card-body">
                  <h5 class="card-title">
                    Siam Commercial Bank <small class="d-none d-md-inline">(บัญชีธนาคารไทยพาณิชย์)</small>
                  </h5>
                  <div class="card-text">
                    <button v-tippy="tooltip" v-clipboard="wallet.scb" type="button" class="btn btn-link btn-tooltip" title="copied">
                      <font-awesome-icon icon="copy" />
                      <strong v-text="cleave(wallet.scb, [3, 6])" />
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
                <img src="/images/donate/kbank-logo.jpg" class="card-img" loading="lazy" alt="KBank">
              </div>
              <div class="col-md-8 p-1">
                <div class="card-body">
                  <h5 class="card-title">
                    KBank <small class="d-none d-md-inline">(ธนาคารกสิกรไทย)</small>
                  </h5>
                  <div class="card-text">
                    <button v-tippy="tooltip" v-clipboard="wallet.kbank" type="button" class="btn btn-link btn-tooltip" title="copied">
                      <font-awesome-icon icon="copy" />
                      <strong v-text="cleave(wallet.kbank, [3, 1, 5])" />
                    </button>
                    <small class="d-block text-muted">นายกัณฑ์อเนก ทองคำ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mb-4">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="/images/donate/bbl-logo.jpg" class="card-img" loading="lazy" alt="SCB">
              </div>
              <div class="col-md-8 p-1">
                <div class="card-body">
                  <h5 class="card-title">
                    Bangkok Bank <small class="d-none d-md-inline">(บัญชีธนาคารกรุงเทพ)</small>
                  </h5>
                  <div class="card-text">
                    <button v-tippy="tooltip" v-clipboard="wallet.bbl" type="button" class="btn btn-link btn-tooltip" title="copied">
                      <font-awesome-icon icon="copy" />
                      <strong v-text="cleave(wallet.bbl, [3, 1, 5])" />
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
                <img src="/images/QR_SCB.jpg" class="card-img" loading="lazy" alt="SCB">
              </div>
              <div class="col-md-8 p-1">
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
          <div class="card card-aside">
            <ins
              class="adsbygoogle"
              style="display:block"
              data-ad-test="on"
              data-ad-client="ca-pub-4905039106786059"
              data-ad-slot="6828018294"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
          <div class="card card-aside">
            <div class="row no-gutters">
              <div class="col-md-5">
                <img src="/images/donate/stripe-icon-17.jpg" class="card-img" loading="lazy" alt="KBank">
              </div>
              <div class="col-md-7 px-3 py-2">
                <h3 class="mb-0">
                  One Time Pay
                </h3>
                <div class="stripe pt-1 mb-4 mt-auto">
                  <button class="d-flex flex-column mr-3 w-100">
                    <span class="text-default">$ 1-5000</span>
                    <small class="d-block text-muted">Credit Card</small>
                  </button>
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
              <div class="d-flex align-items-center pt-2 my-1 mt-auto">
                <div class="avatar avatar-md mr-3">
                  BTC
                </div>
                <div style="line-height: 1rem;">
                  <small class="d-block text-muted">Bitcoin</small>
                  <button v-tippy="tooltip" v-clipboard="wallet.btc" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    <font-awesome-icon icon="copy" /> <strong v-text="wallet.btc" />
                  </button>
                </div>
              </div>
              <div class="d-flex align-items-center pt-2 my-1 mt-auto">
                <div class="avatar avatar-md mr-3">
                  ETH
                </div>
                <div style="line-height: 1rem;">
                  <small class="d-block text-muted">Ethereum</small>
                  <button v-tippy="tooltip" v-clipboard="wallet.eth" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    <font-awesome-icon icon="copy" /> <strong v-text="wallet.eth" />
                  </button>
                </div>
              </div>
              <div class="d-flex align-items-center pt-2 my-1 mt-auto">
                <div class="avatar avatar-md mr-3">
                  BNB
                </div>
                <div style="line-height: 1rem;">
                  <small class="d-block text-muted">Binance Coin</small>
                  <button v-tippy="tooltip" v-clipboard="wallet.bnb" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    <font-awesome-icon icon="copy" /> <strong v-text="wallet.bnb" />
                  </button>
                  <br>
                  <button v-tippy="tooltip" v-clipboard="wallet.bnb_tag" type="button" class="btn btn-link btn-tooltip btn-more" title="copied">
                    <font-awesome-icon icon="copy" /> <strong v-text="wallet.bnb_tag" />
                  </button>
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
import numeral from 'numeral'

const { wallet, donate } = require('../static/data.json')

export default {
  data () {
    return {
      wallet,
      donate,
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
  head () {
    return {
      title: 'Donate Me ❤ ',
      meta: [
        { property: 'fb:app_id', content: '1819497478353835' },
        { property: 'og:url', content: 'https://mr.touno.io/donate' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'Donate me ❤' },
        { property: 'og:updated_time', content: 1537712005 },
        { property: 'og:description', content: 'If you like my software and other modules, please consider buying me a coffee. Thank you for your support!' },
        { property: 'og:image', content: 'https://mr.touno.io/images/fb-donate.jpg' }
      ]
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
.container {
  z-index: 2;
}
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
}
.card-img {
  height: 100%;
  object-fit: cover;
  border-radius: 0px;
}

.stripe > button {
  background: transparent;
  border: solid 1px #ebebeb;
  border-radius: 4px;
  padding: 1em 1.2em;
}

.btn-more > strong {
  display: inline-block;
  width: 350px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 16px;
  text-align: left;
}
@media (max-width: 990px) {
  .resume-profile::before, .resume-profile::after {
    display: none !important;
  }
}

@media (min-width: 320px) {
  .btn-more > strong {
    width: 180px;
  }
}
@media (min-width: 425px) {
  .btn-more > strong {
    width: 270px;
  }
}

@media (min-width: 463px) {
  .btn-more > strong {
    width: 320px;
  }
}

@media (min-width: 576px) {
  .btn-more > strong {
    width: 390px;
  }
}

@media (min-width: 990px) {
  .btn-more > strong {
    width: 330px;
  }
}
@media (min-width: 1200px) {
  .btn-more > strong {
    width: 380px;
  }
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
.btn svg {
  color: #444444;
  font-size: 0.78em;
}
.btn {
  text-transform: none;
}
.btn strong {
  margin-left: .3em;
}
button:focus,
.btn:focus,
.btn:hover,
.btn:active:focus {
  outline : none !important;
  text-decoration: none;
}
</style>
