<template>
  <transition name="fade">
    <div v-if="loading" id="preloader">
      <div id="status"><div class="status-mes"></div></div>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    loading: true
  }),
  methods: {
    start() {
      console.log('start')
      this.loading = true
    },
    finish() {
      console.log('finish')
      this.loading = false
    }
  }
}
</script>

<style scoped>
/* ---------------------------------------------- /*
* Preloader
/* ---------------------------------------------- */

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

#preloader {
  background : #ccc;
  bottom     : 0;
  left       : 0;
  position   : fixed;
  right      : 0;
  top        : 0;
  z-index    : 9999;
  }

#status,
.status-mes {
  background-image    : url('~assets/puff.svg');
  background-position : center;
  background-repeat   : no-repeat;
  height              : 200px;
  left                : 50%;
  margin              : -100px 0 0 -100px;
  position            : absolute;
  top                 : 50%;
  width               : 200px;
  }

.status-mes {
  background : none;
  left       : 0;
  margin     : 0;
  text-align : center;
  top        : 65%;
  }

</style>
