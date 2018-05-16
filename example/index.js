import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Example from './example.vue';
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(Example)
});
