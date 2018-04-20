<template>
  <div class="nodeInfo-container">
     <div v-if="isAPIResponse">
       <!-- node basic information -->
      <Row :gutter="16" type="flex" style="margin-bottom: 15px;">
        <Col span="24">
          <Card class="node-info-card">
            <div slot="title">
              <p style="font-size: 18px;">{{ agentData.status.hostInfo.hostname }}</p>
              <div class="node-info-card__subtitle">{{ agentData.metadata.name }}</div>
            </div>
            <!-- node basic detail information -->
            <Row :gutter="16">
              <!-- if node not selected role then show alert -->
              <Row v-if="agentData.metadata.labels['cluster-name'].length === 0">
                <!-- <Alert type="warning" show-icon> -->
                <Alert show-icon>
                  {{ translateKey('card_agent_list_item_not_select') }}
                  <span slot="desc">{{ translateKey('alert_node_info_not_selected') }}</span>
                </Alert>
              </Row>
              <Row>
                <Col span="12">
                  <!-- show cluster -->
                  <Row :gutter="18" v-if="agentData.metadata.labels['cluster-name'].length !== 0">
                    <Col span="8">
                      <Icon type="earth" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_cluster') }}</span>
                    </Col>
                    <Col span="16">
                      <span class="node-info-card__value">{{ agentData.metadata.labels['cluster-name'] }}</span>
                    </Col>
                  </Row>
                  <!-- show role -->
                  <Row :gutter="18" v-if="agentData.metadata.labels['cluster-name'].length !== 0">
                    <Col span="8">
                      <Icon type="pricetag" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_roles') }}</span>
                    </Col>
                    <Col span="16">
                      <template v-for="(role, index) in agentData.spec.roles">
                        <!-- <span v-if="index !== 0">, </span> -->
                        <Tag color="blue">{{ role.type.split("-")[1].toUpperCase() }}</Tag>
                      </template>
                    </Col>
                  </Row>
                  <!-- show node architecture -->
                  <Row :gutter="18">
                    <Col span="8">
                      <Icon type="cube" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_architecture') }}</span>
                    </Col>
                    <Col span="16">
                      <span class="node-info-card__value">{{ agentData.status.hostInfo.architecture }}</span>
                    </Col>
                  </Row>
                  <!-- show node os -->
                  <Row :gutter="18">
                    <Col span="8">
                      <Icon type="social-tux" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_os') }}</span>
                    </Col>
                    <Col span="16">
                      <span class="node-info-card__value">{{ agentData.status.hostInfo.os }}, {{ agentData.status.hostInfo.osImage }}</span>
                    </Col>
                  </Row>
                  <!-- show node kernel version -->
                  <Row :gutter="18">
                    <Col span="8">
                      <Icon type="disc" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_kernelversion') }}</span>
                    </Col>
                    <Col span="16">
                      <span class="node-info-card__value">{{ agentData.status.hostInfo.kernelVersion }}</span>
                    </Col>
                  </Row>
                  <!-- show node created time -->
                  <Row :gutter="18">
                    <Col span="8">
                      <Icon type="calendar" :size="14"></Icon>
                      <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_createtime') }}</span>
                    </Col>
                    <Col span="16">
                      <span class="node-info-card__value">{{ getLocalDateString(agentData.metadata.creationTimestamp) }}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Card>
        </Col>
      </Row>

      <!-- node card information -->
      <Row :gutter="16" type="flex" style="margin-bottom: 15px;">
        <!-- node cpu infomation card -->
        <Col span="6">
          <inforCard id-name="cpu_core"
            :end-val="agentData.status.hostInfo.cpu"
            unit="cores"
            iconType="ionic"
            color="#079992"
            intro-text="CPU">
          </inforCard>
        </Col>
        <!-- node ram infomation card -->
        <Col span="6">
          <inforCard id-name="ram_size"
            :end-val="bytesToSize(agentData.status.hostInfo.memory).value"
            :unit="bytesToSize(agentData.status.hostInfo.memory).unit"
            iconType="waterdrop"
            color="#2bcbba"
            intro-text="RAM">
          </inforCard>
        </Col>
        <!-- node disk infomation card -->
        <Col span="6">
          <inforCard id-name="disk_size"
            :end-val="getDiskSize(agentData.status.hostInfo.disks).value"
            :unit="getDiskSize(agentData.status.hostInfo.disks).unit"
            iconType="filing"
            color="#2980b9"
            intro-text="DISK">
          </inforCard>
        </Col>
        <!-- node network infomation card -->
        <Col span="6">
          <inforCard id-name="netwrok_count"
            :end-val="agentData.status.hostInfo.ifaces.length"
            iconType="ios-analytics"
            color="#45aaf2"
            intro-text="INTERFACES">
          </inforCard>
        </Col>
      </Row>

      <!-- disk detail infomation -->
      <Row :gutter="16" type="flex">
        <Col span="24">
          <Card class="node-info-card">
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import inforCard from './components/inforCard'
import { watchIKMAgent } from '@/api/kubernetesCRD'

const JSONStream = require('json-stream')

export default {
  name: 'node-info',
  components: {
    inforCard
  },
  data () {
    return {
      isAPIResponse: false,
      agentData: {},
      test: {}
    }
  },
  created () {
    this.getAgent()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    bytesToSize (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return {
        value: Math.round(bytes / Math.pow(1024, i), 2),
        unit: sizes[i]
      }
    },
    getDiskSize (disks) {
      var result = {
        value: 0,
        unit: 'Bytes'
      }
      for (var key in disks) {
        if (disks[key].type === 'disk') {
          result = this.bytesToSize(disks[key].size)
        }
      }
      return result
    },
    getLocalDateString (date) {
      return new Date(date).toLocaleString(Cookies.get('language') || 'en')
    },
    getAgent () {
      var index = this.$route.params.show_name.toString()
      var jsonStream = new JSONStream()
      var stream = watchIKMAgent(index)
      stream.pipe(jsonStream)
      jsonStream.on('data', object => {
        this.isAPIResponse = true
        this.agentData = object.object
      })
      jsonStream.on('error', err => {
        console.log(err)
        this.getAgent()
      })
      jsonStream.on('end', () => {
        if (this.$route.params.show_name) {
          this.getAgent()
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .nodeInfo-container {
    width: 100%;
    height: 100%;
    padding: 16px;
    .node-info-card {
      background: #f8f8f8;
      border-left: 5px solid #f39c12;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
      &__title {
        font-size: 14px;
        font-weight: 600;
        margin-left: 5px;
        line-height: 26px;
      }
      &__value {
        font-size: 14px;
        font-weight: 400;
        line-height: 26px;
      }
      &__subtitle {
        font-size: 14px;
        color: gray;
        // margin-top: 5px;
      }
    }
  }
</style>
