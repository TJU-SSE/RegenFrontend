<template>
  <main class="regen-container">
    <div class="login-box">
      <div class="form-group">
        <h3 class="medium-text">登录</h3>
      </div>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="input username" v-model="loginData.username">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="input password" v-model="loginData.password">
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-block btn-danger" @click="onLoginBtnClick">Login</button>
      </div>
    </div>
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import toastr from '../../node_modules/toastr/build/toastr.min'
  import UserService from '@/service/UserService'

  export default {
    data () {
      return {
        title: 'login',
        loginData: {
          username: '',
          password: ''
        }
      }
    },

    methods: {
      ...mapActions({
        updateUsername: 'updateUsername'
      }),
      ...mapGetters({
        getUsername: 'getUsername'
      }),
      async onLoginBtnClick () {
        if (this.loginData.username === '' || this.loginData.password === '') {
          toastr.error('用户名和密码不能为空！')
          return
        }
        let checkLogin = await UserService.login(this, this.loginData)
        if (!checkLogin) {
          toastr.error(' 密码错误！')
          return
        }
        toastr.success('登录成功!')
        this.updateUsername(this.loginData.username)
        this.$router.push({
          name: 'home'
        })
      }
    },

    mounted () {
      document.title = this.title
    }
  }
</script>

<style scoped lang="scss">
  @import "../../static/css/common";
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 500px;

    .login-box {
      padding: 3% 3% 5% 3%;
      border: 1px solid $borderColor;
      border-radius: 5px;

      .form-group {
        margin: 20px 0;
        width: 30%;
        min-width: 300px;
      }
    }
  }

  .medium-text {
    text-align: center;
  }
</style>
