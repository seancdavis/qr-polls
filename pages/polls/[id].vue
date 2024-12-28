<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

// Get the initial data when the page is loaded
const { data } = await useFetch(`/api/polls/${id}`);
const poll = ref(data);
let responseData = ref(
  poll.value?.responses?.map((response) => ({
    ...response,
    voteCount: response.votes.length,
  })),
);
const responses = useState(() => responseData);

// Refresh the response data every second
async function refresh() {
  const data = await $fetch(`/api/polls/${id}`);
  const poll = ref(data);
  responses.value = poll.value?.responses?.map((response) => ({
    ...response,
    voteCount: response.votes.length,
  }));
  setTimeout(refresh, 1000);
}
refresh();

// Set the cache headers
const cacheTagHeader = useResponseHeader("Netlify-Cache-Tag");
cacheTagHeader.value = `poll-${route.params.id}-page`;

const cacheControlHeader = useResponseHeader("Cache-Control");
cacheControlHeader.value = "public, max-age=0, must-revalidate";

const cdnCacheControlHeader = useResponseHeader("Netlify-CDN-Cache-Control");
cdnCacheControlHeader.value = "public, max-age=300, stale-while-revalidate=31536000, durable";
</script>

<template>
  <div v-if="poll == null">No data</div>
  <div v-else>
    <h1 class="text-3xl font-bold underline mb-12">{{ poll.title }}</h1>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="response in responses" :key="response.id">
        <h2>{{ response.title }}</h2>
        <div>Votes: {{ response.voteCount }}</div>
        <img :src="response.qrCodeUrl" alt="QR Code" />
        <a :href="response.voteUrl" target="_blank" class="text-blue-500 underline">Vote</a>
      </div>
    </div>
  </div>
</template>
