<template>
  <div class="cluster-container">
    <Spin size="large" v-if="isLoading" style="display: table; margin: 20% auto;"></Spin>

    <div v-if="!isLoading && clusterList === null" class="empty-wrapper">
      <img class="pic-empty" :src="emptyImage" alt="no cluster">
      <h1 class="text-title">{{translateKey('content', 'titleEmpty')}}</h1>
      <h3 class="text-description">{{translateKey('content', 'textEmpty')}}</h3>
      <Button class="create-btn" @click="handleCreate" type="primary" icon="plus-round" shape="circle" size="large">{{translateKey('button', 'create_cluster')}}</Button>
    </div>

    <div v-if="!isLoading && clusterList !== null" class="clusterCard-wrapper">
      <BackTop :height="100"></BackTop>
      <div>
        <span style="height: 36px; font-size: 24px; font-weight: bold;">My Environments</span>
        <Button @click="handleCreate" type="primary" icon="plus-round" size="large" style="float: right;">{{translateKey('button', 'create_cluster')}}</Button>
      </div>
      <Row :gutter="16" type="flex" align="middle">
        <Col :xs="24" :sm="12":md="12" :lg="8" v-for="(item, index) in clusterList" :key="index" style="padding-top: 10px;">
          <Card class="cluster-card" v-on:click.native="select(item)" :padding="10">
            <p slot="title" style="font-size: 18px; margin: -4px -6px">{{ item.metadata.name }}</p>
            <div class="cluster-card__info">
              <div class="cluster-card__title">{{translateKey('content', 'clusterCardType')}}</div>
              <Tag :color="item.spec.type === 'Ceph' ? 'red' : 'blue'" style="margin: 0">{{item.spec.type}}</Tag>
            </div>
            <div style="text-align: center; margin-top: 5px; border-top: 1px dotted #8c8c8c; padding-top: 10px;">
              <span v-if="item.status.state==='New'" class="button-new">{{translateKey('button', 'new')}}</span>
              <span v-else class="button-update">{{item.status}}{{translateKey('button', 'operational')}}</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <Modal v-model="dialogFormVisible" :title="translateKey('dialog', 'cluster_information')" :width="650">
      <Form :rules="rules" ref="dataForm" :model="temp" label-position="left" :label-width="100">
        <FormItem :label="translateKey('form', 'type')" prop="type">
          <Select v-model="temp.type" :placeholder="translateKey('form', 'type_placeholder')">
            <Option v-for="item in deployTypeOptions" :key="translateKey('select', item.key)" :value="item.key">{{translateKey('select', item.key)}}</Option>
          </Select>
        </FormItem>
        <FormItem :label="translateKey('form', 'name')" prop="name">
          <Input v-model="temp.name" :placeholder="translateKey('form', 'name_placeholder')"></Input>
        </FormItem>
      </Form>

      <div slot="footer" class="modal-footer">
        <Button @click="dialogFormVisible=false" icon="close-round">{{translateKey('button', 'cancel')}}</Button>
        <Button type="primary" icon="checkmark-round" @click="createData">{{translateKey('button', 'create')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import emptyImage from '@/assets/Empty_images/empty.png'
import { fetchClustersList, fetchDefaults } from '@/api/kubernetesCRD'

const deployTypeOptions = [
  { key: 'kubernetes' },
  { key: 'ceph' }
]

export default {
  name: 'cluster-list',
  data () {
    return {
      emptyImage,
      deployTypeOptions,
      clusterList: null,
      isLoading: true,
      temp: {
        name: ''
      },
      dialogFormVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getClustersList()
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    select: function (info, event) {
      this.$router.push({
        name: 'cluster-info',
        params: {
          show_name: info.metadata.name
        }
      })
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          console.log(this.temp.type)
          this.$Notice.success({
            title: this.temp.name + ' 建立成功'
          })
        }
      })
    },
    getClustersList () {
      fetchDefaults('ikm').then(result => {
        console.log(result.spec)
        for (var key in result.spec) {
          this.temp[key] = result.spec[key].default
        }
        console.log(this.temp)
      })
      fetchClustersList().then(result => {
        this.isLoading = false
        if (result.items.length > 0) {
          this.clusterList = result.items
        }
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
