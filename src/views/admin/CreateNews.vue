<template>
  <div>
    <NewsInput @onSaveBtnClick="onSaveBtnClick" :webTitle="title"></NewsInput>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import toastr from '../../../node_modules/toastr/build/toastr.min'

  import NewsService from '@/service/NewsService'
  import env from '@/config/env'

  import NewsInput from './components/NewsInput.vue'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'
  export default {
    data () {
      return {
        title: 'Create News'
      }
    },
    components: {
      Multiselect,
      NewsInput
    },
    methods: {
      async onSaveBtnClick (postData) {
        console.log(postData)
        let respBody = await NewsService.create(this, postData)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          toastr.success('创建成功')
        } else {
          toastr.error('创建失败')
        }
      }
    },
    mounted () {
      document.title = this.title
    }
  }
</script>

<style scoped>

</style>
