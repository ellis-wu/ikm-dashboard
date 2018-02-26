<template>
  <div v-if="isAPIResponse">
    <div class="page-title">{{translateKey('content', 'setting' + clusterData.spec.type)}}</div>
    <Button type="primary" size="large" icon="archive" @click="handleSave" style="float: right;" :disabled="isBtnDisabled">Save</Button>
    <template v-for="(defaultItem, defaultKey) in defaultsData" v-if="showSettingGroups[clusterData.spec.type].indexOf(defaultKey) >= 0">
      <div class="page-group__form">
        <div class="page-group__title">{{translateKey('form', 'setting_group_' + defaultKey )}}</div>
        <Form class="settingForm" :ref="defaultKey" :model="formData[clusterData.spec.type][defaultKey]" label-position="left">
          <FormItem v-for="(item, key) in defaultItem" :prop="key" :key="key" :rules="getFormRule(item.default)">
            <label class="setting-form__item">{{translateKey('form', 'setting_' + key)}}</label>
            <Select v-if="item.type === 'select'" v-model="formData[clusterData.spec.type][defaultKey][key]" :transfer="true" @on-change="handleFormChangeValidate()" style="width: 200px;">
              <Option v-for="option in item.options" :key="option" :value="option">{{option}}</Option>
            </Select>
            <Input
              v-if="item.type === 'input'"
              v-model="formData[clusterData.spec.type][defaultKey][key]"
              @on-change="handleFormChangeValidate()"
              style="width: 200px;">
            </input>
            <span style="margin-left: 20px; color: #8c8c8c;">{{translateKey('help', 'setting_' + key)}}</span>
          </FormItem>
        </Form>
    </div>
    </template>
    <div class="page-group__form">
      <div class="page-group__title">Extra</div>
    </div>
  </div>
</template>

<script>
import { fetchDefaults, updateIKMCluster } from '@/api/kubernetesCRD'

const showSettingGroups = {
  Kubernetes: [
    'basic',
    'network'
  ],
  Ceph: [
    'basic'
  ]
}

export default {
  props: {
    clusterData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      defaultsData: {},
      showSettingGroups,
      isAPIResponse: false,
      isBtnDisabled: true,
      formData: {
        Kubernetes: {},
        Ceph: {}
      }
    }
  },
  watch: {
    clusterData: function (value) {
      this.getDefaults()
    }
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    getSettingDefaultsValue (key, dv) {
      if (this.clusterData.spec.type === 'Kubernetes') {
        if (this.clusterData.spec.hasOwnProperty('kubernetesSpec')) {
          if (this.clusterData.spec.kubernetesSpec.hasOwnProperty(key)) {
            return this.clusterData.spec.kubernetesSpec[key].toString()
          }
        }
        return dv.toString()
      } else if (this.clusterData.spec.type === 'Ceph') {
        if (this.clusterData.spec.hasOwnProperty('cephSpec')) {
          if (this.clusterData.spec.kubernetesSpec.hasOwnProperty(key)) {
            return this.clusterData.spec.kubernetesSpec[key].toString()
          }
        }
        return dv.toString()
      }
    },
    getDefaults () {
      var type = this.clusterData.spec.type
      fetchDefaults(type.toLowerCase()).then(result => {
        this.defaultsData = result.spec
        for (var groupKey in result.spec) {
          if (this.showSettingGroups[type].indexOf(groupKey) >= 0) {
            this.formData[type][groupKey] = {}
            for (var itemKey in result.spec[groupKey]) {
              this.formData[type][groupKey][itemKey] = this.getSettingDefaultsValue(itemKey, result.spec[groupKey][itemKey].default)
            }
          }
        }
        this.isAPIResponse = true
      }).catch((err) => {
        console.log(err)
        // this.$router.push({ path: '/401' })
      })
    },
    getFormRule (value) {
      var rule = {
        required: true,
        message: 'This field can not be empty',
        trigger: 'blur'
      }
      return rule
    },
    formValidate () {
      var validateForm = true
      var type = this.clusterData.spec.type
      for (var key in showSettingGroups[type]) {
        this.$refs[showSettingGroups[type][key]][0].validate((valid) => {
          if (!valid) {
            validateForm = validateForm && false
          }
        })
      }
      return validateForm
    },
    handleFormChangeValidate () {
      this.isBtnDisabled = !this.formValidate()
    },
    handleSave () {
      if (this.formValidate()) {
        var clusterSpecs = {}
        var type = this.clusterData.spec.type
        for (var groupKey in this.formData[type]) {
          for (var itemKey in this.formData[type][groupKey]) {
            clusterSpecs[itemKey] = this.formData[type][groupKey][itemKey]
          }
        }
        let name = this.$route.params.show_name.toString()
        updateIKMCluster(name, clusterSpecs).then(result => {
          this.isBtnDisabled = true
          this.$Notice.success({
            title: '更新成功'
          })
        })
      }
    }
  },
  created () {
    this.getDefaults()
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
  .page-group {
    &__form {
      background: #f8f8f8;
      margin-bottom: 20px;
      border-radius: 4px;
      border-left: 5px solid #19B5FE;
      padding: 10px;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
    }
    &__title {
      font-size: 21px;
      font-weight: 400;
      color: #5c636a;
      border-bottom: 1px solid #bebebe;
      margin: 0 0 30px;
    }
  }
  .setting-form {
    padding: 0 10px;
    margin-bottom: 10px;
    &__item {
      display: inline-block;
      width: 200px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      margin-right: 5px;
    }
    &__input {
      background: #f2f5f5;
      border-color: #dde4e6;
    }
  }
</style>
