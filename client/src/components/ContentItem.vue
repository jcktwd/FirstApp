<template lang="pug">
	notepage.mt-3(v-bind:content="item" v-if="item.type=='Notepage'")
	simple-note.mt-3(v-bind:content="item" v-else-if="item.type=='Simple Note'")
	flashcard.mt-3(v-bind:content="item" v-else-if="item.type=='Flashcard'")
	announcement.mt-3(v-bind:content="item" v-else-if="item.type=='Announcement'")
</template>
<script>
import Flashcard from "./Flashcard.vue";
import Notepage from "./Notepage.vue";
import SimpleNote from "./SimpleNote.vue";
import Announcement from "./Announcement.vue";
export default {
  name: "content-item",
  props: ["item"],
  components: { Flashcard, Notepage, SimpleNote, Announcement }
};
</script>
