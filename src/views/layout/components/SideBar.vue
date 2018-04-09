<template>
  <Menu :active-name="$route.meta.activeMenu || $route.path" :open-names="[$route.meta.topMenu]" theme="dark" width="auto" class="menu-item">
    <!-- <div style="height: 64px;">123</div> -->
    <div style="height: 64px; position: relative;">
      <img class="logo-image" :src="imgLogo"  alt="logo" />
    </div>
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
import imgLogo from '@/assets/side_logo_images/side_logo.png'

export default {
  name: 'SideBar',
  props: {
    routes: {
      type: Array
    }
  },
  data () {
    return {
      imgLogo
    }
  },
  methods: {
    translateKey (key) {
      return this.$t(key)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.logo-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
