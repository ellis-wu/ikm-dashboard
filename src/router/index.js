import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: {
        title: 'dashboard',
        icon: 'android-color-palette',
        noCache: true
      }
    }]
  }
]

export default new Router({
  // mode: 'history',
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/cluster',
    component: Layout,
    redirect: '/cluster/index',
    name: 'clusterPage',
    onepage: true,
    meta: {
      title: 'clusterPage',
      icon: 'cube'
    },
    children: [
      {
        path: 'index',
        component: _import('cluster/list'),
        name: 'cluster-list',
        meta: {
          nobreadcrumbtitle: true,
          title: 'clusterPage',
          icon: 'cube'
        }
      },
      {
        path: 'info/:show_name',
        component: _import('cluster/info'),
        name: 'cluster-info',
        hidden: true,
        meta: {
          title: 'notitle',
          icon: 'cube'
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: 'android-warning'
    },
    children: [
      {
        path: '401',
        component: _import('errorPage/401'),
        name: 'page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: _import('errorPage/404'),
        name: 'page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
