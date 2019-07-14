import Vue from "vue";
import Router from "vue-router";
import LoginRegister from "./views/LoginRegister.vue";
import About from "./views/About.vue";
import Dash from "./views/Dash.vue";
import Courses from "./views/Courses.vue";
import Post from "./views/Post.vue";
import Admin from "./views/Admin.vue";
import Unauthorised from "./views/Unauthorised.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: LoginRegister
    },
    {
      path: "/login",
      name: "login",
      component: LoginRegister
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/users/:username/dash",
      name: "dashboard",
      component: Dash,
      props: true
    },
    {
      path: "/users/:username/subs",
      name: "courses",
      component: Courses,
      props: true
    },
    {
      path: "/users/:username/post",
      name: "post",
      component: Post,
      props: true
    },
    {
      path: "/unauthorised",
      name: "unauthorised",
      component: Unauthorised
    }
  ]
});
