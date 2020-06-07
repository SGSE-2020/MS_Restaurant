import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'

Vue.config.productionTip = false

var config = {
  apiKey: "AIzaSyBvTg0_QrhEvQ9UeZPH8--E2JZ55KA_u_c",
  authDomain: "smart-city-ss2020.firebaseapp.com",
  databaseURL: "https://smart-city-ss2020.firebaseio.com",
  projectId: "smart-city-ss2020",
  storageBucket: "smart-city-ss2020.appspot.com",
  messagingSenderId: "957240233717"
};
firebase.initializeApp(config);

Vue.use(Buefy)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
