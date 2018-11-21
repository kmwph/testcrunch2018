import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from './App';
import router from './router';
import store from './store';
import components from './components';
import alertService from './services/alertManager';


Vue.use(Vuetify);
Vue.use(components);
Vue.use(alertService);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
