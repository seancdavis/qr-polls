<script setup lang="ts">
const route = useRoute();
const { id } = route.params;

// Get the initial data when the page is loaded
const { data: poll, refresh } = await useFetch(`/api/polls/${id}`);
// Set the cache headers with the initial response
const cacheTagHeader = useResponseHeader("Netlify-Cache-Tag");
cacheTagHeader.value = `poll-${id}-page`;
const cacheControlHeader = useResponseHeader("Cache-Control");
cacheControlHeader.value = "public, max-age=0, must-revalidate";
const cdnCacheControlHeader = useResponseHeader("Netlify-CDN-Cache-Control");
cdnCacheControlHeader.value = "public, max-age=300, stale-while-revalidate=31536000, durable";
// Refresh the response data every second
setInterval(refresh, 1000);
</script>

<template>
  <div class="mb-16 pt-12 text-center">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">{{ poll?.title }}</h1>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="response in poll?.responses" :key="response.id" class="text-center">
      <h2 class="text-2xl font-semibold mb-4">{{ response.title }}</h2>
      <div class="my-6">
        <div class="p-6 rounded-md bg-white inline-block">
          <img :src="response.qrCodeUrl" alt="QR Code" class="max-w-md w-full" />
        </div>
      </div>
      <div class="flex items-center justify-center gap-2 mb-6">
        <span class="font-mono lowercase text-slate-400">[votes]</span>
        <span class="text-xl font-semibold">{{ response.voteCount }}</span>
      </div>
      <a
        :href="response.voteUrl"
        target="_blank"
        class="bg-emerald-400 rounded-md text-slate-800 font-semibold py-2 px-6 transition-colors hover:bg-emerald-500 duration-300"
      >
        Record vote
      </a>
    </div>
  </div>
</template>
