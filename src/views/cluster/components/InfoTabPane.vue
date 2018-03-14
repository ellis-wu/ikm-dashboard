<template>
  <div>
    <div class="status-panel">
      <div class="status-panel__title">Welcome to the New Environment!</div>
      <div class="status-panel__instruction">You must add at least one node to your environment in order to deploy.</div>
      <Button v-if="!clusterData.status || clusterData.status.state === 'New'" @click="addNodes" icon="plus-round" type="primary">Add Nodes</Button>
      <Button v-else icon="upload" type="primary">Deploy</Button>
    </div>

    <Row :gutter="20" type="flex">
      <Col span="12">
        <Card class="info-panel">
          <p slot="title" style="font-size: 18px;">{{ translateKey('card_information_tabpane_title_summary') }}</p>
          <template v-if="!clusterData.status || clusterData.status.state === 'New'">
            <tag slot="extra" :color="stateColors['New']"  style="margin: 0">New</tag>
          </template>
          <tag v-else slot="extra" :color="stateColors[clusterData.status.state]"  style="margin: 0">{{ clusterData.status.state.toUpperCase() }}</tag>
          <Row v-for="(item, key) in summaryData" :key="key" :gutter="20">
            <Col span="12">
              <div class="info-title">{{ translateKey('card_information_tabpane_item_' + key) }}</div>
            </Col>
            <Col span="12">
              <div class="info-value">{{ item }}</div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span="12">
        <Card class="info-panel">
          <p slot="title">{{ translateKey('card_information_tabpane_title_nodes') }}</p>
          <p>[WIP] You did not have any nodes.</p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
const stateColors = {
  New: '#4ECDC4',
  Preparing: '#1A535C',
  Ready: '#FFCB08',
  Deploying: '#FF6B6B'
}

export default {
  props: {
    clusterData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      nodeNumber: 1,
      stateColors,
      summaryData: {}
    }
  },
  watch: {
    clusterData: function (value) {
      this.getSummaryData()
    }
  },
  created () {
    this.getSummaryData()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    addNodes () {
      this.$emit('addNodes')
    },
    getSummaryData () {
      this.summaryData['name'] = this.clusterData.metadata.name
      this.summaryData['type'] = this.clusterData.spec.type
      this.summaryData['provisioner'] = this.clusterData.spec.provisionerSpec.name || this.clusterData.spec.provisionerSpec.type
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .status-panel {
    // border: 1px solid #d3d3d3;
    background: #f8f8f8;
    border-left: 5px solid #8ec320;
    border-radius: 4px;
    // box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
    box-shadow: 1px 1px 3px #8FA4B1;
    padding: 10px;
    margin: 10px 0 20px 0;
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
    background: #f8f8f8;
    border-top: 5px solid #2abb9b;
    border-radius: 4px;
    // box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
    box-shadow: 1px 1px 3px #8FA4B1;
    &__title {
      font-size: 24px;
      font-weight: bold;
      color: #525960;
      margin-bottom: 10px;
    }
    .info-title {
      // height: auto;
      // min-height: 30px;
      // line-height: 17px;
      font-size: 14px;
      font-weight: 600;
    }
    .info-value {
      // height: auto;
      // min-height: 30px;
      // line-height: 17px;
      font-size: 14px;
      font-weight: 400;
    }
  }
</style>
