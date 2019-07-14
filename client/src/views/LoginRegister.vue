<template lang="pug">
	div.container.mt-3
		div.row
			div.col-lg-6.mx-auto.my-5
				img.w-100(src="../assets/logo-black.svg")
		div.row
			div.col-lg-6.mb-3
				div.card.h-100.bg-dark
					h3.card-header.text-light.text-center.text-bold Login
					div.card-body.h-100.m-3
						login-form(
							v-on:update:user="$emit('update:user')"
							v-on:update:auth="$emit('update:auth', $event)"
							v-on:update:status="$emit('update:status', $event)"
							v-on:update:error="error=$event")
			div.col-lg-6.mb-3
				div.card.h-100.bg-info
					h3.card-header.text-light.text-center.text-bold Register
					div.card-body.h-100.m-3
						register-form(
							v-on:update:user="$emit('update:user')"
							v-on:update:auth="$emit('update:auth', $event)"
							v-on:update:status="$emit('update:status', $event)"
							v-on:update:error="error=$event")
</template>
<script>
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
export default {
  name: "pageLoginRegister",
  props: ["user", "auth"],
  components: {
    LoginForm,
    RegisterForm,
    ErrorMessage
  },
  data() {
    return {
      error: ""
    };
  }
};
</script>
