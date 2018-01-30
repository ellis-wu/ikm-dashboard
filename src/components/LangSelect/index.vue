<template>
  <div style="display: inline-block; padding: 0 6px;">
    <Dropdown transfer trigger="click" @on-click="handleClickLangDropdown" placement="bottom-end">
      <a href="javascript:void(0)">
        <Icon type="android-hangout" style="marginTop: -2px; verticalAlign: middle" color="#495060" size="24"></Icon>
        <!-- <Icon type="arrow-down-b" style="margin-left: 5px;"></Icon> -->
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="en" :disabled="language==='en'">English(EN)</DropdownItem>
        <DropdownItem name="tw" :disabled="language==='tw'">中文(TW)</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.getters.language
    }
  },
  methods: {
    translateKey (key) {
      return this.$t('notify.' + key)
    },
    handleClickLangDropdown (lang) {
      if (this.$i18n.locale !== lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
        this.$Message.success(this.translateKey('switchLanguageSuccess'))
      }
    }
  }
}
</script>
