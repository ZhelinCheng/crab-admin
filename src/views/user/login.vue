<template>
  <div class="login">
    <el-form :model="form" ref="loginForm" class="login-form">
      <el-form-item prop="name" :rules="{ validator: rulesName, trigger: 'blur' }">
        <el-input v-model="form.name" placeholder="用户名" type="text">
          <i
            class="el-icon-user el-input__icon"
            slot="prefix"
          >
          </i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :rules="{ validator: rulesPassword, trigger: 'blur' }">
        <el-input v-model="form.password" placeholder="密码" type="password">
          <i
            class="el-icon-unlock el-input__icon"
            slot="prefix"
          >
          </i>
        </el-input>
      </el-form-item>
      <el-button class="login-form__submit" @click="submitForm" type="primary">{{isLogin ? '登录' : '注册'}}</el-button>
      <div class="login-other">
        <router-link class="login-other_reg" :to="isLogin ? '/user/registered' : '/user/login'">注册账号</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { login, registered } from '@/request'

export default {
  name: 'login',
  data () {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    isLogin () {
      return this.$route.name === 'userLogin'
    }
  },
  methods: {
    rulesName (rule, value, callback) {
      if (!/^\w{5,16}$/.test(value)) {
        return callback(new Error('用户名输入错误'))
      }
      callback()
    },

    rulesPassword (rule, value, callback) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
        return callback(new Error('密码输入错误'))
      }

      callback()
    },

    async submitForm () {
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          try {
            const isLogin = this.isLogin
            const res = isLogin ? await login(this.form) : await registered(this.form)
            if (isLogin && typeof res === 'string') {
              localStorage.setItem('CRAB_TOKEN', 'Bearer ' + res)
              this.$router.push('/tasks')
              this.$message.success('登录成功，等待跳转！')
            } else if (!isLogin && res) {
              this.$router.push('/user/login')
              this.$message.success('注册成功，请登录！')
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "login";
</style>
