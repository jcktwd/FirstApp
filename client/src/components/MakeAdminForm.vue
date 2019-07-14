<template lang="pug">
	form(v-on:submit.prevent="submit")
		div.row
			div.col-9
				div.form-group
					input.form-control(type="text" v-model="username" placeholder="Username" required)
			div.col-3
				div.form-group
					button.btn.btn-info.text-bold.w-100(type="submit") Make Admin
			div.col-12.mt-1(v-if="errorMsg != ''")
				p.text-danger.text-center {{errorMsg}}
			div.col-12.mt-1(v-if="successMsg != ''")
				p.text-primary.text-center {{successMsg}}
</template>
<script>
import $ from "jquery";
export default {
  name: "make-admin-form",
  props: ["auth"],
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      username: ""
    };
  },
  methods: {
    submit() {
      const self = this;
      $.ajax({
        type: "POST",
        url: `/users/${this.username}/admin`,
        data: {
          access_token: this.auth.access_token
        },
        dataType: "text",
        success(result, status, xhr) {
          self.successMsg = result;
          self.errorMsg = "";
        },
        error(xhr, status, error) {
          self.errorMsg = xhr.responseText;
          self.successMsg = "";
        }
      });
    }
  },
  created() {
    if (!this.auth || !this.auth.access_level == "admin") {
      this.$router.push("/unauthorised");
    }
  }
};
</script>
