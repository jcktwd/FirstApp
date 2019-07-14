<template lang="pug">
	form(v-on:submit.prevent="subscribe")
		div.row
			div.col-sm-9.mt-3
				select.form-control.w-100(v-model="selected")
					option(v-for="course in unsubscribed" v-bind:key="course.title" v-bind:style="`backgroundColor:${course.background_color};color:${course.text_color}`") {{course.title}}
			div.col-sm-3.mt-3
				button.btn.btn-info.text-bold.w-100(type="submit") Subscribe
</template>
<script>
import $ from "jquery";
export default {
  name: "add-sub-form",
  props: ["user", "auth", "courses"],
  data() {
    return {
      selected: ""
    };
  },
  computed: {
    unsubscribed() {
      const self = this;
      return this.courses.filter(function(course) {
        return !self.user.sub_titles.includes(course.title);
      });
    }
  },
  methods: {
    subscribe() {
      var self = this;
      $.ajax({
        type: "POST",
        url: `/users/${this.user.username}/subs`,
        data: {
          course_title: this.selected,
          access_token: this.auth.access_token
        },
        dataType: "text",
        success(result, status, xhr) {
          self.$emit("update:user");
          self.$emit("update:status", result);
        },
        error(xhr, status, error) {
          alert(status + error);
        }
      });
    }
  }
};
</script>
