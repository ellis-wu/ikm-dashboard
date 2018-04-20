<template>
  <Card :padding="0">
    <div class="info-card-con">
      <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
        <Row class="height-100" type="flex" align="middle" justify="center">
          <Icon :type="iconType" :size="iconSize"></Icon>
        </Row>
      </Col>
      <Col span="16" class="height-100">
        <Row type="flex" align="middle" justify="center" class="height-100">
          <count-up class="infor-card-count user-created-count"
            :id-name="idName"
            :end-val="endVal"
            :unit="unit"
            :color="color"
            :countSize="countSize"
            :countWeight="countWeight">
            <p class="infor-sub-text" slot="intro">{{ introText }}</p>
          </count-up>
        </Row>
      </Col>
    </div>
  </Card>
</template>

<script>
import countUp from './countUp.vue'

export default {
  name: 'inforCard',
  components: {
    countUp
  },
  props: {
    idName: String,
    endVal: Number,
    unit: String,
    color: String,
    iconType: String,
    introText: String,
    countSize: {
      type: String,
      default: '30px'
    },
    countWeight: {
      type: Number,
      default: 700
    },
    iconSize: {
      type: Number,
      default: 40
    }
  },
  data () {
    return {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .infor-card-icon-con {
    height: 100%;
    border-radius: 3px 0 0 3px;
  }
  .height-100 {
    height: 100%;
  }
  .info-card-con {
    height: 100px;
  }
  .infor-main-text {
    font-size: 30px;
    font-weight: 700;
  }
  .infor-sub-text {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #c8c8c8;
  }
</style>
