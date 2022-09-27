<script>
import { contact } from '~/../docs/data/resume.json'
/* eslint-disable nuxt/no-globals-in-created */
export default {
  data: () => ({
    contact
  }),
  methods: {
    contactPrint () {
      return this.contact.filter(e => e.print && e.label !== 'MOBILE' && e.label !== 'EMAIL')
    },
    contactTel () {
      return this.contact.filter(e => e.print && (e.label === 'MOBILE' || e.label === 'EMAIL'))
    },
    contactView () {
      return this.contact.filter(e => !e.print)
    }
  }
}
</script>

<template>
  <section class="section-wrapper section-contact">
    <div class="row">
      <div class="col-lg-9 col-md-11">
        <div class="section-title">
          <h2>Contact</h2>
        </div>
      </div>
      <div class="col-lg-27 col-md-25 col-sm-36">
        <div class="d-grid contact-item">
          <div v-for="(e, i) in contactPrint()" :key="'print-'+i" class="d-print-only">
            <address>
              <img :src="e.qrcode" height="160" :alt="'QR ' + e.label" data-not-lazy>
            </address>
          </div>
          <div class="d-print-only">
            <address v-for="(e, i) in contactTel()" :key="'tel-'+i">
              <strong v-text="e.label" /><br>
              <font-awesome-icon :icon="e.icon" class="mr-1" />
              <a :href="e.url" :target="e.label !== 'EMAIL' && e.label !== 'MOBILE' ? '_blank' : ''" v-text="e.text" />
            </address>
          </div>
          <div v-for="(e, i) in contactView()" :key="'view-'+i" class="d-print-none">
            <address>
              <strong v-text="e.label" /><br>
              <div class="d-flex align-items-baseline justify-content-start" style="gap: .2em;">
                <font-awesome-icon :icon="e.icon" class="mr-1" />
                <a :href="e.url" :target="e.label !== 'EMAIL' && e.label !== 'MOBILE' ? '_blank' : ''" v-text="e.text" />
              </div>
            </address>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>

.section-contact {
  .contact-item {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: .2em;
    grid-row-gap: .2em;

    address {
      strong {
        color: var(--text-secondary);
      }
    }
  }
}

@media print {
  address a {
    color: var(--text-secondary);
    font-weight: bold;
    text-decoration: none !important;
  }

  .section-contact {
    .contact-item {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
}
</style>
