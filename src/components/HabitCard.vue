<script setup>
  import { defineProps } from "vue";
  import { useRouter } from "vue-router";
  import { Settings2 } from "lucide-vue-next";

  const props = defineProps({
    habit: {
      type: Object,
      required: true,
    },
  });

  const router = useRouter();

  const viewDetails = () => {
    router.push(`/habit/${props.habit.id}`);
  };

  const editHabit = () => {
    router.push(`/edit/${props.habit.id}`);
  };
</script>

<template>
  <div class="bg-gray-800 shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold text-white">{{ habit.name }}</h2>
      <button
        @click="editHabit"
        class="text-gray-400 hover:text-white transition hover:shadow-md"
      >
        <Settings2 color="white" />
      </button>
    </div>
    <p class="text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
      {{ habit.description }}
    </p>

    <button
      @click="viewDetails"
      class="transition transform hover:scale-105 w-full mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span class="mx-auto">View Details</span>
    </button>
  </div>
</template>
