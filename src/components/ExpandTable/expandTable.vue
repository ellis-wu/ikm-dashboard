<template>
  <div>
    <Table :columns="getColumns()"
      :data="pageTableDatas"
      :height="getTableHeight()"
      @on-select="selectItems"
      @on-select-cancel="cancelItems"
      @on-select-all="selectItems"
      @on-selection-change="selectChange">
    </Table>
    <div style="margin: 10px 0 0 10px; overflow: hidden">
      <div style="float: right;">
        <Page :total="data.length"
          :current="1"
          :page-size="pageSize"
          simple
          @on-change="changePage">
        </Page>
      </div>
    </div>
  </div>
</template>

<script>
import expandView from './expandView.vue'

export default {
  components: {
    expandView
  },
  props: {
    selection: false,
    expand: false,
    columns: {
      type: Array,
      require: true
    },
    data: {
      type: Array,
      require: true
    }
  },
  watch: {
    data: {
      handler: function (val) {
        this.getPageTableDatas()
      },
      deep: true
    }
  },
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      pageTableDatas: [],
      historyDatas: []
    }
  },
  created () {
    this.getPageTableDatas()
  },
  methods: {
    getTableHeight () {
      if (!this.data.length) {
        return ''
      }
      return 40 + this.pageSize * 48 + 1
    },
    getColumns () {
      let expandColumns = []
      if (this.selection) {
        expandColumns.push({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      }
      if (this.expand) {
        expandColumns.push({
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandView, {
              props: {
                row: params.row
              }
            })
          }
        })
      }
      this.columns.forEach(function (value) {
        expandColumns.push(value)
      })
      return expandColumns
    },
    getPageTableDatas () {
      this.historyDatas = JSON.parse(JSON.stringify(this.data))
      if (this.data.length < this.pageSize) {
        this.pageTableDatas = this.historyDatas
      } else {
        this.pageTableDatas = this.historyDatas.slice(0, this.pageSize)
      }
    },
    changePage (page) {
      this.currentPage = page
      let start = (page - 1) * this.pageSize
      let end = page * this.pageSize
      this.pageTableDatas = this.historyDatas.slice(start, end)
    },
    selectItems (selection, row) {
      selection.forEach(selected => {
        this.historyDatas.forEach(agent => {
          if (agent.name.uuid === selected.name.uuid) {
            agent._checked = true
          }
        })
      })
    },
    cancelItems (selection, row) {
      this.historyDatas.forEach(agent => {
        if (agent.name.uuid === row.name.uuid) {
          agent._checked = false
        }
      })
    },
    selectChange (selection) {
      if (!selection.length) {
        this.historyDatas.forEach(agent => {
          this.pageTableDatas.forEach(pageDatas => {
            if (agent.name.uuid === pageDatas.name.uuid) {
              agent._checked = false
            }
          })
        })
      }
      this.$emit('selectItems', this.historyDatas.filter(data => { return data._checked }))
      console.log(this.historyDatas.filter(data => {
        return data._checked
      }))
    },
    cancelAction () {
      console.log('cancel select agents dialog in child component')
      this.historyDatas = this.data
    }
  }
}
</script>
