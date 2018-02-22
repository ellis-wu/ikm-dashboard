<template>
  <div>
    <span style="height: 36px; font-size: 24px; font-weight: bold;">Addons</span>
    <Row :gutter="12">
      <Col :xs="24" :sm="12":md="12" :lg="8" v-for="item in addonsData" :key="item.name" style="padding-top: 10px;">
        <Card class="addons-card" :padding="14">
          <a href="#" slot="extra" @click.prevent="removeAddons(item)">
            <Icon type="trash-a" size="18" color="#ed5e69"></Icon>
          </a>
          <div style="text-align: center;">
            <div><b>{{translateKey('content', 'addons_tabpanl_' + item.name + '_title')}}</b></div>
            <img :src="dashbaordImage" style="max-width: 40%; max-height: 40%;"></img>
            <vue-markdown :source="translateKey('content', 'addons_tabpanl_' + item.name + '_description')"></vue-markdown>
          </div>
          <Button v-if="item.phase === 'Pending'" type="success" long loading style="margin-top: 16px;">Pending...</Button>
          <Button v-else type="success" long style="margin-top: 16px;" @click="addonAction(item)">{{item.phase}}</Button>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { fetchDefaults } from '@/api/kubernetesCRD'
import VueMarkdown from 'vue-markdown'
import dashbaordImage from '@/assets/Addons_images/dashboard_icon.png'

export default {
  props: {
    clusterData: {
      type: Object,
      require: true
    }
  },
  components: {
    VueMarkdown
  },
  data () {
    return {
      dashbaordImage,
      addonsData: []
    }
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    getAddonsDefault () {
      var type = this.clusterData.spec.type
      fetchDefaults(type.toLowerCase()).then(result => {
        for (var defaultAddonsKey in result.spec.addons) {
          this.addonsData.push({
            name: result.spec.addons[defaultAddonsKey].name.replace('-', '_'),
            phase: this.addonsPhase(result.spec.addons[defaultAddonsKey].name)
          })
        }
      })
    },
    addonAction (addon) {
      console.log('ACTION ' + addon.name + '/' + addon.phase)
    },
    removeAddons (addon) {
      console.log('REMOVE ' + addon.name)
    },
    addonsPhase (addonName) {
      for (var clusterAddonsKey in this.clusterData.status.addonStates) {
        if (addonName === this.clusterData.status.addonStates[clusterAddonsKey].name) {
          return this.clusterData.status.addonStates[clusterAddonsKey].phase
        }
      }
      return 'Install'
    }
  },
  created () {
    this.getAddonsDefault()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .addons-card {
    background: #e1eff9;
  }
</style>
