<template lang="pug">
    div.col-md-6
        div.card(v-bind:style="'backgroundColor:'+content.background_color+';color:'+content.text_color")
            h5.card-header.text-center {{content.title}}
            button.btn.btn-info.w-75.mx-auto.my-3(data-toggle="collapse" :data-target="'#fliptext'+content.timestamp.toString()") Reveal
            div.collapse.my-auto.mx-3.text-center(v-bind:id="'fliptext'+content.timestamp.toString()" v-html="markdown")
            div.card-footer.text-muted Created by {{content.author}} for {{content.course_title}} on {{date_string}}
</template>
<script>
import marked from "marked";
export default {
  name: "flashcard",
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
