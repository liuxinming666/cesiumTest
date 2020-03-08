import Vue from 'vue'
import App from './App.vue'

//导入lodash组件
let _ = require('lodash');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
