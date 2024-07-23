<template>
  <div class="bg-gray-700 p-6 rounded-lg text-center animate-fade-in flex flex-col">
    <div class="text-center mx-auto mb-5"><slot></slot></div>
    <h3 class="text-2xl font-bold mb-4 text-green-400">{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });
</script>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-fade-in {
    animation: fade-in 2s ease-in;
  }
</style>
