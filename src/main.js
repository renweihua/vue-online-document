import Vue from "vue";
import store from './store/main';
import App from "./App.vue";
//自定义路由配置
import router from "./router";
//复制到剪贴板
import VueClipboard from "vue2-clipboard";

//markdown组件
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
//element ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 展示json数据
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer);

// 定义Http请求状态
Vue.prototype.HTTP_SUCCESS = 200;


Vue.config.productionTip = false;
Vue.use(mavonEditor);
//medium / small / mini
Vue.use(ElementUI,{ size: 'medium', zIndex: 3000 });
Vue.use(VueClipboard);


Vue.prototype.BASE_URL = 'http://laravel-online-document.local.com:8090/api';

//实例化Vue
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");