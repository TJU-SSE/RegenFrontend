<template>
    <div>
    <el-row><p></p></el-row>
    <el-row><p></p></el-row>
    <el-row><p></p></el-row>
    <el-row>
    <el-col :span="4"><p></p></el-col>
    <el-col :span="16">
    <div class="tagtable makecenter">
        <el-table
        :data="tags"
        stripe
        style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="标签"
            width="180">
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="info"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>        
        </el-table>        
    </div>
    </el-col>
    <!-- <el-col :span="8"><p></p></el-col> -->
    </el-row>


    <el-dialog title=“修改标签” :visible.sync="dialogFormVisible">
        <el-form :model="form">
        <el-form-item label="标签名称" :label-width="formLabelWidth">
            <el-input v-model="tagname.name" auto-complete="off"></el-input>
        </el-form-item>   
        </el-form>
          <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="changetag">确 定</el-button>
  </div>
    </el-dialog>
    </div>
</template>

<script>
  import { markdownEditor } from 'vue-simplemde'
  import Multiselect from 'vue-multiselect'
  import VueImgInputer from 'vue-img-inputer'
  import toastr from 'toastr/build/toastr.min'

  import TagService from '@/service/TagService'
  import env from '@/config/env'

  import InputVodal from '@/views/components/InputVodal'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'
  export default {
    data () {
      return {
        tags: [],
        // tags: [{id: 0, name: 'fasion'}],
        dialogFormVisible: false,
        tagname: {'name': ''},
        selectedtag: -1
      }
    },
    components: {
      markdownEditor,
      Multiselect,
      VueImgInputer,
      InputVodal
    },
    methods: {
      async getTags () {
        let resp = await TagService.getAll(this)
        if (resp.code === env.RESP_CODE.SUCCESS) {
          this.tags = resp.msg
        } else {
          toastr.error('加载tags失败！')
        }
      },
      handleEdit (index, row) {
        this.selectedtag = row.id
        this.dialogFormVisible = true
      },
      handleDelete (index, row) {
      },
      changetag () {
        this.dialogFormVisible = false
      }
    },
    async mounted () {
      await this.getTags()
    }
  }
</script>

<style scoped lang="scss">
  .tagtable {
    width: 600px;
  }
  .makecenter{
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-around;

  }
</style>
