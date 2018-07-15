<template>
  <div class="regen-container">
    <el-checkbox-group
      v-model="selectedTags"
    >
      <el-checkbox
        v-for="tag in tags"
        :label="tag"
        :key="tag"
      >
      </el-checkbox>

    </el-checkbox-group>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import TagService from '../../service/TagService'

  import env from '@/config/env'

  export default {
    data () {
      return {
        tags: [],
        selectedTags: []
      }
    },
    methods: {
      ...mapActions({
        setSelectedTags: 'setSelectedTags'
      }),
      async getTagsFromServer () {
        const res = await TagService.getAll(this)
        if (res.code === env.RESP_CODE.SUCCESS) {
          this.tags = res.msg
        }
      }
    },
    watch: {
      selectedTags () {
        this.setSelectedTags(this.selectedTags)
      }
    },
    mounted () {
      this.getTagsFromServer()
    }
  }
</script>
