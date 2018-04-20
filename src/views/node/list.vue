<template>
  <div class="node-container">
    <Spin size="large" v-if="isLoading" style="display: table; margin: 20% auto;"></Spin>

    <div v-if="!isLoading">
      <BackTop :height="115" :bottom="50"></BackTop>
      <span style="height: 36px; font-size: 24px; font-weight: bold;">{{ translateKey('page_title_nodes_list') }}</span>
      <Row :gutter="16" type="flex" align="middle">
        <Col :xs="24" :sm="12":md="12" :lg="8" v-for="(item, index) in ikmAgents" :key="index" style="padding-top: 15px;">
          <div class="node-card" v-bind:class="{ 'node-card__run': item.status.state==='Running'}">
            <div>
              <span class="node-card__title">{{ item.status.hostInfo.hostname }}</span>
            </div>
            <div style="font-size: 14px; color: gray;">{{ item.metadata.name }}</div>

            <div v-if="item.metadata.labels['cluster-name'].length === 0" class="node-card__location">
              <Icon class="node-card__icon" type="android-alert" :size="14" color="#fa983a"></Icon>
              <span class="node-card__span">{{ translateKey('card_agent_list_item_not_select') }}</span>
            </div>

            <div v-else class="node-card__location">
              <div>
                <Icon class="node-card__icon" type="earth" :size="14" color="#22a6b3"></Icon>
                <span class="node-card__span">{{ item.metadata.labels['cluster-name'] }}</span>
              </div>
              <div style="margin-top: 5px;">
                <Icon class="node-card__icon" type="pricetag" :size="14" color="#2d8cf0"></Icon>
                <template v-for="(role, index) in item.spec.roles">
                  <span v-if="index !== 0">, </span>
                  <span class="node-card__span">#{{ role.type.split("-")[1].toUpperCase() }}</span>
                </template>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 10px 0; border: 1px solid #e5e5e5">
              <Row :gutter="8">
                <Col span="8"
                  v-for="(agentInfo, agentKey) in getAgentsInfo(item)"
                  :key="agentKey"
                  v-bind:class="{ 'col-middle': agentKey==='ram'}"
                  style="padding: 8px;">
                  <div style="text-align: center;">
                    <span style="font-size: 20px; font-weight: 600;">{{ agentInfo.split(' ')[0] }}</span>
                    <span>{{ agentInfo.split(' ')[1] }}</span>
                  </div>
                  <div style="text-align: center; margin-top: 3px;">{{ translateKey('card_agent_list_item_' + agentKey) }}</div>
                </Col>
              </Row>
            </div>

            <div style="margin-top: 20px; padding-left: 1px;">
              <i>{{ getLocalDateString(item.metadata.creationTimestamp) }}</i>
              <a style="float: right; font-weight: 600;" v-on:click="clickAgent(item)">more...</a>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { watchIKMAgent } from '@/api/kubernetesCRD'

const JSONStream = require('json-stream')

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
  name: 'node-list',
  data () {
    return {
      isLoading: true,
      ikmAgents: []
    }
  },
  created () {
    // fetchAgents('99c7670f-e5b6-4023-b9c2-d445b3b15017').then(result => {
    //   console.log(result)
    // })
    this.watchAgent()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    capitalizeFirstLetter (string) {
      return string.replace(/^./, string[0].toUpperCase())
    },
    getCluster (cluster) {
      if (!cluster) {
        return 'This node is not select.'
      }
      return cluster
    },
    getLocalDateString (date) {
      return new Date(date).toLocaleString(Cookies.get('language') || 'en')
    },
    watchAgent () {
      var jsonStream = new JSONStream()
      var stream = watchIKMAgent()
      stream.pipe(jsonStream)
      this.ikmAgents = []
      jsonStream.on('data', object => {
        this.isLoading = false
        switch (object.type) {
          case 'ADDED':
            this.ikmAgents.push(object.object)
            break
          case 'DELETED':
            this.ikmAgents = this.ikmAgents.filter(agent => {
              return agent.metadata.name !== object.object.metadata.name
            })
            break
          case 'MODIFIED':
            this.ikmAgents = this.ikmAgents.map(agent => {
              if (agent.metadata.name === object.object.metadata.name) {
                return object.object
              }
              return agent
            })
            break
        }
        this.ikmAgents.sort(function (a, b) {
          return a.metadata.creationTimestamp > b.metadata.creationTimestamp ? 1 : -1
        })
      })
      jsonStream.on('error', err => {
        console.log(err)
        this.watchAgent()
      })
      jsonStream.on('end', () => {
        this.watchAgent()
      })
    },
    getAgentsInfo (info) {
      return {
        cpu: info.status.hostInfo.cpu.toString(),
        ram: bytesToSize(info.status.hostInfo.memory),
        disk: getDiskSize(info.status.hostInfo.disks)
      }
    },
    clickAgent (agent) {
      this.$router.push({
        name: 'node-info',
        params: {
          show_name: agent.metadata.name
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .node-container {
    width: 100%;
    height: 100%;
    padding: 16px;
    .node-card {
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      // border-left: 5px solid #ed5e69;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
      &__run {
        border-left: 5px solid #3cb371;
      }
      &__title {
        font-size: 18px;
        font-weight: 600;
      }
      &__location {
        margin-top: 5px;
        height: 45px;
      }
      &__icon {
        margin-right: 5px;
      }
      &__span {
        font-size: 14px;
      }
      &__tag {
        font-size: 14px;
        background: #2d8cf0;
        color: #fff;
        padding: 2px 10px;
        border-radius: 10px;
        margin-right: 5px;
      }
    }
    .col-middle {
      border-left: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
    }
  }
</style>
