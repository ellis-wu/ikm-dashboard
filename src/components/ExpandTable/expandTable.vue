<template>
  <Table :columns="getColumns()"
    :data="data"
    @on-select="selectItem"
    @on-select-cancel="cancelItem"
    @on-select-all="selectItem">
  </Table>
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
    columns: Array,
    data: Array
  },
  created () {
    this.getColumns()
  },
  methods: {
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
    selectItem (selection, row) {
      this.$emit('selectItem', selection)
    },
    cancelItem (selection, row) {
      this.$emit('selectItem', selection)
    }
  }
}
</script>
