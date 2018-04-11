<template>
  <div class="dashboard-container">
    <h1>[WIP] Dashboard</h1>
    <Table :columns="columns1"></Table>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
</style>
