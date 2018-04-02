<template>
  <div>
    <Row class="expand-row" :gutter="16">
      <Col span="9">
        <Icon type="at"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_hostname') }}</b>: {{ row.name.hostname }}</span>
      </Col>
      <Col span="8">
        <Icon type="cube"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_architecture') }}</b>: {{ row.hostInfo.architecture }}</span>
      </Col>
      <Col span="7">
        <Icon type="paper-airplane"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_cores') }}</b>: {{ row.hostInfo.cpu }}</span>
      </Col>
    </Row>
    <Row class="expand-row" :gutter="16">
      <Col span="9">
        <Icon type="pound"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_uuid') }}</b>: {{ row.name.uuid }}</span>
      </Col>
      <Col span="8">
        <Icon type="social-tux"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_os') }}</b>: {{ row.hostInfo.os }}, {{ row.hostInfo.osImage }}</span>
      </Col>
      <Col span="7">
        <Icon type="ios-analytics"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_ram') }}</b>: {{ bytesToSize(row.hostInfo.memory) }}</span>
      </Col>
    </Row>
    <Row class="expand-row" :gutter="16">
      <Col span="9">
        <Icon type="ios-pulse-strong"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_status') }}</b>: {{ row.status }}</span>
      </Col>
      <Col span="8" offset>
        <Icon type="ionic"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_kernelversion') }}</b>: {{ row.hostInfo.kernelVersion }}</span>
      </Col>
      <Col span="7">
        <Icon type="ios-albums"></Icon>
        <span class="expand-item"><b>{{ translateKey('expand_table_node_title_disk') }}</b>: {{ getDiskSize(row.hostInfo.disks) }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    row: Object
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    bytesToSize (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
    getDiskSize (disks) {
      // var result = 0
      for (var key in disks) {
        if (disks[key].type === 'disk') {
          return this.bytesToSize(disks[key].size)
        }
      }
      // disks.forEach(function (value) {
      //   if (value.type === 'disk') {
      //     result = this.bytesToSize(value.size)
      //   }
      // })
      // return result
    }
  }
}
</script>

<style scoped>
  .expand-row {
    margin-bottom: 5px;
  }
  .expand-item {
    margin-left: 3px;
  }
</style>
