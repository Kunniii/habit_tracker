<script setup>
  import { useRouter } from "vue-router";
  import { Plus } from "lucide-vue-next";

  const router = useRouter();

  const addNewHabit = () => {
    router.push("/add");
  };
</script>

<template>
  <div
    class="cursor-pointer p-4 rounded-lg border-2 border-dashed border-gray-500 text-gray-500 flex flex-col justify-center items-center hover:bg-gray-800"
    @click="addNewHabit"
  >
    <Plus />
    <p class="text-lg">Add New Habit</p>
  </div>
</template>
