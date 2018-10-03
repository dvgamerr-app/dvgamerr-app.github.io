<template>
<div class="preloader">
  <div class="spinner">
    <span class="spinner-rotate"></span>
  </div>
</div>
</template>

<style lang="scss">
.spinner {
  transition: all 1s ease;
	&.v-enter, &.v-leave {
  	overflow: hidden;
    opacity: 0;
	}
}
</style>