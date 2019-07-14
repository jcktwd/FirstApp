<template lang="pug">
	div
		navbar(v-on:logout="logout" v-bind:auth="auth" v-bind:user="user")
		div.container.mt-3
			friendly-message(v-bind:message="status")
		router-view(
			v-on:update:status="status = $event"
			v-on:update:user="updateUser" v-on:update:auth="setAuth($event)"
			v-on:logout="logout"
			v-bind:auth="auth"
			v-bind:user="user")
</template>
<script>
import Navbar from "./components/Navbar.vue";
import FriendlyMessage from "./components/FriendlyMessage.vue";
import $ from "jquery";
import Cookies from "js-cookie";
export default {
  components: { Navbar, FriendlyMessage },
  data() {
    return {
      user: {
        username: "",
        forename: "",
        surname: "",
        sub_titles: []
      },
      auth: {
        access_level: "guest",
        access_token: ""
      },
      status: ""
    };
  },

  computed: {
    subscriptions() {
      const self = this;
      return this.courses.filter(course =>
        self.user.sub_titles.includes(course.title)
      );
    }
  },

  created() {
    const auth_cookie = Cookies.get("auth");
    if (auth_cookie != "undefined") {
      this.auth = JSON.parse(auth_cookie);
      this.updateUser();
    }
  },

  methods: {
    logout() {
      (this.user = {
        username: "",
        forename: "",
        surname: "",
        sub_titles: []
      }),
        (this.auth = {
          access_level: "guest",
          access_token: ""
        });
      this.status = `User ${this.user.username} has been logged out.`;
      Cookies.remove("auth");
    },

    setAuth(newAuth) {
      Cookies.set("auth", newAuth, { expires: 1 });
      this.auth = newAuth;
    },

    updateUser() {
      const self = this;
      $.ajax({
        type: "GET",
        url: "/whoami",
        data: {
          access_token: this.auth.access_token
        },
        dataType: "json",
        success(result, status, xhr) {
          self.user = result;
        },
        error(xhr, status, error) {
          alert(status + error);
        }
      });
    }
  }
};
</script>
<style>
body {
  background-color: #e6e6e6;
}

.card {
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}

.text-bold {
  font-weight: 600;
}

.btn {
  border-radius: 1rem;
}

.mh-100 {
  min-height: 100%;
}

.paper {
  background-image: linear-gradient(
      90deg,
      transparent 36px,
      #f00 36px,
      transparent 37px,
      transparent 40px,
      #f00 40px,
      transparent 42px
    ),
    linear-gradient(#999 0.05em, transparent 0.05em);
  background-size: 100% 1.5em;
  min-height: 12em;
}
</style>
