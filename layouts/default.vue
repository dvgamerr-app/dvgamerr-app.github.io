<template>
  <div class="resume-profile">
    <nuxt />
  </div>
</template>
<style lang="scss">
/*
Template Name: My Profile
Description: HTML5 / CSS3 One Page
Version: 1.0
Author: themehippo.com
*/
.resume-profile {
  font-family : 'Hind', sans-serif;
  font-size   : 15px;
  margin      : 0px;
  line-height : 1.8em;
  color       : #989898;
  font-weight : 300;
  background  : #f8f8f8;

  @-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  &:before {
    position: fixed;
    top: 500px;
    left: -100px;
    bottom: 0;
    content: '';
    width: 400px;
    height: 400px;
    border: 2px solid rgba(0, 0, 0, 0.05);
    z-index: -1;
    -webkit-transform: rotate(20deg);
    -moz-transform: rotate(20deg);
    -ms-transform: rotate(20deg);
    -o-transform: rotate(20deg);
    transform: rotate(20deg);
    -webkit-animation: rotating 120s linear infinite;
    -moz-animation: rotating 120s linear infinite;
    -ms-animation: rotating 120s linear infinite;
    -o-animation: rotating 120s linear infinite;
    animation: rotating 120s linear infinite;
  }
  &:after {
    position: fixed;
    top: -150px;
    right: -50px;
    bottom: 0;
    content: '';
    width: 400px;
    height: 600px;
    border: 2px solid rgba(0, 0, 0, 0.05);
    z-index: -1;
    -webkit-transform: rotate(-30deg);
    -moz-transform: rotate(-30deg);
    -ms-transform: rotate(-30deg);
    -o-transform: rotate(-30deg);
    transform: rotate(-30deg);
    -webkit-animation: rotating 120s linear infinite;
    -moz-animation: rotating 120s linear infinite;
    -ms-animation: rotating 120s linear infinite;
    -o-animation: rotating 120s linear infinite;
    animation: rotating 120s linear infinite;
  }
  /* --------------------------------------
  * Global Typography
  *------------------------------------------*/

  h1, h2, h3, h4, h5, h6 {
    margin : 0 0 15px;
    color  : #444444;
    }

  h1 {
    font-size   : 36px;
    line-height : 1.8em;
    font-weight : 700;
    }

  h2 {
    font-size   : 18px;
    line-height : 1.8em;
    font-weight : 700;
    }

  h3 {
    font-size   : 13px;
    line-height : 1.8em;
    font-weight : 700;
    }

  h4 {
    font-size   : 15px;
    line-height : 1.8em;
    font-weight : 500;
    }

  h5 {
    font-size   : 15px;
    line-height : 1.5em;
    font-weight : 500;
    }

  h6 {
    font-size   : 15px;
    line-height : 1.5em;
    }

  /* --------------------------------------
  * LINK STYLE
  *------------------------------------------*/
  a {
    color              : #ff5722;
    text-decoration    : none;
    -webkit-transition : all 0.3s ease 0s;
    -moz-transition    : all 0.3s ease 0s;
    -o-transition      : all 0.3s ease 0s;
    transition         : all 0.3s ease 0s;
    }

  a,
  a:active,
  a:focus,
  a:active {
    text-decoration : none;
    outline         : none
    }

  a:hover,
  a:focus {
    text-decoration : none;
    color           : #ff5722;
    }

  p {
    margin-bottom : 20px;
    }

  strong {
    color : #444444;
    }

  ul {
    margin     : 0;
    padding    : 0;
    list-style : none;
    }

  .header {
    padding    : 50px 0;
    margin     : 0;
    position   : relative;
    border-top : 5px solid #ff5722;
  }

  /*------------------
  * Button Style
  *------------------*/
  .btn {
    padding        : 14px 30px 11px;
    margin-bottom  : 0;
    font-size      : 14px;
    font-weight    : 500;
    border-radius  : 0;
    border         : 0;
    text-transform : uppercase;
    transition     : all .3s;
    }

  .btn-lg {
    font-weight : 700;
    font-size   : 24px;
    padding     : 15px 30px;
    }

  /*btn-primary*/
  .btn-primary {
    background-color : #ff5722;
    }

  .btn-primary:hover,
  .btn-primary:focus,
  .btn-primary:active:focus {
    background : #de4718;
    }

  /*btn-default*/
  .btn-default {
    color            : #2a54f5;
    background-color : transparent;
    border           : 2px solid #2a54f5;
    }

  .btn-default:hover,
  .btn-default:focus,
  .btn-default:active:focus {
    background   : #2a54f5;
    color        : #ffffff;
    border-color : #2a54f5;
    }

  button:focus,
  .btn:focus,
  .btn:active:focus {
    outline : none;
    }

  /* --------------------
  *  main Wrapper
  * -------------------*/
  #main-wrapper {
    overflow : hidden;
    }

  /*-------------------
  * Section Wrapper
  *-------------------*/
  .section-wrapper {
    padding : 50px 0;
    }

  @media (max-width : 768px) {
    .section-wrapper {
        padding : 20px 0;
        }
    }

  @media (max-width : 600px){
    .section-wrapper {
        padding : 20px;
        }
    }

  /*---------------------------
  * Section Title
  *---------------------------*/
  .section-title {
    margin-right : 30px;
    text-align   : right;
    }

  .section-title h2 {
    font-size      : 14px;
    margin-bottom  : 5px;
    color          : #bbbbbb;
    text-transform : uppercase;
    }

  @media (max-width: 768px) {
    .section-title{
        text-align: left;
        }
    .section-title h2{
        font-size: 18px;
        margin-bottom: 20px;
        }
    }

  /*-----------------
  * Review
  *-----------------*/

  #review .owl-wrapper .owl-item{
    padding-right: 20px;
    }
  #review .media-left{
    padding-right: 15px;
    }
  #review .media-left img{
    width: 50px;
    border-radius: 3px;
    }

  #review .user-name{
    color: #444;
    font-weight: 500;
    }

  #review .review-text{
    margin: 10px 0;
    }

  /* rating */

  #review .rating{
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    }

  #review .rating::after{
    content: attr(data-star_rating);
    padding: 3px 5px 0;
    color: #444;
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    border-radius: 2px;
    margin-left: 5px;
    }

  #review .rating-total{
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    position: relative;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    width: 80px;
    height: 16px;
    margin-top: -2px;
    }

  #review .rating-progress {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    }

  #review .rating-progress::after,
  #review .rating-progress::before{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: 80px 16px;
    background-repeat: no-repeat;
    content: "";
  }

  // #review .rating-progress::before{
  //   background-image: url('~/assets/rating-background.svg');
  // }

  // #review .rating-progress::after{
  //   background-image: url('~/assets/rating-foreground.svg');
  // }

  #review .rating-progress.rate-0::after{
    width: 0;
  }

  /* Rating Percent */

  #review .rating-progress.rate-1::after{
    width: 20%;
    }

  #review .rating-progress.rate-2::after{
    width: 40%;
    }

  #review .rating-progress.rate-3::after{
    width: 60%;
    }

  #review .rating-progress.rate-4::after{
    width: 80%;
    }

  #review .rating-progress.rate-5::after{
    width: 100%;
    }

  /* Pagination */

  .owl-controls .owl-page{
    display: inline-block;
    }

  .owl-controls .owl-page span{
    width: 4px;
    height: 4px;
    background: #000;
    margin-right: 10px;
    display: block;
    border-radius: 100%;
    opacity: .3;
    }

  .owl-controls .owl-page.active span{
    opacity: 1;
    box-shadow: 0 0 0 1px #000;
    }

  /*-------------------
  * Market Place Profile
  *-------------------*/
  .profile-item{
    margin-bottom: 10px;
    }

  .profile-item .media-object{
    width: 30px;
    }

  .profile-item  a{
    color: #444;
    }

  .profile-item  a:hover{
    color: #ff5722;
    }

  /*-------------------
  * Content Item
  *-------------------*/

  .content-item {
    margin-bottom : 20px;
    }

  .content-item h3 {
    margin         : 0 0 10px;
    line-height    : 1;
    font-weight    : bold;
    text-transform : uppercase;
    }

  .content-item h4 {
    margin      : 0;
    line-height : 1;
    }

  .content-item small {
    color : #888888;
    }

  /*-------------------
  * Contact
  *-------------------*/

  .section-contact address strong {
    font-size      : 13px;
    text-transform : uppercase;
    }

  .feedback-form {
    margin-top : 50px;
    }

  /*-------------------
  * Form Style
  *-------------------*/
  .section-contact {
    .form-group label {
      font-weight : normal;
      font-size   : 13px;
    }

    input.form-control {
      height        : 46px;
    }

    textarea.form-control, input.form-control {
      line-height   : 46px;
      padding       : 0 15px;
      color         : #969595;
      border-color  : #F8F8F8;
      border-radius : 0;
      box-shadow    : none;
      box-sizing    : border-box;
      background    : #FFFFFF;
    }

    .form-control:focus,
    .form-control:active {
      box-shadow   : none;
      background   : #FFFFFF;
      border-color : #999999;
    }
  }
  /* --------------------------------------------
  *   Footer
  *---------------------------------------------- */

  /* Copyright */

  .footer {
    padding : 30px 0;
    text-align : right;
    }

  .footer .copyright-section {
    font-size  : 13px;
    }

  .footer .copyright-section .copytext {
    font-weight : 400;
    display     : block;
    }

  @media (max-width : 768px) {
    .footer {
        text-align: left;
        }
    }

  @media (max-width : 600px){
    .footer {
        padding-left: 20px;
        padding-right: 20px;
        }
    }

  .pagebreak {
    margin: 0px;
    page-break-before: always;
  }

  @media print {
    .section-wrapper {
      padding: 20px 0 !important;
    }
    .no-print {
      display: none;
    }

    .print-only {
      display: block !important;
    }

    body, h1, h2, h3, h4, h5, h6 {
      background: #fff;
      color: #444 !important;
    }

    body:before,
    body:after {
      display: none !important;
    }

  }

  .clear-p > p {
    margin-bottom: 0px !important;
  }

}
</style>
