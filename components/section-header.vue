<template>
<header class="header">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="profile-img">
          <img src="~assets/icon.jpg" class="img-responsive" alt=""/>
        </div>
        <!-- Profile Image -->
      </div>
      <div class="col-md-9">
        <div class="name-wrapper">
          <h1 class="name">Damian Keller</h1>
          <span>Freelance Web Designer</span>
        </div>
        <p>
          Credibly embrace visionary internal or "organic" sources and business benefits. Collaboratively
          integrate efficient portals rather than customized customer service. Assertively deliver
          frictionless services via leveraged interfaces. Conveniently evisculate accurate sources and
          process-centric expertise.Energistically fabricate customized imperatives through cooperative
          catalysts for change.
        </p>
        <div class="row">
          <div class="col-md-3">
            <div class="personal-details">
              <strong>OCTOBER 17, 1996</strong>
              <small>BIRTH</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="personal-details">
              <strong>UNITED KINGDOM</strong>
              <small>NATIONALITY</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="personal-details">
              <strong>ENGLISH <span>(NATIVE)</span>, FRENCH <span>(INTERMEDIATE)</span></strong>
              <small>LANGUAGE</small>
            </div>
          </div>
        </div>

        <ul class="social-icon">
          <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
          <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
          <li><a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
          <li><a href="#"><i class="fa fa-slack" aria-hidden="true"></i></a></li>
          <li><a href="#"><i class="fa fa-dribbble" aria-hidden="true"></i></a></li>
        </ul>
      </div>
    </div>
  </div>
</header>
</template>
<script>
export default {
  methods: {
    setLanguage (lang) {
      window.location.reload()
    }
  }
}
</script>
