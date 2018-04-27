<template>
  <div class="errPage-container">
    <Card>
      <Row class="errorPage-row">
        <Col :span="12">
          <Button type="primary" size="large" @click="back" icon='chevron-left'>{{ translateKey('button_401_back') }}</Button>
          <h1 class="text-jumbo text-ginormous">Oops!</h1>
          <h2>{{translateKey('page_401_content_title')}}</h2>
          <h4 class="text-content">{{translateKey('page_401_content_subtitle')}}</h4>
        </Col>
        <Col :span="12">
          <img :src="errGif"alt="Girl has dropped her ice cream.">
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'page401',
  data () {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    back () {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboar' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 100%;
    height: 100%;
    padding: 16px;
    .errorPage-row {
      width: 600px;
      margin: 30px auto;
    }
    .text-jumbo {
      font-size: 46px;
      font-weight: 700;
      color: #484848;
      margin: 10px 0;
    }
    .text-content {
      margin-top: 10px;
    }
  }
</style>
