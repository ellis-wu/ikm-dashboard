<template>
  <div style="margin-bottom: 25px;">
    <div style="margin-bottom: 5px;">
      <span style="font-weight: 600;">{{ translateKey('card_node_information_item_disk_capacity') }} {{ bytesToSize(getTotalSize()) }}</span>
    </div>
    <div style="border-radius: 4px; overflow: hidden;">
      <Tooltip v-for="(item, index) in data"
        :key="index"
        placement="top"
        :style="{
          backgroundColor: getBackgroundColor(index),
          width: barPercentage()[index] + '%',
          textAlign: 'center',
          lineHeight: height}">
        <div v-if="barPercentage()[index] >= 5" style="text-align: center; color: #fff; cursor: default;">{{ item.name }}</div>
        <div v-else :style="{color: getBackgroundColor(index), cursor: 'default'}">.</div>
        <div slot="content" style="text-align: center;">
          <p>{{ item.name }}</p>
          <p>{{ bytesToSize(item.value) }}</p>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'capacityBar',
  props: {
    data: Array,
    height: {
      type: String,
      default: '30px'
    }
  },
  data () {
    return {}
  },
  created () {
    this.getTotalSize()
    this.barPercentage()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    getBackgroundColor (index) {
      var colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6']
      return colors[index]
    },
    getTotalSize () {
      var sum = 0
      this.data.forEach(val => {
        sum += val.value
      })
      return sum
    },
    bytesToSize (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
    barPercentage () {
      // get all data percentage
      var sum = this.getTotalSize()
      var percentages = this.data.map(val => {
        return val.value / sum * 100
      })
      // if data < th then calculate diff sum
      var th = 0.5
      var diff = 0
      var diffPercentages = percentages.map(val => {
        if (val < th) {
          diff += (th - val)
          return th
        }
        return val
      })
      // diff dispersed to other data
      if (diff) {
        var fix = diff / (this.data.length - diffPercentages.filter(val => {
          return val - diff / this.data.length < 2
        }).length)
        return diffPercentages.map(val => {
          if (val - diff / this.data.length > 2) {
            return val - fix
          }
          return val
        })
      }
    }
  }
}
</script>
