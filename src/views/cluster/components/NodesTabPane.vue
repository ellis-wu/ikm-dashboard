<template>
  <div>
    <div class="page-title">{{ translateKey('tabpane_page_title_nodes') }}</div>
    <Button type="primary" size="large" icon="checkmark-round" style="float: right;">Apply</Button>
    <div class="table-group" v-for="item in agentRoleDefault">
      <span class="table-title">{{ translateKey('table_agent_tabpane_role_title_' + item.name.toLowerCase().replace('-', '_')) }}</span>
      <Button type="success" icon="plus-round" style="float: right;"></Button>
      <vue-markdown class="table-description" :source="translateKey('help_nodes_tabpane_' + item.name.toLowerCase().replace('-', '_'))"></vue-markdown>
      <ExpandTable :columns="columns" :data="addedNodesDatas[item.name]"></ExpandTable>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import ExpandTable from '@/components/ExpandTable/expandTable.vue'
import { fetchDefaults, fetchAgents } from '@/api/kubernetesCRD'

function bytesToSize (bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function getDiskSize (disks) {
  var result = 0
  disks.forEach(function (value) {
    if (value.type === 'disk') {
      result = bytesToSize(value.size)
    }
  })
  return result
}

export default {
  components: {
    ExpandTable,
    VueMarkdown
  },
  props: {
    clusterData: {
      type: Object,
      require: true
    }
  },
  watch: {
    '$store.state.app.language' () {
      this.columns = [
        {
          title: this.translateKey('table_agent_tabpane_columns_title_name'),
          key: 'name',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('div', {
                style: {
                  fontWeight: '600'
                }
              }, params.row.name.hostname),
              h('div', {
                style: {
                  fontSize: '12px'
                }
              }, params.row.name.uuid)
            ])
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_cores'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', params.row.hostInfo.cpu)
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_ram'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', bytesToSize(params.row.hostInfo.memory))
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_disks'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', params.row.hostInfo.disks.length)
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_storage'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', getDiskSize(params.row.hostInfo.disks))
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_status'),
          key: 'status',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#19be6b'
              }
            }, this.translateKey('table_agent_tabpane_status_' + params.row.status.toLowerCase()))
          }
        }
      ]
    }
  },
  data () {
    return {
      dialogVisible: false,
      lang: this.$store.state.app.language,
      agentRoleDefault: [],
      addedNodesDatas: {},
      idleNodesDatas: [],
      columns: [
        {
          title: this.translateKey('table_agent_tabpane_columns_title_name'),
          key: 'name',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('div', {
                style: {
                  fontWeight: '600'
                }
              }, params.row.name.hostname),
              h('div', {
                style: {
                  fontSize: '12px'
                }
              }, params.row.name.uuid)
            ])
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_cores'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', params.row.hostInfo.cpu)
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_ram'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', bytesToSize(params.row.hostInfo.memory))
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_disks'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', params.row.hostInfo.disks.length)
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_storage'),
          key: 'hostInfo',
          render: (h, params) => {
            return h('div', getDiskSize(params.row.hostInfo.disks))
          }
        },
        {
          title: this.translateKey('table_agent_tabpane_columns_title_status'),
          key: 'status',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#19be6b'
              }
            }, this.translateKey('table_agent_tabpane_status_' + params.row.status.toLowerCase()))
          }
        }
      ]
    }
  },
  created () {
    this.getAgents()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    getAgents () {
      var type = this.clusterData.spec.type
      var addedAgentTemp = {}
      fetchDefaults(type.toLowerCase()).then(result => {
        this.agentRoleDefault = result.spec['agent-roles']
        result.spec['agent-roles'].forEach(function (value) {
          addedAgentTemp[value.name] = []
        })
        fetchAgents().then(result => {
          var name = this.clusterData.metadata.name
          var idleAgentTemp = []
          result.items.forEach(function (value) {
            if (value.metadata.labels) {
              if (name === value.metadata.labels['cluster-name']) {
                value.spec.roles.forEach(function (val) {
                  let temp = []
                  temp.push({
                    name: {
                      uuid: value.metadata.name,
                      hostname: value.status.hostInfo.hostname
                    },
                    hostInfo: value.status.hostInfo,
                    status: value.status.state
                  })
                  addedAgentTemp[val.type] = temp
                })
              }
            } else {
              idleAgentTemp.push({
                name: {
                  uuid: value.metadata.name,
                  hostname: value.status.hostInfo.hostname
                },
                hostInfo: value.status.hostInfo,
                status: value.status.state
              })
            }
          })
          this.addedNodesDatas = addedAgentTemp
          this.idleNodesDatas = idleAgentTemp
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .page-title {
    width: 70%;
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    color: #525960;
    margin-bottom: 20px;
  }
  .table-group {
    // background: #f8f8f8;
    margin-bottom: 20px;
    border-radius: 4px;
    border-left: 5px solid #ff6b81;
    padding: 10px;
    // box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
    box-shadow: 1px 1px 3px #8FA4B1;
  }
  .table-title {
    font-size: 21px;
    font-weight: 600;
    color: #5c636a;
    margin-bottom: 5px;
    // border-bottom: 1px solid #bebebe;
  }
  .table-description {
    color: #8c8c8c;
    font-size: 14px;
    margin: 10px 0 15px 0;
  }
</style>
