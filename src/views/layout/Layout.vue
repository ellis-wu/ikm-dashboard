<template>
  <div class="app-wrapper">
    <div class="main-container">
      <Layout style="height: 100%; min-height: 100vh;">
        <Sider ref="sidebar" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="position: fixed; height: 100vh; left: 0; overflow: auto;">
          <SideBar :routes="permission_routers"></SideBar>
        </Sider>
        <Layout style="margin-left: 200px; background: #e3e8ee;">
          <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', padding: 0}">
            <breadcrumb class="breadcrumb-container"></breadcrumb>
            <div class="right-menu">
              <!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon> -->
              <lang-select class="international right-menu-item"></lang-select>
              <Dropdown class="user-container right-menu-item" transfer trigger="click" @on-click="logout" placement="bottom-end">
                <a href="javascript:void(0)">
                  <Avatar icon="person" />
                  <span class="user-name" style="padding-left: 6px;">admin</span>
                  <Icon type="arrow-down-b" style="margin-left: 5px;"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="logout">{{translateKey('button', 'logout_btn')}}</DropdownItem>
                  <!-- <DropdownItem name="en" :disabled="language==='en'">English(EN)</DropdownItem> -->
                </DropdownMenu>
              </Dropdown>
            </div>
          </Header>
          <Content>
          <!-- <Content :style="{padding: '0 16px 16px'}"> -->
            <app-main></app-main>
          </Content>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AppMain, SideBar } from './components'
import Breadcrumb from '@/components/Breadcrumb'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'layout',
  components: {
    AppMain,
    SideBar,
    Breadcrumb,
    LangSelect
  },
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  },
  methods: {
    translateKey (type, key) {
      return this.$t(type + '.' + key)
    },
    logout () {
      this.$store.dispatch('Logout').then(() => {
        // Reload vue-router avoid bug occur
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-wrapper {
	  position: relative;
	  height: 100%;
	  width: 100%;
    .right-menu {
      float: right;
      padding: 0 10px;
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
    }
	}
</style>
