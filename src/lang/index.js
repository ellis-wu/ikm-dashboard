import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import Cookies from 'js-cookie'
import iviewENLocale from 'iview/dist/locale/en-US'
import iviewTWLocale from 'iview/dist/locale/zh-TW'
import enLocale from './en'
import twLocale from './tw'

Vue.use(Vuei18n)

const messages = {
  en: {
    ...enLocale,
    ...iviewENLocale
  },
  tw: {
    ...twLocale,
    ...iviewTWLocale
  }
}

// console.log((navigator.language || navigator.browserLangugae).toLowerCase())

const i18n = new Vuei18n({
  // Set locale
  locale: Cookies.get('language') || 'en',
  messages
})

export default i18n
