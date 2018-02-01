export default {
  login: {
    username: 'Username',
    password: 'Password',
    login_btn: '登入'
  },
  route: {
    // cluster: '叢集',
    clusterPage: '叢集',
    dashboard: '儀表板',
    errorPages: '錯誤頁面',
    info: '資訊',
    page401: '401',
    page404: '404'
  },
  notify: {
    switchLanguageSuccess: '切換中文成功'
  },
  button: {
    cancel: '取消',
    create: '建立',
    create_cluster: '建立叢集',
    new: '新建',
    nextStep_btn: '下一步',
    prevStep_btn: '上一步',
    operational: '可操作',
    update: '更新',
    back_btn: '返回',
    goHome_btn: '返回首頁',
    logout_btn: '登出'
  },
  dialog: {
    cluster_information: '叢集資訊',
    update_cluster: '更新叢集'
  },
  form: {
    type: '類型',
    type_placeholder: '請選擇類型',
    name: '名稱',
    name_placeholder: '請輸入名稱',
    setting_group_basic: '基本設定',
    setting_group_network: '網路設定',
    setting_apiServerPort: 'API 服務 Port',
    setting_containerRuntime: '容器 Runtime',
    setting_version: '版本',
    setting_dnsDomain: 'DNS Domain',
    setting_networkPlugin: '網路 Plugin',
    setting_podNetworkCIDR: 'POD 網路 CIDR',
    setting_serviceNetworkCIDR: '服務網路 CIDR',
    setting_versionName: '版本'
  },
  select: {
    baremetal: '裸機',
    kubernetes: 'Kubernetes',
    ceph: 'Ceph'
  },
  help: {
    setting_apiServerPort: 'API Server 的 Port',
    setting_containerRuntime: 'Kubernetes 容器的 Runtime',
    setting_version: 'Kubernetes 版本',
    setting_dnsDomain: 'Kubernetes DNS Domain',
    setting_networkPlugin: 'Kubernetes CNI 網路 Plugin',
    setting_podNetworkCIDR: 'Kubernetes Pod 的網路 CIDR',
    setting_serviceNetworkCIDR: 'Kubernetes Service 的網路 CIDR',
    setting_versionName: 'Ceph 版本名稱'
  },
  content: {
    settingKubernetes: 'Kubernetes 設定',
    settingCeph: 'Ceph 設定',
    clusterCardName: '名稱',
    clusterCardStatus: '狀態',
    clusterCardType: '類型',
    clusterCardProvisioner: '部署方式',
    version: '版本',
    apiServerAddress: 'API Server 位址',
    apiServerPort: 'API Server Port',
    containerRuntime: '容器 Runtime',
    dnsDomain: 'DNS Domain',
    podNetworkCIDR: 'POD 網路 CIDR',
    AdvertiseAddr: 'Advertise Address',
    serviceNetworkCIDR: '服務 CIDR',
    networkPlugin: '網路插件',
    clusterCIDR: '叢集 CIDR',
    publicCIDR: 'Public CIDR',
    versionName: '版本',
    fsid: 'FSID',
    token: 'Token',
    titleEmpty: '你還沒有任何叢集',
    textEmpty: '您必須先建立一個叢集，請點擊以下按鈕新建一個叢集',
    title401: '你沒有權限訪問該頁面',
    text401: '如有任何問題請聯繫管理員',
    title404: '網頁不存在......',
    text404: '請檢查您輸入的網址是否正確，請點擊以下按鈕返回首頁'
  }
}
