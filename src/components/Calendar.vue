<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import { format } from "date-fns";
  import VueCal from "vue-cal";
  import "vue-cal/dist/vuecal.css";
  import { X } from "lucide-vue-next";

  const events = ref([]);
  const route = useRoute();
  const router = useRouter();
  const habitStore = useHabitStore();
  const habitID = route.params.id;
  const habit = computed(() => habitStore.habits.find((habit) => habit.id === Number(habitID)));

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/dashboard");
  };

  if (habit.value) {
    events.value = habit.value.datesDone.map((date) => ({
      start: format(new Date(date), "yyyy-MM-dd"),
      end: format(new Date(date), "yyyy-MM-dd"),
      title: "Done",
    }));
  }

  const onEventClick = (event) => {
    alert(`Habit completed on: ${event.start}`);
  };

  onMounted(() => {
    if (!habit) {
      router.back();
    } else {
      console.log(habit);
    }
  });
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-2xl font-bold text-white">{{ habit?.name }} - Calendar</h1>
        <button
          title="Close"
          @click="goBack"
          class="text-gray-400 hover:text-white hover:scale-105 hover:bg-slate-500 rounded-lg p-1 transition hover:shadow-md"
        >
          <X />
        </button>
      </div>
      <VueCal
        :events="events"
        :time="false"
        :transitions="false"
        :disable-views="['week', 'day']"
        hide-view-selector
        active-view="month"
        small
        class="h-96"
      />
    </div>
  </div>
</template>
