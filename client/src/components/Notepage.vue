<template lang="pug">
    div.col-12
        div.card(v-bind:style="'backgroundColor:'+content.background_color+';color:'+content.text_color")
            h5.card-header {{content.title}}
            div.paper.pl-5(v-html="markdown")
            div.card-footer.text-muted Created by {{content.author}} for {{content.course_title}} on {{date_string}}
</template>
<script>
import marked from "marked";
export default {
  name: "notepage",
  props: ["content"],
  computed: {
    date_string() {
      return new Date(this.content.timestamp).toLocaleString();
    },
    markdown() {
      return marked(this.content.text, { sanitize: true });
    }
  }
};
</script>
