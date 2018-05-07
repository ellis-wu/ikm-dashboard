<template>
  <div class="nodeInfo-container">
    <div v-if="isAPIResponse">
      <!-- node basic information -->
      <Row type="flex" style="margin-bottom: 15px;">
        <Col span="24">
          <Card class="node-info-card">
            <div slot="title">
              <p style="font-size: 18px;">{{ agentData.status.hostInfo.hostname }}</p>
              <div class="node-info-card__subtitle">{{ agentData.metadata.name }}</div>
            </div>
            <!-- node basic detail information -->
            <Row v-if="getBasicInformation().cluster.value.length === 0">
              <Alert show-icon>
                {{ translateKey('card_agent_list_item_not_select') }}
                <span slot="desc">{{ translateKey('alert_node_info_not_selected') }}</span>
              </Alert>
            </Row>
            <Row>
              <Col span="12">
                <Row v-for="(item, key) in getBasicInformation()" :key="key" :gutter="18">
                  <Col span="8" v-if="item.value.length > 0">
                    <Icon :type="item.icon"></Icon>
                    <span class="node-info-card__title">{{ translateKey('card_node_informtaion_item_' + key) }}</span>
                  </Col>
                  <Col span="16" v-if="item.value.length > 0">
                    <template v-if="typeof (item.value) === 'object'">
                      <Tag v-for="role in item.value" :key="role" color="blue">{{ role.split("-")[1].toUpperCase() }}</Tag>
                    </template>
                    <template v-else>
                      <span class="node-info-card__value" v-if="key === 'createtime'">{{ getLocalDateString(item.value) }}</span>
                      <span class="node-info-card__value" v-else>{{ item.value }}</span>
                    </template>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <!-- node card information -->
      <Row :gutter="16" type="flex" style="margin-bottom: 15px;">
        <Col span="6" v-for="(item, key) in getCardInformation()" :key="key">
          <inforCard :id-name="item.id"
            :end-val="item.value"
            :unit="item.unit"
            :iconType="item.icon"
            :color="item.color"
            :intro-text="translateKey('card_node_information_item_' + key)">
          </inforCard>
        </Col>
      </Row>

      <!-- disk and Netwrok detail infomation -->
      <Row :gutter="16" type="flex">
        <!-- disk -->
        <Col span="24">
          <Card class="node-info-card">
            <div slot="title">
              <p style="font-size: 18px;">{{ translateKey('card_node_information_title_disk') }}</p>
            </div>
            <capacityBar :data="getCapacityDisksBarData()"></capacityBar>
            <ExpandTable :columns="diskTableColumns" :data="getDisksTableData(agentData.status.hostInfo.disks)" :showStripe="true"></ExpandTable>
          </Card>
        </Col>
        <!-- network -->
        <Col span="24" style="margin-top: 15px;">
          <Card class="node-info-card">
            <div slot="title">
              <p style="font-size: 18px;">{{ translateKey('card_node_information_title_network') }}</p>
            </div>
            <ExpandTable :columns="networkTableColumns" :data="getNetworkTableData()" :showStripe="true"></ExpandTable>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import inforCard from './components/inforCard'
import capacityBar from './components/capacityBar'
import ExpandTable from '@/components/ExpandTable/expandTable.vue'
import { watchIKMAgent } from '@/api/kubernetesCRD'

const JSONStream = require('json-stream')

