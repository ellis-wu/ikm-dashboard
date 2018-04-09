<template>
  <div class="clusterInfo-container">
    <Tabs type="card" :value="selectTabPane" :animated="false" @on-click="handleTabClicked" v-if="isAPIResponse">
      <TabPane :label="translateKey('tabpane_title_information')" icon="ios-speedometer" name="info">
        <InfoTabPane v-on:addNodes="handleAddNode" :clusterData="clusterData"></InfoTabPane>
      </TabPane>
      <TabPane :label="clusterData.spec.type" icon="android-settings" :name="clusterData.spec.type">
        <SettingTabPane :clusterData="clusterData"></SettingTabPane>
      </TabPane>
      <TabPane :label="translateKey('tabpane_title_nodes')" icon="android-apps" name="nodes">
        <NodesTabPane :clusterData="clusterData"></NodesTabPane>
      </TabPane>
      <TabPane :label="translateKey('tabpane_title_addons')" icon="android-archive" name="addons">
        <AddonsTabPane :clusterData="clusterData"></AddonsTabPane>
      </TabPane>
      <TabPane :label="translateKey('tabpane_title_logs')" icon="clipboard" name="logs">
        <LogsTabPane></LogsTabPane>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import InfoTabPane from './components/InfoTabPane'
import SettingTabPane from './components/SettingTabPane'
import NodesTabPane from './components/NodesTabPane'
import AddonsTabPane from './components/AddonsTabPane'
import LogsTabPane from './components/LogsTabPane'
import { watchIKMCluster } from '@/api/kubernetesCRD'

const JSONStream = require('json-stream')

export default {
  name: 'cluster-info',
  components: {
    InfoTabPane,
    SettingTabPane,
    NodesTabPane,
    AddonsTabPane,
    LogsTabPane
  },
  data () {
    return {
      selectTabPane: 'info',
      clusterData: {},
      isAPIResponse: false
    }
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    getCluster () {
      var index = this.$route.params.show_name.toString()
      var jsonStream = new JSONStream()
      var stream = watchIKMCluster(index)
      stream.pipe(jsonStream)
      jsonStream.on('data', object => {
        this.isAPIResponse = true
        this.clusterData = object.object
      })
      jsonStream.on('error', err => {
        console.log(err)
        this.getCluster()
      })
      jsonStream.on('end', () => {
        if (this.$route.params.show_name) {
          this.getCluster()
        }
      })
    },
    handleAddNode () {
      this.selectTabPane = 'nodes'
    },
    handleTabClicked (name) {
      this.selectTabPane = name
    }
  },
  created () {
    this.getCluster()
  }
}
</script>

<style>
  .ivu-tabs-card > .ivu-tabs-content {
    height: 100%;
    margin-top: -16px;
  }
  .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }
  .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }
  .ivu-tabs-nav > .ivu-tabs-tab > .ivu-icon {
    margin-right: 0px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .clusterInfo-container {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
</style>
