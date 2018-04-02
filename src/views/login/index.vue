<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-container">
      <Card :bordered="false">
        <p slot="title">
          <img :src="imgLogo" alt="logo" style="max-width: 100%; max-height: 100%" />
        </p>
        <div class="form-container">
          <Form ref="loginForm" :model="form" :rules="rules" autocomplete="on">
            <FormItem prop="username">
              <Input v-model="form.username" v-bind:placeholder="translateKey('input_placeholder_login_username')" autocomplete="on">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" v-bind:placeholder="translateKey('input_placeholder_login_password')" autocomplete="on">
                <span slot="prepend">
                  <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" :loading="loading" long>{{ translateKey('button_login') }}</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import imgLogo from '@/assets/logo_images/logo.png'

export default {
  data () {
    return {
      imgLogo,
      loading: false,
      form: {
        username: '',
        passowrd: ''
      },
      rules: {
        username: [{ required: true, message: 'Please fill in the user name', trigger: 'blur' }],
        password: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUser', this.form).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  .ivu-card-head {
    text-align: center;
    padding: 14px;
    p {
      height: 70px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  min-height: 517px;
  background: #2d3a4b;
  &-container {
    width: 400px;
    margin: auto;
    padding: 100px 0;
    .form-container {
      padding-top: 15px;
    }
  }
}
</style>
