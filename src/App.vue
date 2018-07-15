<template>
  <div id="app">
    <router-view name="headerBar"></router-view>
    <router-view name="mainPage"></router-view>
    <router-view name="footerBar"></router-view>
  </div>
</template>

<script>
  import toastr from '../node_modules/toastr/build/toastr.min'
  export default {
    name: 'app',
    mounted () {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
      }
    }
  }
</script>

<style>
  @import "../node_modules/toastr/build/toastr.min.css";
  #app {
    font-family: 'RopaSansPro', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  * {
    font-weight: normal;
    font-style: normal;
    font-size: 100%;
    font-family: Arial, FZLTHJW;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p,
  blockquote, pre, a, abbr, acronym, address, big,
  cite, code, del, dfn, em, font, img,
  ins, kbd, q, s, samp, small, strike,
  strong, sub, sup, tt, var, dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  center, u, b, i {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    vertical-align: baseline
  }
  body {
    line-height: 1
  }
  :focus {
    outline: 0
  }
  /*ol, ul {*/
    /*list-style: none*/
  /*}*/
  ol, ul {
    margin-left: 30px;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0
  }
  blockquote:before, blockquote:after, q:before, q:after {
    content: ''
  }
  blockquote, q {
    quotes: "" ""
  }
  input, textarea {
    margin: 0;
    padding: 0
  }
  hr {
    margin: 0;
    padding: 0;
    border: 0;
    color: #000;
    background-color: #000;
    height: 1px
  }

  @font-face {
    font-family: Arial;
    src: url('../static/font/Arial.ttf');
  }
  @font-face {
    font-family: FZLTHJW;
    src: url('../static/font/FZLTHJW.ttf');
  }
  @font-face {
    font-family: FZQKBYSJW;
    src: url('../static/font/FZQKBYSJW.ttf');
  }
  @font-face {
    font-family: HelveticaNeueLt;
    src: url('../static/font/HelveticaNeueLt.ttf');
  }
  @font-face {
    font-family: Seravek;
    src: url('../static/font/Seravek-Light.otf');
  }
</style>
