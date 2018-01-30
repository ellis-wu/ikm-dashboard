<template>
  <div class="clusterInfo-container">
    <Tabs type="card" :value="selectTabPane" :animated="false" @on-click="handleTabClicked" v-if="isAPIResponse">
      <TabPane label="Infomation" icon="ios-speedometer" name="info">
        <InfoTabPane v-on:addNodes="handleAddNode" :clusterData="clusterData"></InfoTabPane>
      </TabPane>
      <TabPane :label="clusterData.spec.type" icon="android-settings" :name="clusterData.spec.type">
        <SettingTabPane :clusterData="clusterData"></SettingTabPane>
      </TabPane>
      <TabPane label="Nodes" icon="android-apps" name="nodes">
        <NodesTabPane></NodesTabPane>
      </TabPane>
      <TabPane label="Addons" icon="android-archive" name="addons">
        Addons Pane
      </TabPane>
      <TabPane label="Logs" icon="clipboard" name="logs">
        Logs Pane
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import InfoTabPane from './components/InfoTabPane'
import SettingTabPane from './components/SettingTabPane'
import NodesTabPane from './components/NodesTabPane'
import imgDashboard from '@/assets/Addons_images/dashboard_icon.png'
import { fetchCluster } from '@/api/kubernetesCRD'

export default {
  name: 'cluster-info',
  components: {
    InfoTabPane,
    SettingTabPane,
    NodesTabPane
  },
  data () {
    return {
      imgDashboard,
      selectTabPane: 'info',
      clusterData: {},
      isAPIResponse: false
    }
  },
  methods: {
    getCluster () {
      let index = this.$route.params.show_name.toString()
      fetchCluster(index).then(result => {
        this.clusterData = result
        this.isAPIResponse = true
      }).catch(() => {
        this.$router.push({ path: '/cluster' })
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
