<template>
  <div>
    <ImgGridItems :imgGridItems="imgGridItems"></ImgGridItems>
  </div>
</template>

<script>
  import ImgGridItems from './components/ImgGridItems.vue'

  export default {
    data: function () {
      return {
        title: 'talent',
        imgGridItems: []
      }
    },
    components: {
      ImgGridItems
    },
    methods: {
      getImgGridItems: function (count) {
        for (let i = 1; i <= count; i++) {
          this.imgGridItems.push({
            imgUrl: '../../static/img/talent' + i + '.jpg',
            title: 'Fabio Chizzola',
            desc: 'Talent',
            designerId: 1
          })
        }
      }
    },
    mounted () {
      document.title = this.title
      this.getImgGridItems(9)
    }
  }
</script>

<style>
</style>
