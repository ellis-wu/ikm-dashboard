<template>
  <div>
    <span class="page-title">{{translateKey('content', 'addons_tabpane_page_title')}}</span>
    <Row :gutter="12">
      <Col :xs="24" :sm="12":md="12" :lg="8" v-for="item in addonsData" :key="item.name" style="padding-top: 10px;">
        <Card class="addons-card" :padding="14">
          <div v-if="item.phase === 'Running'" slot="extra">
            <!-- <Tooltip :content="translateKey('button', 'addons_remove_button')" placement="bottom" :transfer="true">
              <a href="#" @click.prevent="removeAddons(item)">
                <Icon type="trash-a" size="18" color="#ed5e69"></Icon>
              </a>
            </Tooltip> -->
            <a href="#" @click.prevent="removeAddons(item)">
              <Icon type="trash-a" size="18" color="#ed5e69"></Icon>
            </a>
          </div>
          <div style="text-align: center;">
            <div><b>{{translateKey('content', 'addons_tabpane_' + item.name + '_title')}}</b></div>
            <div style="min-height: 120px; margin: 10px 0;">
              <img :src="imageURL(item.name)" style="max-height: 120px;"></img>
            </div>
            <vue-markdown :source="translateKey('content', 'addons_tabpane_' + item.name + '_description')"></vue-markdown>
          </div>
          <Button v-if="item.phase === 'Pending'" type="success" long loading style="margin-top: 16px;">{{translateKey('button', 'addons_pending_button')}}</Button>
          <Button v-else :type="item.buttonType" long style="margin-top: 16px;" @click="addonAction(item)">{{translateKey('button', 'addons_' + item.phase.toLowerCase() + '_button')}}</Button>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { fetchDefaults, updateIKMCluster } from '@/api/kubernetesCRD'
import VueMarkdown from 'vue-markdown'

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
      addonsData: [],
      buttonType: 'success'
    }
  },
  watch: {
    clusterData: function (value) {
      this.getAddonsDefault()
    }
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    imageURL (name) {
      return require(`@/assets/Addons_images/${name}.png`)
    },
    getAddonsDefault () {
      var type = this.clusterData.spec.type
      this.addonsData = []
      fetchDefaults(type.toLowerCase()).then(result => {
        var addons = result.spec.addons || result.spec.plugins
        for (var defaultAddonsKey in addons) {
          this.addonsData.push({
            name: addons[defaultAddonsKey].name.replace('-', '_'),
            phase: this.addonsPhase(addons[defaultAddonsKey].name),
            buttonType: (this.addonsPhase(addons[defaultAddonsKey].name) === 'Running') ? 'primary' : 'success'
          })
        }
      })
    },
    addonAction (addon) {
      if (addon.phase === 'Install') {
        this.$Modal.confirm({
          title: this.translateKey('dialog', 'addons_' + addon.phase.toLowerCase() + '_title'),
          content: this.translateKey('dialog', 'addons_install_description') + this.translateKey('content', 'addons_tabpane_' + addon.name + '_title') + '?',
          closable: true,
          cancelText: this.translateKey('button', 'cancel'),
          onOk: () => {
            let name = this.$route.params.show_name.toString()
            let addonsSpec = this.handleAddonAction(addon.name)
            updateIKMCluster(name, addonsSpec).then(result => {
              this.$Notice.success({
                title: this.translateKey('notify', 'addon_start_install') + this.translateKey('content', 'addons_tabpane_' + addon.name + '_title')
              })
            })
          }
        })
      } else if (addon.phase === 'Running') {
        console.log('Running', addon.name)
      }
    },
    removeAddons (addon) {
      this.$Modal.confirm({
        title: this.translateKey('dialog', 'addons_remove_title'),
        content: this.translateKey('dialog', 'addons_remove_description') + this.translateKey('content', 'addons_tabpane_' + addon.name + '_title') + '?',
        closable: true,
        cancelText: this.translateKey('button', 'cancel'),
        onOk: () => {
          let name = this.$route.params.show_name.toString()
          let addonsSpec = this.handleAddonAction(addon.name)
          updateIKMCluster(name, addonsSpec).then(result => {
            this.$Notice.success({
              title: this.translateKey('notify', 'addon_start_revmoe') + this.translateKey('content', 'addons_tabpane_' + addon.name + '_title')
            })
          })
        }
      })
    },
    handleAddonAction (name) {
      let addonSpec = {}
      let specKey = this.clusterData.spec.type.toLowerCase() + 'Spec'
      let addons = this.clusterData.spec[specKey].addons
      let index = addons.indexOf(name.replace('_', '-'))
      if (index > -1) {
        addons.splice(index, 1)
      } else {
        addons.push(name.replace('_', '-'))
      }
      addonSpec[specKey] = {
        addons: addons
      }
      return addonSpec
    },
    addonsPhase (addonName) {
      if (this.clusterData.status && this.clusterData.status.addonStates) {
        for (var clusterAddonsKey in this.clusterData.status.addonStates) {
          if (addonName === this.clusterData.status.addonStates[clusterAddonsKey].name) {
            return this.clusterData.status.addonStates[clusterAddonsKey].phase
          }
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
  .page-title {
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    color: #525960;
  }
  .addons-card {
    background: #e1eff9;
    border: 1px solid rgba(73, 80, 96, 0.4);
    border-radius: 4px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
  }
</style>
