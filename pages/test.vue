<script setup>
// pages/test.vue
const header = useResponseHeader("X-My-Header");
header.value = "my-value";
</script>

<template>
  <h1>Test page with custom header</h1>
  <p>The response from the server for this "/test" page will have a custom "X-My-Header" header.</p>
</template>
