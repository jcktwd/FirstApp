<template lang="pug">
	form(v-on:submit.prevent="submit")
		div.form-group
			input.form-control(type="text" v-model="title" placeholder="Course Title" required)
		div.form-group
			label Default Background Color (rgb)
			div.input-group
				div.input-group-prepend
					span.input-group-text
						i.fa.fa-fw.fa-square(v-bind:style="`color:rgb(${bc.r},${bc.g},${bc.b});`")
				input.form-control(v-model="bc.r" type="number" min="0" max="255" required)
				input.form-control(v-model="bc.g" type="number" min="0" max="255" required)
				input.form-control(v-model="bc.b" type="number" min="0" max="255" required)
		div.form-group
			label Default Text Color (rgb)
			div.input-group
				div.input-group-prepend
					span.input-group-text
						i.fa.fa-fw.fa-square(v-bind:style="`color:rgb(${tc.r},${tc.g},${tc.b});`")
				input.form-control(v-model="tc.r" type="number" min="0" max="255" required)
				input.form-control(v-model="tc.g" type="number" min="0" max="255" required)
				input.form-control(v-model="tc.b" type="number" min="0" max="255" required)
		div.from-group(v-if="errorMsg != ''")
			p.text-danger.text-center {{errorMsg}}
		div.form-group(v-if="successMsg != ''")
			p.text-primary.text-center {{successMsg}}
		div.form-group
			button.btn.btn-info.text-bold.w-100(type="submit") Add Course
</template>
<script>
import $ from "jquery";
export default {
  name: "add-course-form",
  props: ["auth"],
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      title: "",
      bc: { r: 255, g: 255, b: 255 },
      tc: { r: 0, g: 0, b: 0 }
    };
  },
  methods: {
    submit() {
      const self = this;
      $.ajax({
        type: "POST",
        url: `/courses`,
        data: {
          access_token: this.auth.access_token,
          title: this.title,
          background_color: `rgb(${this.bc.r},${this.bc.g},${this.bc.b});`,
          text_color: `rgb(${this.tc.r},${this.tc.g},${this.tc.b});`
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
