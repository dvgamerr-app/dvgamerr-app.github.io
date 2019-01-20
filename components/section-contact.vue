<template>
<section class="section-contact pt-3 pb-3" v-if="1 > 0">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>Contact</h2>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div class="col-md-3">
            <address>
              <strong>Address</strong><br>
              1355 Market Street, Suite 900<br>
              San Francisco, CA 94103
            </address>
          </div>
          <div class="col-md-3">
            <address>
              <strong>Phone Number</strong><br>
              +61 3 8376 6284
            </address>
          </div>
          <div class="col-md-3">
            <address>
              <strong>Mobile Number</strong><br>
              987 654 321
            </address>
          </div>
          <div class="col-md-3">
            <address>
              <strong>Email</strong><br>
              <a href="mailto:#">coffee@amelie.me</a>
            </address>
          </div>
        </div>
        <!--.row-->
        <div class="feedback-form">
          <h3>GET IN TOUCH</h3>

          <form id="contactForm" action="sendemail.php" method="POST">
            <div class="form-group">
              <input type="text" name="name" required="" class="form-control" id="InputName" placeholder="Full Name">
            </div>
            <div class="form-group">
              <input type="email" name="email" required="" class="form-control" id="InputEmail" placeholder="Email">
            </div>
            <div class="form-group">
              <input type="text" name="subject" class="form-control" id="InputSubject" placeholder="Subject">
            </div>
            <div class="form-group">
              <textarea class="form-control" rows="4" required="" name="message" id="message-text" placeholder="Write message"></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
        <!-- .feedback-form -->

      </div>
    </div>
    <!--.row-->

  </div>
</section>
</template>
<script>
import marked from 'marked'

export default {
  props: {
    work: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    markedown (text) {
      return marked(text)
    }
  }
}
</script>
