(function ($) {
  'use strict';
    var scrollShadow = function() {
      if (($('.navbar').offset() || {}).top < 30) {
        $('.navbar.fixed-top').removeClass('top-nav-collapse-1');
        $('.navbar.fixed-top').removeClass('top-nav-collapse-2');
        $('.navbar.fixed-top').removeClass('top-nav-collapse-3');
      } else if (($('.navbar').offset() || {}).top < 60) {
        $('.navbar.fixed-top').removeClass('top-nav-collapse-2');
        $('.navbar.fixed-top').removeClass('top-nav-collapse-3');
        $('.navbar.fixed-top').addClass('top-nav-collapse-1');
      } else if (($('.navbar').offset() || {}).top < 120) {
        $('.navbar.fixed-top').removeClass('top-nav-collapse-1');
        $('.navbar.fixed-top').removeClass('top-nav-collapse-3');
        $('.navbar.fixed-top').addClass('top-nav-collapse-2');
      } else {
        $('.navbar.fixed-top').removeClass('top-nav-collapse-1');
        $('.navbar.fixed-top').removeClass('top-nav-collapse-2');
        $('.navbar.fixed-top').addClass('top-nav-collapse-3');
      }
    }


    // PRE loader
    $(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });


    //Navigation Section
    $('.navbar-collapse a').on('click',function(){
      $('.navbar-collapse').collapse('hide');
    });

    scrollShadow();
    $(window).scroll(scrollShadow);


    // Smoothscroll js
    $(function() {
      $('.custom-navbar a, #home a').bind('click', function(event) {
        var $anchor = $(this);
        $('.custom-navbar a').removeClass('active');
        $anchor.addClass('active');
        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 20
        }, 1000);
        event.preventDefault();
      });
    });  

    // WOW Animation js
    // new WOW({ mobile: false }).init();

})(jQuery);
