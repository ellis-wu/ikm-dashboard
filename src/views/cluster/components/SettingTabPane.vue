<template>
  <div v-if="isAPIResponse">
    <div class="page-title">{{ translateKey('tabpane_page_title_setting_' + clusterData.spec.type.toLowerCase()) }}</div>
    <Button type="primary" size="large" icon="archive" @click="handleSave" style="float: right;" :disabled="isBtnDisabled">Save</Button>
    <template v-for="(defaultItem, defaultKey) in defaultsData" v-if="showSettingGroups[clusterData.spec.type].indexOf(defaultKey) >= 0">
      <div class="page-group__form">
        <div class="page-group__title">{{ translateKey('form_setting_tabpane_group_' + defaultKey ) }}</div>
        <Form class="settingForm" :ref="defaultKey" :model="formData[clusterData.spec.type][defaultKey]" label-position="left">
          <FormItem v-for="(item, key) in defaultItem" :prop="key" :key="key" :rules="getFormRule(item.default)">
            <Row>
              <Col span="4">
                <label class="settingForm__item">{{ translateKey('form_setting_tabpane_item_' + key) }}</label>
              </Col>
              <Col span="5" offset="1">
                <Select v-if="item.type === 'select'" v-model="formData[clusterData.spec.type][defaultKey][key]" :transfer="true" @on-change="handleFormChangeValidate()">
                  <Option v-for="option in item.options" :key="option" :value="option">{{option}}</Option>
                </Select>
                <Input v-if="item.type === 'input'" v-model="formData[clusterData.spec.type][defaultKey][key]" @on-change="handleFormChangeValidate()"></input>
              </Col>
              <Col span="13" offset="1">
                <span style="color: #8c8c8c;">{{ translateKey('help_setting_tabpane_' + key) }}</span>
              </Col>
            </Row>
          </FormItem>
        </Form>
    </div>
    </template>
    <div class="page-group__form">
      <div class="page-group__title">{{ translateKey('form_setting_tabpane_group_extra') }}</div>
      <!-- <a target="_blank" href="https://www.google.com.tw/">Link</a> -->
      <vue-markdown class="page-group__description" :source="translateKey('help_setting_tabpane_extra')"></vue-markdown>
      <Form class="settingForm" ref="extra" :model="extraForm">
        <Row v-if="extraForm.items.length > 0">
          <Col span="10">
            <div class="settingForm__item">Variable</div>
          </Col>
          <Col span="10" offset="1">
            <div class="settingForm__item">Value</div>
          </Col>
          <Col span="2" offset="1">
          </Col>
        </Row>
        <FormItem v-for="(item, index) in extraForm.items" :key="index" :prop="'items.' + index + '.value'">
          <Row>
            <Col span="10">
              <Input type="text" v-model="item.variable" placeholder="e.g. FOO" @on-change="handleFormChangeValidate()"></Input>
            </Col>
            <Col span="10" offset="1">
              <Input type="text" v-model="item.value" placeholder="e.g. bar" @on-change="handleFormChangeValidate()"></Input>
            </Col>
            <Col span="2" offset="1">
              <Button type="error" icon="minus-round" size="small" @click="handleRemove(index)"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="4">
              <Button type="primary" long @click="handleAdd" icon="plus-round">{{ translateKey('button_setting_tabpane_additems') }}</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
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
  components: {
    VueMarkdown
  },
  data () {
    return {
      defaultsData: {},
      showSettingGroups,
      isAPIResponse: false,
      isBtnDisabled: true,
      oldformData: {},
      formData: {
        Kubernetes: {},
        Ceph: {}
      },
      extraForm: {
        items: []
      },
      extraFormOldData: []
    }
  },
  watch: {
    clusterData: function (value) {
      this.getDefaults()
    }
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
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
          if (this.clusterData.spec.cephSpec.hasOwnProperty(key)) {
            return this.clusterData.spec.cephSpec[key].toString()
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
              this.oldformData[itemKey] = this.getSettingDefaultsValue(itemKey, result.spec[groupKey][itemKey].default)
              this.formData[type][groupKey][itemKey] = this.getSettingDefaultsValue(itemKey, result.spec[groupKey][itemKey].default)
            }
          }
        }

        var typeSpec = type.toLowerCase() + 'Spec'
        var extraOptions = this.clusterData.spec[typeSpec].extraOptions
        this.extraFormOldData = []
        this.extraForm.items = []
        if (this.clusterData.spec[typeSpec] && extraOptions) {
          for (var key in extraOptions) {
            this.extraFormOldData.push({
              variable: extraOptions[key].key,
              value: JSON.stringify(extraOptions[key].value)
            })
            this.extraForm.items.push({
              variable: extraOptions[key].key,
              value: JSON.stringify(extraOptions[key].value)
            })
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
      let sameValidate = this.formDataSameValidate()
      return validateForm && !sameValidate
    },
    formDataSameValidate () {
      var type = this.clusterData.spec.type
      var validate = true
      for (var formKey in this.formData[type]) {
        for (var itemKey in this.formData[type][formKey]) {
          if (this.formData[type][formKey][itemKey] !== this.oldformData[itemKey]) {
            validate = validate && false
          }
        }
      }
      // Validate the extra option is same the original data
      let extraValidate = this.sortExtraData(this.extraForm.items) === this.sortExtraData(this.extraFormOldData)
      validate = validate && extraValidate
      return validate
    },
    sortExtraData (data) {
      return JSON.stringify(data.slice().sort(function (a, b) {
        return a.variable > b.variable ? 1 : -1
      }))
    },
    handleFormChangeValidate () {
      this.isBtnDisabled = !this.formValidate()
    },
    handleSave () {
      if (this.formValidate()) {
        var clusterSpecs = {}
        var specKey = this.clusterData.spec.type.toLowerCase() + 'Spec'
        clusterSpecs[specKey] = {}
        var type = this.clusterData.spec.type
        for (var groupKey in this.formData[type]) {
          for (var itemKey in this.formData[type][groupKey]) {
            clusterSpecs[specKey][itemKey] = this.formData[type][groupKey][itemKey]
          }
        }
        var extraOptions = []
        for (var extraKey in this.extraForm.items) {
          if (this.extraForm.items[extraKey].variable && this.extraForm.items[extraKey].value) {
            extraOptions.push({
              key: this.extraForm.items[extraKey].variable,
              value: JSON.parse(this.extraForm.items[extraKey].value)
            })
          }
        }
        clusterSpecs[specKey]['extraOptions'] = extraOptions
        let name = this.$route.params.show_name.toString()
        updateIKMCluster(name, clusterSpecs).then(result => {
          this.isBtnDisabled = true
          this.$Notice.success({
            title: this.translateKey('notify_message_setting_update_success')
          })
        })
      }
    },
    handleAdd () {
      this.extraForm.items.push({
        variable: '',
        value: ''
      })
      this.handleFormChangeValidate()
    },
    handleRemove (index) {
      this.extraForm.items.splice(index, 1)
      this.handleFormChangeValidate()
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
      // box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);
      box-shadow: 1px 1px 3px #8FA4B1;
    }
    &__title {
      font-size: 21px;
      font-weight: 400;
      color: #5c636a;
      border-bottom: 1px solid #bebebe;
    }
    &__description {
      color: #8c8c8c;
      font-size: 14px;
      margin-top: 15px;
    }
  }
  .settingForm {
    margin-top: 20px;
    &__item {
      padding-left: 2px;
      font-size: 14px;
      font-weight: 600;
    }
    &__input {
      background: #f2f5f5;
      border-color: #dde4e6;
    }
  }
</style>
