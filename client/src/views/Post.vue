<template lang="pug">
	div.container
		div.card.mt-3
			form(v-on:submit.prevent="post")
				div.card-body.row
					div.col-md-6
						div.form-group
							input.form-control(type="text" v-model="title" placeholder="Title" required)
						div.form-group
							textarea.form-control(rows="12" v-model="text" placeholder="Text")
					div.col-md-6
						div.form-group
							label Type
							select.form-control(v-model="type" selected="Notepage" required)
								option(selected) Flashcard
								option Notepage
								option Simple Note
								option Announcement
						div.form-group
							label Course
							select.form-control(v-model="course_title" v-on:change="loadColor" required)
								option(v-for="course in subscriptions" v-bind:key="course.title" v-bind:style="`backgroundColor:${course.background_color};color:${course.text_color}`") {{course.title}}
						div.form-group
							label Background Color (rgb)
							div.input-group
								div.input-group-prepend
									span.input-group-text
										i.fa.fa-fw.fa-square(v-bind:style="`color:rgb(${bg_c.r},${bg_c.g},${bg_c.b});`")
								input.form-control(v-model="bg_c.r" type="number" min="0" max="255" required)
								input.form-control(v-model="bg_c.g" type="number" min="0" max="255" required)
								input.form-control(v-model="bg_c.b" type="number" min="0" max="255" required)
						div.form-group
							label Text Color (rgb)
							div.input-group
								div.input-group-prepend
									span.input-group-text
										i.fa.fa-fw.fa-square(v-bind:style="`color:rgb(${tx_c.r},${tx_c.g},${tx_c.b});`")
								input.form-control(v-model="tx_c.r" type="number" min="0" max="255" required)
								input.form-control(v-model="tx_c.g" type="number" min="0" max="255" required)
								input.form-control(v-model="tx_c.b" type="number" min="0" max="255" required)
						div.form-group
							button.btn.btn-info.text-bold.w-100(type="submit") Post
		div.row
			content-item.mx-auto(v-bind:item="content")
</template>
<script>
import ContentItem from "../components/ContentItem";
import $ from "jquery";
export default {
  name: "page-post",
  props: ["user", "auth"],
  components: { ContentItem },
  data() {
    return {
      type: "Notepage",
      title: "",
      text: "",
      course_title: "Example Course",
      courses: [],
      bg_c: {
        r: 255,
        g: 255,
        b: 127
      },
      tx_c: {
        r: 0,
        g: 0,
        b: 0
      }
    };
  },

  computed: {
    content() {
      return {
        type: this.type,
        title: this.title,
        text: this.text,
        author: this.user.username,
        course_title: this.course_title,
        timestamp: new Date().getTime(),
        background_color: `rgb(${this.bg_c.r},${this.bg_c.g},${this.bg_c.b})`,
        text_color: `rgb(${this.tx_c.r},${this.tx_c.g},${this.tx_c.b})`
      };
    },

    subscriptions() {
      const self = this;
      return this.courses.filter(course =>
        self.user.sub_titles.includes(course.title)
      );
    },

    contentValid() {
      return this.content.title != "" && this.content.text != "";
    }
  },

  methods: {
    post() {
      const self = this;
      $.ajax({
        type: "POST",
        url: `/users/${this.user.username}/content`,
        data: {
          access_token: this.auth.access_token,
          type: this.type,
          title: this.title,
          text: this.text,
          author: this.user.username,
          course_title: this.course_title,
          background_color: `rgb(${this.bg_c.r},${this.bg_c.g},${this.bg_c.b})`,
          text_color: `rgb(${this.tx_c.r},${this.tx_c.g},${this.tx_c.b})`
        },
        dataType: "text",
        success(result, status, xhr) {
          self.$emit("update:status", result);
          self.$router.push(`/users/${self.user.username}/dash`);
        },
        error(xhr, status, error) {
          alert(status + error);
        }
      });
    },
    loadColor() {
      const self = this;
      const course = this.subscriptions.find(
        value => value.title == self.course_title
      );
      const bg = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(course.background_color);
      this.bg_c = { r: bg[1], g: bg[2], b: bg[3] };
      const tc = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(course.text_color);
      this.tx_c = { r: tc[1], g: tc[2], b: tc[3] };
    }
  },

  created() {
    if (this.auth.access_level == "guest") {
      this.$router.push("/unauthorised");
    } else {
      const self = this;
      $.get(
        `/courses`,
        {
          access_token: this.auth.access_token
        },
        result => {
          self.courses = result;
        },
        "json"
      );
    }
  }
};
</script>
