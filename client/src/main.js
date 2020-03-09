import Vue from 'vue'
import App from './App.vue'
import Cookie from 'vue-cookies'

Vue.config.productionTip = false


Vue.use(Cookie)

new Vue({
  render: h => h(App),
}).$mount('#app')
