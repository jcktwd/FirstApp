<template>
    <div class="alert alert-primary mb-3" v-if="message!=''">
        {{message}}
    </div>
</template>
<script>
export default {
  name: "friendly-message",
  props: ["message"]
};
</script>
