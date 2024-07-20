<script setup>
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import { format } from "date-fns";
  import { Settings2 } from "lucide-vue-next";
  import { marked } from "marked";

  const route = useRoute();
  const router = useRouter();
  const habitStore = useHabitStore();
  const habitID = route.params.id;
  const habit = computed(() => habitStore.habits.find((habit) => habit.id === Number(habitID)));

  if (!habit.value) {
    router.back();
  }

  const renderedDescription = ref("");

  renderedDescription.value = marked(habit.value.description);

  const markAsDone = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (!habit.value.datesDone.includes(today)) {
      habitStore.markHabitAsDone(Number(habitID), today);
    }
  };

  const goBack = () => {
    router.back();
  };

  const editHabit = () => {
    router.push(`/edit/${habitID}`);
  };

  const currentStreak = computed(() => {
    const dates = habit.value.datesDone;
    if (dates.length === 0) return 0;
    const today = format(new Date(), "yyyy-MM-dd");
    let streak = 0;
    let date = new Date(today);
    while (dates.includes(format(date, "yyyy-MM-dd"))) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const longestStreak = computed(() => {
    const dates = habit.value.datesDone.sort();
    if (dates.length === 0) return 0;
    let maxStreak = 0;
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);
      const diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        maxStreak = Math.max(maxStreak, streak);
        streak = 1;
      }
    }
    return Math.max(maxStreak, streak);
  });
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-lg mx-auto bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">{{ habit.name }}</h1>
        <button
          @click="editHabit"
          class="text-gray-400 hover:text-white transition hover:shadow-md"
        >
          <Settings2 color="white" />
        </button>
      </div>
      <div
        class="mb-4 prose prose-neutral prose-invert prose-h1:text-2xl prose-h2:text-1xl prose-h3:text-xl text-white max-h-[45vh] overflow-scroll overflow-x-hidden bg-gray-900 p-4 rounded-lg"
        v-html="renderedDescription"
      ></div>
      <h2 class="text-xl font-semibold mb-2">Streak</h2>
      <p class="mb-4">Current Streak: {{ currentStreak }} days</p>
      <p class="mb-4">Longest Streak: {{ longestStreak }} days</p>
      <div class="flex gap-5">
        <button
          @click="goBack"
          class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span class="mx-auto">Go to Dashboard</span>
        </button>

        <button
          @click="markAsDone"
          class="inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <span class="mx-auto">Mark as Done Today</span>
        </button>
      </div>
      <h2 class="text-xl font-semibold mt-6 mb-2">History</h2>
      <ul>
        <li
          v-for="date in habit.datesDone"
          :key="date"
        >
          {{ date }}
        </li>
      </ul>
    </div>
  </div>
</template>
