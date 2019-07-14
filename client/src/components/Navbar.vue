<template lang="pug">
    nav.navbar.navbar-expand-md.navbar-dark.bg-dark
        button.navbar-toggler(type="button" data-target="#navbar" data-toggle="collapse")
            span.navbar-toggler-icon
        img(src="../assets/logo-white.svg" style="height:40px;")
        div.collapse.navbar-collapse(id="navbar")
            ul.navbar-nav.mr-auto
                li.nav-item
                    router-link.nav-link(to="/about") About
                li.nav-item(v-if="isGuest")
                    router-link.nav-link(to="/login") Login/Register
                li.nav-item(v-if="isLogin")
                    router-link.nav-link(to="/login" v-on:click.native="$emit('logout')") Logout
                li.nav-item(v-if="isLogin")
                    router-link.nav-link(v-bind:to="`/users/${user.username}/dash`") Dashboard
                li.nav-item(v-if="isLogin")
                    router-link.nav-link(v-bind:to="`/users/${user.username}/subs`") Subscriptions
                li.nav-item(v-if="isLogin")
                    router-link.nav-link(v-bind:to="`/users/${user.username}/post`") Post
                li.nav-item(v-if="isAdmin")
                    router-link.nav-link(to="/admin") Admin
</template>
<script>
export default {
  name: "navbar",
  props: ["auth", "user"],
  computed: {
    isLogin: function() {
      return ["login", "admin"].includes(this.auth.access_level);
    },
    isAdmin: function() {
      return this.auth.access_level == "admin";
    },
    isGuest: function() {
      return this.auth.access_level == "guest";
    }
  }
};
</script>
