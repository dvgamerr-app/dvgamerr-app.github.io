<template>
  <div>
    <nav class="navbar navbar-light bg-light fixed-top custom-navbar">
      <div class="container">
        <a class="navbar-brand" href="#">
          <span class="navbar-text" style="padding-top: 10px;">Kananek T.</span>
        </a>
        <ul class="nav ml-auto" id="nav_collapse">
          <li class="nav-item">
            <a class="nav-link active" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#home">About Kananek</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#about">My Works</a>
          </li>
        </ul>
      </div>
    </nav>
    <nuxt/>
    <div class="preloader">
      <div class="spinner">
        <span class="spinner-rotate"></span>
      </div>
    </div>
  </div>
</template>
