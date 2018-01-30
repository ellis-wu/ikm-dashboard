import router from './router'
import store from './store'
import iView from 'iview'
import { getToken } from '@/utils/auth'

// permissiom judge
function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// Whitelist
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      iView.LoadingBar.finish()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res => {
          const roles = res.role
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true })
          })
        }).catch(() => {
          store.dispatch('FrontEndLogout').then(() => {
            this.$Message.error('驗證失敗，請重新登入')
            next({ path: '/login' })
          })
        })
      } else {
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next()//
        } else {
          next({path: '/401', query: { noGoBack: true }})
          iView.LoadingBar.finish()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      iView.LoadingBar.finish()
    }
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish()
})