export default {
  name: 'node-info',
  components: {
    inforCard,
    capacityBar,
    ExpandTable
  },
  data () {
    return {
      isAPIResponse: false,
      agentData: {},
      diskTableColumns: [
        {
          title: this.translateKey('table_node_information_disk_title_name'),
          key: 'name'
        },
        {
          title: this.translateKey('table_node_information_disk_title_type'),
          key: 'type'
        },
        {
          title: this.translateKey('table_node_information_disk_title_mounted'),
          key: 'mounted'
        },
        {
          title: this.translateKey('table_node_information_disk_title_size'),
          key: 'size'
        }
      ],
      networkTableColumns: [
        {
          title: this.translateKey('table_node_information_network_title_name'),
          key: 'name'
        },
        {
          title: this.translateKey('table_node_information_network_title_ipv4'),
          key: 'ipv4'
        },
        {
          title: this.translateKey('table_node_information_network_title_ipv6'),
          key: 'ipv6'
        }
      ]
    }
  },
  watch: {
    '$store.state.app.language' () {
      this.diskTableColumns = [
        {
          title: this.translateKey('table_node_information_disk_title_name'),
          key: 'name'
        },
        {
          title: this.translateKey('table_node_information_disk_title_type'),
          key: 'type'
        },
        {
          title: this.translateKey('table_node_information_disk_title_mounted'),
          key: 'mounted'
        },
        {
          title: this.translateKey('table_node_information_disk_title_size'),
          key: 'size'
        }
      ]
      this.networkTableColumns = [
        {
          title: this.translateKey('table_node_information_network_title_name'),
          key: 'name'
        },
        {
          title: this.translateKey('table_node_information_network_title_ipv4'),
          key: 'ipv4'
        },
        {
          title: this.translateKey('table_node_information_network_title_ipv6'),
          key: 'ipv6'
        }
      ]
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
    getBasicInformation () {
      return {
        status: {
          icon: 'heart',
          value: this.agentData.status.state.toUpperCase()
        },
        cluster: {
          icon: 'earth',
          value: this.agentData.metadata.labels['cluster-name']
        },
        roles: {
          icon: 'pricetag',
          value: this.agentData.spec.roles.map(val => {
            return val.type
          })
        },
        architecture: {
          icon: 'cube',
          value: this.agentData.status.hostInfo.architecture
        },
        os: {
          icon: 'social-tux',
          value: this.agentData.status.hostInfo.os + ', ' + this.agentData.status.hostInfo.osImage
        },
        kernelversion: {
          icon: 'disc',
          value: this.agentData.status.hostInfo.kernelVersion
        },
        createtime: {
          icon: 'calendar',
          value: this.agentData.metadata.creationTimestamp
        }
      }
    },
    getCardInformation () {
      return {
        cpu: {
          id: 'cpu_core',
          icon: 'ionic',
          color: '#079992',
          value: this.agentData.status.hostInfo.cpu,
          unit: 'cores'
        },
        ram: {
          id: 'ram_size',
          icon: 'waterdrop',
          color: '#2bcbba',
          value: this.bytesToSize(this.agentData.status.hostInfo.memory).value,
          unit: this.bytesToSize(this.agentData.status.hostInfo.memory).unit
        },
        disk: {
          id: 'disk_size',
          icon: 'filing',
          color: '#2980b9',
          value: this.getDiskSize(this.agentData.status.hostInfo.disks).value,
          unit: this.getDiskSize(this.agentData.status.hostInfo.disks).unit
        },
        interfaces: {
          id: 'interface_count',
          icon: 'ios-analytics',
          color: '#45aaf2',
          value: this.agentData.status.hostInfo.ifaces.length,
          unit: ''
        }
      }
    },
    getDisksTableData (disks) {
      return disks.map(disk => {
        var diskSize = this.bytesToSize(disk.size)
        return {
          name: disk.name,
          type: disk.type || '-',
          mounted: disk.mountPoint || '-',
          size: diskSize.value + ' ' + diskSize.unit
        }
      })
    },
    getCapacityDisksBarData () {
      return this.agentData.status.hostInfo.disks.map(disk => {
        return {
          name: disk.name,
          value: disk.size
        }
      })
    },
    getNetworkTableData () {
      return this.agentData.status.hostInfo.ifaces.map(iface => {
        var result = { name: iface.name }
        iface.networks.forEach(val => {
          result[val.type.toLowerCase()] = val.address
        })
        return result
      })
    },
    getAgent () {
      var index = this.$route.params.show_name.toString()
      var jsonStream = new JSONStream()
      var stream = watchIKMAgent(index)
      stream.pipe(jsonStream)
      jsonStream.on('data', object => {
        this.isAPIResponse = true
        this.agentData = object.object
        this.getCardInformation()
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
      border-left: 5px solid #4a69bd;
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
