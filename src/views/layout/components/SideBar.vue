<template>
  <Menu :active-name="$route.meta.activeMenu || $route.path" :open-names="[$route.meta.topMenu]" theme="dark" width="auto" class="menu-item">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <router-link v-if="item.children.length===1 && !item.children[0].children || item.onepage" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <MenuItem :name="item.path+'/'+item.children[0].path">
          <Icon v-if="item.children[0].meta&&item.children[0].meta.icon" :type="item.children[0].meta.icon"></Icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{ translateKey('route_title_' + item.children[0].meta.title) }}</span>
        </MenuItem>
      </router-link>

      <Submenu v-else :name="item.name||item.path" :key="item.name">
        <template slot="title">
          <Icon v-if="item.meta&&item.meta.icon" :type="item.meta.icon"></Icon>
          <span v-if="item.meta&&item.meta.title">{{ translateKey('route_title_' + item.meta.title) }}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <router-link :to="item.path+'/'+child.path" :key="child.name">
            <MenuItem :name="item.path+'/'+child.path">
              <Icon v-if="child.meta&&child.meta.icon" :type="child.meta.icon"></Icon>
              <span v-if="child.meta&&child.meta.title">{{ translateKey('route_title_' + child.meta.title) }}</span>
            </MenuItem>
          </router-link>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    routes: {
      type: Array
    }
  },
  // mounted () {
  //   this.init()
  // },
  methods: {
  //   init () {
  //     // console.log(this.routes)
  //     // console.log(this.$route.meta.topMenu)
  //     for (var item in this.routes) {
  //       console.log(this.routes[item].children)
  //     }
  //   },
    translateKey (key) {
      return this.$t(key)
    }
  }
}
</script>
