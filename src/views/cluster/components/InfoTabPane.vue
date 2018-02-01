<template>
  <div>
    <div class="status-panel">
      <div class="status-panel__title">Welcome to the New Environment!</div>
      <div class="status-panel__instruction">You must add at least one node to your environment in order to deploy.</div>
      <Button v-if="clusterData.status.state === 'New'" @click="addNodes" icon="plus-round" type="primary">Add Nodes</Button>
    </div>
    <Row class="info-panel">
      <Col span="12">
        <div class="info-panel__title">Summary</div>
        <div class="info-title">{{translateKey('content', 'clusterCardName')}}</div>
        <div class="info-value">{{clusterData.metadata.name}}</div>
        <div class="info-title">{{translateKey('content', 'clusterCardStatus')}}</div>
        <div class="info-value">{{clusterData.status.state}}</div>
        <div class="info-title">{{translateKey('content', 'clusterCardType')}}</div>
        <div class="info-value">{{clusterData.spec.type}}</div>
        <div class="info-title">{{translateKey('content', 'clusterCardProvisioner')}}</div>
        <div class="info-value">{{clusterData.spec.provisionerSpec.name}}</div>
      </Col>
      <Col span="12">
        <div class="info-panel__title">Nodes</div>
        <div v-if="nodeNumber === 0" style="font-size: 14px; font-weight: 400; line-height: 17px;">No nodes found in this environment. Please add nodes in the Nodes tab and try again.</div>
        <div v-else>You have Nodes WIP</div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    clusterData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      nodeNumber: 1
    }
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    addNodes () {
      this.$emit('addNodes')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .status-panel {
    border: 1px solid #d3d3d3;
    border-radius: 4px;
    padding: 10px;
    margin: 0 0 20px;
    &__title {
      font-size: 20px;
      font-weight: 400;
      color: #525960;
    }
    &__instruction {
      font-size: 16px;
      line-height: 24px;
      color: #525960;
      margin-bottom: 8px;
    }
  }
  .info-panel {
    background: #e7f0f2;
    width: calc(100% + 32px);
    margin-left: -16px;
    padding: 10px 16px;
    &__title {
      font-size: 24px;
      font-weight: bold;
      color: #525960;
      // color: #fff;
      margin-bottom: 10px;
    }
    .info-title {
      width: 45%;
      height: auto;
      min-height: 30px;
      line-height: 17px;
      // color: #fff;
      font-size: 14px;
      font-weight: 600;
      float: left;
      margin-bottom: 4px;
    }
    .info-value {
      width: 55%;
      height: auto;
      min-height: 30px;
      line-height: 17px;
      // color: #fff;
      font-size: 14px;
      font-weight: 400;
      float: left;
      margin-bottom: 4px;
    }
  }
</style>
