<template>
<section class="certificate-section pt-3 pb-3">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title"><h2>Certificates</h2></div>
      </div>
<!-- Microsoft Certified Solutions Associate: Web Applications
September 26, 2016 

Microsoft Certified Solutions Developer: App Builder 
September 26, 2016 

Microsoft Certified Solutions Developer: Web Applications
June 21, 2016

Microsoft Certified Professional
June 14, 2016

Microsoft Specialist: Programming in HTML5 with JavaScript and CSS3
June 14, 2016 -->
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-6">
            <div class="profile-item">
              <div class="media">
                <div class="media-left">
                  <a target="_blank" href="/cert/file/Microsoft_Certified_Professional_Certificate_0.pdf">
                    <img class="media-object" src="cert/exam-badge.jpg" alt="">
                  </a>
                </div>
                <div class="media-body">
                  <h3 class="media-heading">
                    <a target="_blank" href="/cert/file/Microsoft_Certified_Professional_Certificate_0.pdf">Web Applications</a>
                    <small>September 26, 2016 </small>
                  </h3>
                  Microsoft Certified Solutions Associate
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

export default {
  props: {
    editor: { type: Boolean },
    certificate: { type: Array, default: () => ([]) }
  }
}
</script>
<style scoped>

</style>
