<template>
    <div class="alert alert-warning mb-3" v-if="message!=''">
        {{message}}
    </div>
</template>
<script>
export default {
  name: "error-message",
  props: ["message"]
};
</script>
