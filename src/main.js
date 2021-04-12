import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import 'element-plus/lib/theme-chalk/index.css';
import ElementPlus from 'element-plus'

// import { Pagination } from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css';

require('./css/my-el.css')
require('./css/myorder.css')
require('./css/myorder-mobile.css')
require('./css/iconfont.css')

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
