<template>
  <div class="cluster-container">
    <Spin size="large" v-if="isLoading" style="display: table; margin: 20% auto;"></Spin>

    <div v-if="!isLoading && ikmClusters.length === 0" class="empty-wrapper">
      <img class="pic-empty" :src="emptyImage" alt="no cluster">
      <h1 class="text-title">{{ translateKey('description_cluster_list_empty_title') }}</h1>
      <h3 class="text-description">{{ translateKey('description_cluster_list_empty_subtitle') }}</h3>
      <Button class="create-btn" @click="handleCreate" type="primary" icon="plus-round" shape="circle" size="large">{{translateKey('button_create_cluster')}}</Button>
    </div>

    <div v-if="!isLoading && ikmClusters.length > 0" class="clusterCard-wrapper">
      <BackTop :height="115" :bottom="50"></BackTop>
      <div>
        <span style="height: 36px; font-size: 24px; font-weight: bold;">{{ translateKey('page_title_cluster_list') }}</span>
        <Button @click="handleCreate" type="primary" icon="plus-round" size="large" style="float: right;">{{ translateKey('button_create_cluster') }}</Button>
      </div>
      <Row :gutter="16" type="flex" align="middle">
        <Col :xs="24" :sm="12":md="12" :lg="8" v-for="(item, index) in ikmClusters" :key="index" style="padding-top: 15px;">
          <Card class="cluster-card" v-on:click.native="clickCluster(item)" :padding="10" style="border-top: 4px solid #2abb9b; box-shadow: 2px 2px 6px rgba(0, 0, 0, .2);">
            <p slot="title" style="font-size: 18px; margin: -4px -6px">{{ item.metadata.name }}</p>
            <div class="cluster-card__info">
              <div class="cluster-card__title">{{ translateKey('card_cluster_list_item_type') }}</div>
              <Tag :color="item.spec.type === 'Ceph' ? 'red' : 'blue'" style="margin: 0; cursor: initial;">{{item.spec.type}}</Tag>
              <div class="cluster-card__title">{{ translateKey('card_cluster_list_item_provisioner') }}</div>
              <div class="cluster-card__value">{{ item.spec.provisionerSpec.type }}</div>
            </div>
            <div style="text-align: center; margin-top: 5px; border-top: 1px dotted #8c8c8c; padding-top: 10px;">
              <template v-if="item.status">
                <span v-if="item.status.state==='New'" class="button-new">{{ translateKey('button_cluster_list_card_new') }}</span>
                <span v-else class="button-update">{{ translateKey('button_cluster_list_card_operational') }}</span>
              </template>
              <span v-else class="button-new">{{ translateKey('button_cluster_list_card_creating') }}</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <Modal v-model="dialogFormVisible" :title="translateKey('dialog_title_create_cluster')" :width="650" :loading="true">
      <Form ref="dataForm" :model="temp" label-position="left" :label-width="100">
        <FormItem :label="translateKey('form_create_cluster_name')" prop="name" :rules="getFormRule('name')">
          <Input v-model="temp.name" :placeholder="translateKey('input_placeholder_create_cluster_name')" @on-change="handleFormChangeValidate()"></Input>
        </FormItem>
        <FormItem v-for="(item, key) in temp" :key="key" v-if="key !== 'name'" :label="translateKey('form_create_cluster_' + key)" :prop="key" :rules="getFormRule(key)">
          <Select v-if="ikmDefaults[key].type === 'select'" v-model="temp[key]" :transfer="true" @on-change="handleFormChangeValidate()">
            <Option v-for="option in ikmDefaults[key].options" :key="option" :value="option">{{option}}</Option>
          </Select>
          <Input v-if="ikmDefaults[key].type === 'input'" v-model="temp[key]"></Input>
        </FormItem>
      </Form>

      <div slot="footer" class="modal-footer">
        <Button @click="dialogFormVisible=false" icon="close-round">{{ translateKey('button_create_cluster_dialog_cancel') }}</Button>
        <Button type="primary" icon="checkmark-round" @click="createData" :disabled="isBtnDisabled">{{ translateKey('button_create_cluster_dialog_create') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import emptyImage from '@/assets/Empty_images/empty.png'
import { fetchDefaults, fetchClustersList, watchIKMCluster, createIKMCluster } from '@/api/kubernetesCRD'

const JSONStream = require('json-stream')
const createClusterDefaultGroups = {
  Kubernetes: [
    'basic',
    'network'
  ],
  Ceph: [
    'basic'
  ]
}

export default {
  name: 'cluster-list',
  data () {
    return {
      emptyImage,
      createClusterDefaultGroups,
      ikmClusters: [],
      ikmDefaults: null,
      isLoading: true,
      isBtnDisabled: true,
      temp: {
        name: ''
      },
      dialogFormVisible: false
    }
  },
  created () {
    this.getClustersList()
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    },
    clickCluster: function (info, event) {
      this.$router.push({
        name: 'cluster-info',
        params: {
          show_name: info.metadata.name
        }
      })
    },
    getFormRule (value) {
      var rule = {
        required: true,
        message: this.translateKey('form_validate_create_cluster_name'),
        trigger: 'blur'
      }
      return rule
    },
    formValidate () {
      var validateForm = true
      for (var key in this.temp) {
        validateForm = validateForm && Boolean(this.temp[key])
      }
      return validateForm
    },
    handleFormChangeValidate () {
      this.isBtnDisabled = !this.formValidate()
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.isBtnDisabled = true
        this.$refs['dataForm'].resetFields()
      })
    },
    createData () {
      if (this.formValidate()) {
        this.dialogFormVisible = false
        var clusterSpecs = {}
        fetchDefaults(this.temp.cluster.toLowerCase()).then(result => {
          for (var defaultKey in result.spec) {
            if (this.createClusterDefaultGroups[this.temp.cluster].indexOf(defaultKey) > -1) {
              for (var itemKey in result.spec[defaultKey]) {
                clusterSpecs[itemKey] = result.spec[defaultKey][itemKey].default
              }
            }
          }
          createIKMCluster(this.temp, clusterSpecs).then(result => {
            this.dialogFormVisible = false
            this.$Notice.success({
              title: this.temp.name + this.translateKey('notify_message_create_cluster_success')
            })
          })
        })
      }
    },
    getClustersList () {
      fetchDefaults('ikm').then(result => {
        this.ikmDefaults = result.spec
        for (var key in result.spec) this.temp[key] = ''
        fetchClustersList().then(result => {
          this.isLoading = Boolean(result.items.length)
          this.watchCluster()
        })
      }).catch(() => {
        console.log('default api failed')
      })
    },
    watchCluster () {
      var jsonStream = new JSONStream()
      var stream = watchIKMCluster()
      stream.pipe(jsonStream)
      this.ikmClusters = []
      jsonStream.on('data', object => {
        this.isLoading = false
        switch (object.type) {
          case 'ADDED':
            this.ikmClusters.push(object.object)
            break
          case 'DELETED':
            for (let key in this.ikmClusters) {
              if (this.ikmClusters[key].metadata.name === object.object.metadata.name) {
                this.ikmClusters.splice(key, 1)
              }
            }
            break
          case 'MODIFIED':
            for (let key in this.ikmClusters) {
              if (this.ikmClusters[key].metadata.name === object.object.metadata.name) {
                this.ikmClusters.splice(key, 1)
                this.ikmClusters.push(object.object)
              }
            }
            break
        }
        this.ikmClusters.sort(function (a, b) {
          return a.metadata.creationTimestamp > b.metadata.creationTimestamp ? 1 : -1
        })
      })
      jsonStream.on('error', err => {
        console.log(err)
        this.watchCluster()
      })
      jsonStream.on('end', () => {
        this.watchCluster()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cluster-container {
    width: 100%;
    height: 100%;
    padding: 16px;
    .empty-wrapper {
      text-align: center;
      margin: auto;
      padding: 7% 0 0 0;
    }
    .cluster-card {
      cursor: pointer;
      .ivu-card-head {
        padding: 10px;
      }
      &__info {
        height: 114px;
      }
      &__title {
        min-height: 22px;
        width: 50%;
        float: left;
        font-weight: bold;
      }
      &__value {
        min-height: 22px;
        width: 50%;
        float: left;
      }
      .button-new {
        font-weight: bold;
        color: #4e85aa;
      }
      .button-update {
        font-weight: bold;
        color: #54a854;
      }
    }
    .text-title {
      font-size: 24px;
      font-weight: bold;
      line-height: 24px;
      color: grey;
    }
    .text-description {
      font-size: 16px;
      line-height: 21px;
      color: #bdc3c7;
    }
    .create-btn {
      margin: 20px 0;
    }
  }
</style>
