<template>
  <Table :columns="getColumns()" :data="data"></Table>
</template>

<script>
import expandView from './expandView.vue'

export default {
  components: {
    expandView
  },
  props: {
    columns: Array,
    data: Array
  },
  created () {
    this.getColumns()
  },
  methods: {
    getColumns () {
      let expandColumns = []
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
      this.columns.forEach(function (value) {
        expandColumns.push(value)
      })
      return expandColumns
    }
  }
}
</script>
