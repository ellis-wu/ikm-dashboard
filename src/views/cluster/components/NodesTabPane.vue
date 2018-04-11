<template>
  <div>
    <div class="page-title">{{ translateKey('tabpane_page_title_nodes') }}</div>
    <div style="float: right;">
      <Button type="primary" size="large" icon="refresh" @click="getAgents" style="margin-right: 5px;">{{ translateKey('button_nodes_tabpane_refresh') }}</Button>
      <Button type="primary" size="large" icon="checkmark-round" @click="handleApply">{{ translateKey('button_nodes_tabpane_apply') }}</Button>
    </div>

    <div v-if="isAPIResponse">
      <div class="table-group" v-for="item in agentRoleDefault">
        <span class="table-title">{{ translateKey('table_agent_tabpane_role_title_' + item.name.toLowerCase().replace('-', '_')) }}</span>
        <Button type="success" icon="plus-round" @click="handleAdded(item.name)" style="float: right;"></Button>
        <vue-markdown class="table-description" :source="translateKey('help_nodes_tabpane_' + item.name.toLowerCase().replace('-', '_'))"></vue-markdown>
        <ExpandTable :columns="columns" :data="addedNodesDatas[item.name]" :expand="true"></ExpandTable>
      </div>
    </div>

    <Modal v-model="selectDialogVisible" :title="translateKey('dialog_title_add_' + dialogTitle.replace('-', '_'))" width="1000" @on-cancel="cancelSelectAgents">
      <div v-if="selectDialogVisible">
        <ExpandTable ref="childComponent" :columns="columns" :data="idleNodesDatas[dialogTitle]" :selection="true" :expand="true" v-on:selectItems="selectAgents"></ExpandTable>
      </div>
      <div slot="footer" class="modal-footer">
        <Button @click="cancelSelectAgents" icon="close-round">{{ translateKey('button_selected_nodes_dialog_cancel') }}</Button>
        <Button type="primary" icon="checkmark-round" @click="confirmSelectAgents(dialogTitle)">{{ translateKey('button_selected_nodes_dialog_confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import ExpandTable from '@/components/ExpandTable/expandTable.vue'
import { fetchDefaults, fetchAgents, updateIKMAgentRole } from '@/api/kubernetesCRD'

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
  data () {
    return {
      isAPIResponse: false,
      selectDialogVisible: false,
      dialogTitle: 'k8s-master',
      lang: this.$store.state.app.language,
      agentRoleDefault: [],
      addedNodesDatas: {},
      idleNodesDatas: [],
      changeNodesDatas: [],
      agentsDatas: {},
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
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    getAgents () {
      var type = this.clusterData.spec.type
      var addedAgentTemp = {}
      var selectAgentTemp = {}
      fetchDefaults(type.toLowerCase()).then(result => {
        this.agentRoleDefault = result.spec['agent-roles']
        result.spec['agent-roles'].forEach(function (value) {
          addedAgentTemp[value.name] = []
          selectAgentTemp[value.name] = []
        })
        var name = this.clusterData.metadata.name
        fetchAgents().then(result => {
          // Get all of agents data for compare the agents is changed
          result.items.forEach(agent => {
            if (agent.spec.roles.length > 0) {
              if (agent.metadata.labels['cluster-name'] === name) {
                this.agentsDatas[agent.metadata.name] = agent.spec.roles
              }
            } else {
              this.agentsDatas[agent.metadata.name] = agent.spec.roles
            }
          })
          // Get added nodes data for show of table
          Object.keys(addedAgentTemp).forEach((rk) => {
            addedAgentTemp[rk] = result.items.filter(function (agent) {
              if (agent.spec.roles.length > 0) {
                let inCluster = agent.metadata.labels['cluster-name'] === name
                return inCluster && agent.spec.roles.some(function (role) {
                  return role.type === rk
                })
              }
            }).map((agent) => {
              return {
                name: {
                  uuid: agent.metadata.name,
                  hostname: agent.status.hostInfo.hostname
                },
                hostInfo: agent.status.hostInfo,
                status: agent.status.state
              }
            }).sort(function (a, b) {
              return a.name.hostname > b.name.hostname ? 1 : -1
            })
          })
          this.addedNodesDatas = addedAgentTemp
          this.$store.dispatch('setSelectAgents', this.addedNodesDatas)
          // Get can be selected agents data
          Object.keys(addedAgentTemp).forEach((rk) => {
            selectAgentTemp[rk] = result.items.filter(function (agent) {
              if (agent.spec.roles.length > 0) {
                let inCluster = agent.metadata.labels['cluster-name'] === name
                return inCluster
              } else {
                return agent
              }
            }).map((agent) => {
              var isSelected = false
              if (agent.spec.roles.length > 0) {
                isSelected = agent.spec.roles.some(function (role) {
                  return role.type === rk
                })
              }
              return {
                name: {
                  uuid: agent.metadata.name,
                  hostname: agent.status.hostInfo.hostname
                },
                hostInfo: agent.status.hostInfo,
                status: agent.status.state,
                _checked: isSelected
              }
            }).sort(function (a, b) {
              return a.name.hostname > b.name.hostname ? 1 : -1
            })
          })
          this.idleNodesDatas = selectAgentTemp
          this.isAPIResponse = true
        })
      })
    },
    selectAgents (val) {
      this.changeNodesDatas = val
    },
    cancelSelectAgents () {
      this.$refs.childComponent.cancelAction()
      this.selectDialogVisible = false
    },
    confirmSelectAgents (role) {
      this.addedNodesDatas[role] = this.changeNodesDatas
      this.idleNodesDatas[role] = this.idleNodesDatas[role].map((agent) => {
        agent._checked = false
        let isSelected = this.changeNodesDatas.find((selected) => {
          return agent.name.uuid === selected.name.uuid
        })
        if (isSelected) {
          agent._checked = true
        }
        return agent
      })
      this.selectDialogVisible = false
    },
    handleAdded (name) {
      this.selectDialogVisible = true
      this.dialogTitle = name
    },
    handleApply () {
      // show diolog
      this.$Modal.confirm({
        title: this.translateKey('dialog_node_role_update_title'),
        content: this.translateKey('dialog_node_role_update_description'),
        loading: true,
        onOk: () => {
          // Change addedNodesDatas format: { 'agent uuid': [roles] }
          var addedNodesRoles = {}
          Object.keys(this.addedNodesDatas).forEach(role => {
            this.addedNodesDatas[role].forEach(agent => {
              if (addedNodesRoles[agent.name.uuid] && addedNodesRoles[agent.name.uuid].length > 0) {
                let roles = addedNodesRoles[agent.name.uuid]
                roles.push({type: role})
                addedNodesRoles[agent.name.uuid] = roles
              } else {
                addedNodesRoles[agent.name.uuid] = [{type: role}]
              }
            })
          })
          // Scanner agents and check agent role is change
          Object.keys(this.agentsDatas).forEach(agentName => {
            // agent roles is change, so it will update agent role.
            var isAgentRolesChange = JSON.stringify(this.agentsDatas[agentName]) === JSON.stringify(addedNodesRoles[agentName])
            if (!isAgentRolesChange) {
              if (this.agentsDatas[agentName].length > 0 || addedNodesRoles[agentName]) {
                let agetnRoles = (addedNodesRoles[agentName]) ? addedNodesRoles[agentName] : []
                updateIKMAgentRole(this.clusterData.metadata.name, agentName, agetnRoles).then(result => {
                  console.log(agentName, 'update success')
                })
              }
            }
          })
          // Reload the agents datas
          this.getAgents()
          this.$Modal.remove()
          this.$Notice.success({
            title: this.translateKey('notify_message_nodes_roles_update_success')
          })
          this.$store.dispatch('setSelectAgents', this.addedNodesDatas)
        }
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
