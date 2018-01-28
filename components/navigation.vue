<template>
  <b-navbar toggleable="md" type="light" fixed="top" class="custom-navbar">
    <div class="container">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">{{$store.state.resume.title}}</b-navbar-brand>
      <span class="navbar-text" style="padding-top: 10px;">{{$store.state.resume.subtitle}}</span>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item active href="#home">Home</b-nav-item>
          <b-nav-item href="#about">About Kananek</b-nav-item>
          <b-nav-item href="#work">My Works</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<style lang="scss">
.custom-navbar {
  height: 58px;
  max-height: 58px;
  border: none;
  margin-bottom: 0;
  background-color: #ffffff !important;
  .collapse {
    display: inherit;
  }
}

.custom-navbar .navbar-brand {
  color: #444;
  font-weight: normal;
  font-size: 20px;
}

.custom-navbar .nav li a {
  font-size: 12px;
  font-weight: normal;
  color: #656565;
  letter-spacing: 1px;
  -webkit-transition: all ease-in-out 0.4s;
  transition: all ease-in-out 0.4s;
  padding: 0;
  margin: 15px;
}

.custom-navbar .navbar-nav > li > a:hover,
.custom-navbar .navbar-nav > li > a:focus {
  background-color: transparent;
  color: #454545;
}

.custom-navbar .navbar-nav li a:after {
  content: "";
  display: block;
  width: 0px;
  height: 2px;
  margin: auto;
  background: transparent;
  transition: width .3s ease, background-color .3s ease;
}

.custom-navbar .navbar-nav li a:hover:after,
.custom-navbar .navbar-nav li > a.active:after {
  background: #000000;
  color: #ffffff;
  width: 100%;
}

.custom-navbar .navbar-nav li.active > a {
  background-color: transparent;
  color: #454545;
}

.custom-navbar .navbar-toggle {
  border: none;
  padding-top: 12px;
}

.custom-navbar .navbar-toggle {
  background-color: transparent;
}

.custom-navbar .navbar-toggle .icon-bar {
  background: #000000;
  border-color: transparent;
}

@media(min-width:768px) {
    .custom-navbar {
      border-bottom: 0;
      background: 0 0; 
    }
    .custom-navbar.top-nav-collapse-1 {
      background: #ffffff;
      box-shadow:0 10px 100px rgba(0,0,0,.1);
      padding: 10px 0;
    }
    .custom-navbar.top-nav-collapse-2 {
      background: #ffffff;
      box-shadow:0 20px 100px rgba(0,0,0,.1);
      padding: 10px 0;
    }
    .custom-navbar.top-nav-collapse-3 {
      background: #ffffff;
      box-shadow:0 40px 100px rgba(0,0,0,.2);
      padding: 10px 0;
    }

}

@media only screen and (max-width: 426px) {
  .custom-navbar {
    background-color: #ffffff;
    box-shadow:0 20px 100px rgba(0,0,0,.2);
    padding-top: 0px;
    padding-bottom: 5px;
    .navbar-brand {
      position: absolute;
      right: 9px;
      padding-top: 0px;
      top: 4px;
    }
    .navbar-text {
      padding-top: 0px;
      position: absolute;
      right: 25px;
      top: 18px;
    }
    .nav {
      padding-bottom: 10px;
      li a {
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
