<template>
<section id="home">
  <div class="container">
    <div class="row">
      <div class="col-md-9 md-offset-3 col-sm-12">
        <img src="~assets/icon.jpg" class="img-fluid rounded-circle" alt="Kananek Thongkam">
      </div>
      <div class="col-md-24 col-sm-24">
        <h1 v-html="$store.state.resume.introduce"></h1>
        <a :href="$store.state.resume.resume.file" target="_blank" class="btn btn-default section-btn" v-text="$store.state.resume.resume.button"></a>
      </div>
    </div>
  </div>
</section>
</template>

<style>
#home {
  display: -webkit-box;
  display: -webkit-flex;
   display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
   align-items: center;
  height: 100vh;
  position: relative;
  padding-top: 62px;
}

#home img {
  width: 120px;
  height: 120px;
}

.section-btn {
  background: #d7b065;
  border: none;
  border-radius: 50px;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1.6px;
  padding: 14px 28px 14px;
  margin-top: 32px;
}

.section-btn:focus,
.section-btn:hover {
  background: #000000;
  color: #ffffff;
}

</style>