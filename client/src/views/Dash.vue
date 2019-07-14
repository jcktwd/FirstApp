<template lang="pug">
	div.container
		div.card.bg-light.text-dark.mt-3
			h4.card-header My Dash
		div.row
			content-item(v-for="item in content" v-bind:item="item" :key="item.datetime")
			div.col-12(v-if="content.length < 10")
				div.card.my-3.bg-light
					h5.card-body.text-center.text-dark
						| #{"Oops! There's not much content here yet! Have you tried "}
						router-link(v-bind:to="`/users/${user.username}/subs`") subscribing
						| #{" to a course yet. Or maybe try a "}
						router-link(v-bind:to="`/users/${user.username}/post`") post
						| .
</template>
<script>
import ContentItem from "../components/ContentItem.vue";
import $ from "jquery";
export default {
  name: "pageDash",
  props: ["username", "user", "auth"],
  components: { ContentItem },
  data() {
    return {
      content: []
    };
  },
  created() {
    if (this.auth.access_level == "guest") {
      this.$router.push("/unauthorised");
    } else {
      var self = this;
      $.get(
        `/users/${this.username}/content`,
        { access_token: this.auth.access_token },
        function(result) {
          self.content = result;
        },
        "json"
      );
    }
  }
};
</script>
