<template>
  <div class="catalog-container" id="test">
    <!-- <h1>catalog</h1> -->
    <iframe id="show-iframe" src="https://kairen.github.io/" frameborder="0" width="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: 'catalog',
  data () {
    return {

    }
  },
  mounted () {
    const oIframe = document.getElementById('show-iframe')
    // const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    // oIframe.style.width = deviceWidth + 'px'
    oIframe.style.height = (deviceHeight - 69) + 'px'
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .catalog-container {
    width: 100%;
    height: 100%;
    // padding: 16px;
  }
</style>
