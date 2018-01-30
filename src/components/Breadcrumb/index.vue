<template>
  <Breadcrumb class="app-breadcrumb" separator="/">
    <BreadcrumbItem v-for="(item, index) in levelList" :key="item.path" v-if="item.meta.title">
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{translateKey(item.meta.title)}}</span>
      <router-link v-else :to="item.redirect||item.path">{{translateKey(item.meta.title)}}</router-link>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    translateKey (key) {
      if (key === 'notitle') {
        return this.$route.params.show_name.toString()
      } else {
        return this.$t('route.' + key)
      }
    },
    getBreadcrumb () {
      // console.log(this.$route)
      let matched = this.$route.matched.filter(item => {
        return item.name && !item.meta.nobreadcrumbtitle
      })
      // matched = matched.filter(item => !item.meta.topMenu)
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.ivu-breadcrumb {
    display: inline-block;
    font-size: 14px;
    margin: 0 16px 0;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
