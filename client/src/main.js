import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  render(h) {
    return h(App);
  }
});
