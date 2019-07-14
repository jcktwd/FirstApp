<template lang="pug">
	form(v-on:submit.prevent="login")
		div.form-group
			div.input-group
				div.input-group-prepend
					div.input-group-text
						i.fa.fa-fw.fa-at.text-info
				input.form-control(v-model="username" type="text" placeholder="Username" required/)
		div.form-group
			div.input-group
				div.input-group-prepend
					div.input-group-text
						i.fa.fa-fw.fa-lock.text-info
				input.form-control(v-model="password" type="password" placeholder="Password" required)
		div.form-group(v-if="errorMsg != ''")
			p.text-danger.text-center {{errorMsg}}
		div.form-group
			button.btn.btn-info.text-light.text-bold.w-100(type="submit") Login
</template>
<script>
import $ from "jquery";
export default {
  name: "login-form",
  data() {
    return {
      username: "",
      password: "",
      errorMsg: ""
    };
  },
  methods: {
    login() {
      var self = this;
      $.ajax({
        type: "POST",
        url: "/login",
        data: {
          username: this.username,
          password: this.password
        },
        dataType: "json",
        success(result, status, xhr) {
          self.$emit("update:auth", {
            access_level: result.access_level,
            access_token: result.access_token
          });
          self.$emit("update:user");
          self.$emit("update:status", result.message);
          self.errorMsg = "";
          self.$router.push(`/users/${self.username}/dash`);
        },
        error(xhr, status, error) {
          self.errorMsg = xhr.responseText;
        }
      });
    }
  }
};
</script>
