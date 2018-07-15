<template>
  <div>
    <ImgGridItems :imgGridItems="imgGridItems"></ImgGridItems>
    <p class="hidden">{{secondMenuCom}}</p>
  </div>
</template>

<script>
  import ImgGridItems from './components/ImgGridItems.vue'

  export default {
    data: function () {
      return {
        title: 'photography',
        imgGridItems: [],
        secondMenu: this.$route.params.secondMenu
      }
    },
    components: {
      ImgGridItems
    },
    methods: {
      getImgGridItems: function (count) {
        this.imgGridItems = []
        for (let i = 1; i <= count; i++) {
          this.imgGridItems.push({
            imgUrl: '../../static/img/talent' + i + '.jpg',
            title: 'Fabio Chizzola',
            desc: 'Photography ' + this.$route.params.secondMenu,
            designerId: 0
          })
        }
      }
    },
    mounted () {
      document.title = this.title
      this.getImgGridItems(9)
    },
    computed: {
      secondMenuCom: function () {
        this.getImgGridItems(9)
        return this.$route.params.secondMenu
      }
    }
  }
</script>

<style>
</style>
