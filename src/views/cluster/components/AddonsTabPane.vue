<template>
  <div>
    <span class="page-title">{{ translateKey('tabpane_page_title_addons') }}</span>
    <Row :gutter="12">
      <Col :xs="24" :sm="12":md="12" :lg="8" v-for="item in addonsData" :key="item.name" style="padding-top: 10px;">
        <Card class="addons-card" :padding="14">
          <div v-if="item.phase === 'Running'" slot="extra">
            <a href="#" @click.prevent="removeAddons(item)">
              <Icon type="trash-a" size="18" color="#ed5e69"></Icon>
            </a>
          </div>
          <div style="text-align: center;">
            <div><b>{{ translateKey('card_addons_tabpane_title_' + item.name) }}</b></div>
            <div style="min-height: 120px; margin: 10px 0;">
              <img :src="imageURL(item.name)" style="max-height: 120px;"></img>
            </div>
            <vue-markdown :source="translateKey('card_addons_tabpane_description_' + item.name)"></vue-markdown>
          </div>
          <Button v-if="item.phase === 'Pending'" type="success" long loading style="margin-top: 16px;">{{ translateKey('button_addons_tabpane_card_pending') }}</Button>
          <Button v-else :type="item.buttonType" long style="margin-top: 16px;" @click="addonAction(item)">{{ translateKey('button_addons_tabpane_card_' + item.phase.toLowerCase()) }}</Button>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { fetchDefaults, updateIKMCluster } from '@/api/kubernetesCRD'

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
    translateKey (key) {
      return this.$t(key)
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
          title: this.translateKey('dialog_' + addon.phase.toLowerCase() + '_addon_title'),
          content: this.translateKey('dialog_install_addon_description') + this.translateKey('card_addons_tabpane_title_' + addon.name) + '?',
          closable: true,
          cancelText: this.translateKey('button_addons_dialog_cancel'),
          onOk: () => {
            let name = this.$route.params.show_name.toString()
            let addonsSpec = this.handleAddonAction(addon.name)
            updateIKMCluster(name, addonsSpec).then(result => {
              this.$Notice.success({
                title: this.translateKey('notify_message_addon_install_start') + this.translateKey('card_addons_tabpane_title_' + addon.name)
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
        title: this.translateKey('dialog_uninstall_addon_title'),
        content: this.translateKey('dialog_uninstall_addon_description') + this.translateKey('card_addons_tabpane_title_' + addon.name) + '?',
        closable: true,
        cancelText: this.translateKey('button_addons_dialog_cancel'),
        onOk: () => {
          let name = this.$route.params.show_name.toString()
          let addonsSpec = this.handleAddonAction(addon.name)
          updateIKMCluster(name, addonsSpec).then(result => {
            this.$Notice.success({
              title: this.translateKey('notify_message_addon_uninstall_start') + this.translateKey('card_addons_tabpane_title_' + addon.name)
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
      addonSpec[specKey] = { addons: addons }
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
    // border: 1px solid rgba(73, 80, 96, 0.4);
    border-radius: 4px;
    // box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
    box-shadow: 1px 1px 3px #8FA4B1;
  }
</style>
