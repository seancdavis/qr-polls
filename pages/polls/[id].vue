<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/polls/${route.params.id}`);

const poll = ref(data);
const responses = ref(poll.value?.responses);

const { ssrContext } = useNuxtApp();
if (ssrContext) {
  ssrContext.event.node.res.setHeader("Netlify-Cache-Tag", `poll-${route.params.id}-page`);
}
</script>

<template>
  <div v-if="poll == null">No data</div>
  <div v-else>
    <h1 class="text-3xl font-bold underline mb-12">{{ poll.title }}</h1>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="response in responses" :key="response.id">
        <h2>{{ response.title }}</h2>
        <div>Votes: {{ response.votes.length }}</div>
        <img :src="response.qrCodeUrl" alt="QR Code" />
        <a :href="response.voteUrl" target="_blank" class="text-blue-500 underline">Vote</a>
      </div>
    </div>
  </div>
</template>
