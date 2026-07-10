<script setup>
  import { computed } from "vue";
  import { useHabitStore } from "../stores/habitStore";
  import HabitCard from "./HabitCard.vue";
  import NewHabitSkeleton from "./NewHabitSkeleton.vue";

  const habitStore = useHabitStore();
  const habits = computed(() => habitStore.habits);
  const isLoading = computed(() => habitStore.isLoading);
</script>

<template>
  <div class="container mx-auto px-3 sm:px-4 max-w-5xl pt-8 sm:pt-12 pb-24">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <HabitCard
        v-for="habit in habits"
        :key="habit.id"
        :habitID="habit.id"
      />
      <NewHabitSkeleton />
    </div>
  </div>
</template>
