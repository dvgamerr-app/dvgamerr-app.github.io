<template>
  <div>
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-9 col-md-9 col-lg-7 mr-0" href="#">DevOps</a>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-9 col-lg-7 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <nuxt-link class="nav-link" to="/">
                  <span data-feather="home"></span>
                  Dashboard <span class="sr-only">(current)</span>
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" to="/inbound-transfer-services">
                  <span data-feather="bar-chart-2"></span>
                  Inbound2BTS Services
                </nuxt-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="layers"></span>
                  Integrations
                </a>
              </li>
            </ul>

            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Saved reports</span>
              <a class="d-flex align-items-center text-muted" href="#">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Current month
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Last quarter
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Social engagement
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Year-end sale
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" class="col-md-27 ml-sm-auto col-lg-29 pt-3 px-4 mb-3">
          <nuxt/>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted () {
  }
}
</script>

<style>

</style>
