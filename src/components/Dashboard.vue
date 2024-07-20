<script setup>
  import { computed } from "vue";
  import { useHabitStore } from "../stores/habitStore";
  import HabitCard from "./HabitCard.vue";
  import NewHabitSkeleton from "./NewHabitSkeleton.vue";

  const habitStore = useHabitStore();
  const habits = computed(() => habitStore.habits);
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Your Habits</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <HabitCard
        v-for="habit in habits"
        :key="habit.id"
        :habitID="habit.id"
      />
      <NewHabitSkeleton />
    </div>
  </div>
</template>
