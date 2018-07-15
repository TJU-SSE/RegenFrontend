<template>
  <div class="footer regen-container">
    <div class="footer-row">
      <a>COPYRIGHT&TRADEWORK</a>
      <a>HELP/FAQ</a>
      <a>JOIN US</a>
      <div>
        <i class="fa fa-weixin fa-lg"></i>
        <i class="fa fa-weibo fa-lg"></i>
        <i class="fa fa-instagram fa-lg"></i>
        <i class="fa fa-youtube fa-lg"></i>
        <i class="fa fa-facebook-square fa-lg"></i>
        <i class="fa fa-pinterest-square fa-lg"></i>
      </div>
    </div>
    <div class="footer-row2 bold-font">
      <span class="footer-address">{{footerLink}}</span>
      <div v-if="isLogin" class="edit-container">
        <el-button type="text" @click="handleEditBtnClick">编辑地址</el-button>
        <el-dialog
          title="编辑地址"
          :visible.sync="dialogVisible"
        >
          <el-form
            ref="form"
            :model="postData"
            :rules="rules"
            label-width="'80px'"
          >
            <el-form-item label="地址" prop="address">
              <el-input v-model="postData.address"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'

  import env from '@/config/env'
  import ConfigService from '../../service/ConfigService'

  export default {
    name: 'navFooter',
    data () {
      return {
        dialogVisible: false,
        postData: {
          address: ''
        },
        rules: {
          address: [
            { required: true, message: '请输入地址', trigger: 'change' }
          ]
        },
        footerLink: ''
      }
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      async handleSubmit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            const res = await ConfigService.update(this, this.postData.address)
            if (res.code === env.RESP_CODE.SUCCESS) {
              this.dialogVisible = false
              this.getFooterLinkFromServer()
              toastr.success('更新成功！')
            } else {
              toastr.error('更新失败！')
            }
          } else {
            return false
          }
        })
      },
      async getFooterLinkFromServer () {
        const res = await ConfigService.get(this)
        if (res.code === env.RESP_CODE.SUCCESS) {
          this.footerLink = res.msg.footerLink
        }
      },
      handleEditBtnClick () {
        this.postData.address = this.footerLink
        this.dialogVisible = true
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      this.getFooterLinkFromServer()
    }
  }
</script>

<style scoped lang="scss">
  .footer {
    height: 70px;
    font-size: .8em;
    margin-top: 50px;

    .footer-row2 {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
    }
  }
  .footer .footer-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
  }
  .footer .footer-row a:hover, .footer .footer-row i:hover {
    font-weight: bold;
    cursor: pointer;
  }

  .footer-address {
    font-size: 16px;
  }
  .edit-container {
    margin-left: 12px;
  }

  @media screen and (max-width: 780px) {
    .footer {
      font-size: .5em;

      .footer-row {
        flex-direction: column;
      }
      .footer-row2 {
        flex-direction: column;
      }
    }
  }
</style>
