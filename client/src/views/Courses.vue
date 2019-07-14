<template lang="pug">
	div.container.mt-4
		div.card
			h5.card-header Subscriptions
			ul.list-inline.mx-4.mt-4
				li.list-inline-item(
					v-for="course in subscribed"
					v-bind:key="course.title")
					button.btn.mb-2(v-on:click="unsubscribe(course.title)" v-bind:style="`backgroundColor:${course.background_color};color:${course.text_color}`") {{course.title}}
						span.fa.fa-fw.fa-times.text-danger
			div.card-body
				h5.card-title Subscribe to a course:
				add-sub-form(
					v-bind:user="user"
					v-bind:courses="courses"
					v-bind:auth="auth"
					v-on:update:user="$emit('update:user')"
					v-on:update:status="$emit('update:status', $event)")
</template>
<script>
import $ from "jquery";
import AddSubForm from "../components/AddSubForm.vue";
export default {
  name: "page-courses",
  props: ["user", "auth"],
  components: { AddSubForm },
  computed: {
    subscribed() {
      const self = this;
      return this.courses.filter(course =>
        self.user.sub_titles.includes(course.title)
      );
    }
  },
  data() {
    return { courses: [] };
  },
  created() {
    if (this.auth.access_level == "guest") {
      this.$router.push("/unauthorised");
    } else {
      const self = this;
      $.get(
        `/courses`,
        { access_token: this.auth.access_token },
        result => {
          self.courses = result;
        },
        "json"
      );
    }
  },
  methods: {
    unsubscribe(course_title) {
      const self = this;
      $.ajax({
        url: `/users/${this.user.username}/subs`,
        type: "DELETE",
        data: { access_token: this.auth.access_token, course_title },
        dataType: "text",
        success(result, status, xhr) {
          self.$emit("update:status", result);
          self.$emit("update:user");
        },
        error(xhr, status, error) {
          alert(status + error);
        }
      });
    }
  }
};
</script>
