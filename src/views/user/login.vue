<template>
  <div class="login">
    <el-form :model="form" ref="loginForm" class="login-form">
      <el-form-item prop="name" :rules="{ validator: rulesFn, trigger: 'blur' }">
        <el-input v-model="form.name" placeholder="用户名" type="text">
          <i
            class="el-icon-user el-input__icon"
            slot="prefix"
          >
          </i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :rules="{ validator: rulesFn, trigger: 'blur' }">
        <el-input v-model="form.password" placeholder="密码" type="password">
          <i
            class="el-icon-unlock el-input__icon"
            slot="prefix"
          >
          </i>
        </el-input>
      </el-form-item>
      <el-button class="login-form__submit" @click="submitForm" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
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
  methods: {
    rulesFn (rule, value, callback) {
      const field = rule.field
      if (field === 'name' && !/^\w{5,16}$/.test(value)) {
        return callback(new Error('用户名输入错误'))
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
        return callback(new Error('密码输入错误'))
      }

      callback()
    },

    submitForm () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
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
