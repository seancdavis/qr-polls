<script setup lang="ts">
const route = useRoute();
const { id } = route.params;

// Get the initial data when the page is loaded
const { data } = await useFetch(`/api/polls/${id}`);
const poll = ref(data);
// let responses = ref(
//   poll.value?.responses?.map((response) => ({
//     ...response,
//     voteCount: response.votes.length,
//   })),
// );
// const responses = useState(() => responseData);

// Refresh the response data every second
// async function refresh() {
//   const data = await $fetch(`/api/polls/${id}`);
//   const poll = ref(data);
//   responses.value = poll.value?.responses?.map((response) => ({
//     ...response,
//     voteCount: response.votes.length,
//   }));
//   setTimeout(refresh, 1000);
// }
// await refresh();
</script>

<template>
  <div v-if="poll == null">No data</div>
  <div v-else>
    <div class="mb-16 pt-12 text-center">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">{{ poll.title }}</h1>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="response in poll.responses" :key="response.id" class="text-center">
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
  </div>
</template>
