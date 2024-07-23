<script setup>
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import { format } from "date-fns";
  import { SquarePen, Trash2, X, Flame, CalendarDays } from "lucide-vue-next";
  import { marked } from "marked";
  import VueCal from "vue-cal";
  import "vue-cal/dist/vuecal.css";

  const route = useRoute();
  const router = useRouter();
  const habitStore = useHabitStore();
  const habitID = route.params.id;
  const habit = computed(() => habitStore.habits.find((habit) => habit.id === Number(habitID)));
  const events = ref([]);

  if (!habit.value) {
    router.back();
  }

  events.value = habit.value.datesDone.map((date) => ({
    start: format(new Date(date), "yyyy-MM-dd"),
    end: format(new Date(date), "yyyy-MM-dd"),
    title: "Done",
  }));

  const renderedDescription = ref(marked(habit.value.description));

  const markAsDone = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (!habit.value.datesDone.includes(today)) {
      habitStore.markHabitAsDone(Number(habitID), today);
    }
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/dashboard");
  };

  const editHabit = () => {
    router.push(`/edit/${habitID}`);
  };

  const deleteHabit = () => {
    habitStore.deleteHabit(Number(habitID));
    goHome();
  };

  const goToCalendar = () => {
    router.push(`/habit/${habitID}/calendar`);
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
        <div class="flex gap-2">
          <button
            title="Calendar"
            @click="goToCalendar"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-indigo-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <CalendarDays />
          </button>
          <button
            title="Edit"
            @click="editHabit"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-indigo-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <SquarePen />
          </button>
          <button
            title="Delete"
            @click="deleteHabit"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-rose-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <Trash2 />
          </button>
          <button
            title="Close"
            @click="goHome"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-slate-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <X />
          </button>
        </div>
      </div>
      <div
        class="prose prose-neutral prose-invert prose-h1:text-2xl prose-h2:text-1xl prose-h3:text-xl text-white max-h-[45vh] overflow-scroll overflow-y-auto overflow-x-hidden bg-gray-900 p-4 rounded-lg"
        v-html="renderedDescription"
      ></div>

      <table
        class="min-w-full bg-slate-700 text-slate-300 rounded-lg overflow-hidden text-center my-4"
      >
        <tbody>
          <tr>
            <td class="px-4 py-2 border-b border-slate-600">Current</td>
            <td class="px-4 py-2 border-b border-slate-600">Longest</td>
          </tr>
          <tr class="">
            <td class="px-4 py-2 text-xl font-black">
              <span class="flex items-center justify-center gap-2"
                ><span>{{ currentStreak }}</span
                ><Flame
                  :stroke-width="3"
                  :class="currentStreak > 0 ? 'fill-orange-400 text-orange-500' : ''"
                />
              </span>
            </td>
            <td class="px-4 py-2 text-xl font-black">
              <span class="flex items-center justify-center gap-2"
                ><span>{{ longestStreak }}</span
                ><Flame
                  :stroke-width="3"
                  :class="currentStreak > 0 ? 'fill-orange-400 text-orange-500' : ''"
                />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

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

      <VueCal
        :events="events"
        :time="false"
        :transitions="false"
        :disable-views="['week', 'day']"
        hide-view-selector
        events-count-on-year-view
        active-view="month"
        xsmall
        class="h-96 bg-gray-900"
      />
    </div>
  </div>
</template>

<style>
  .vuecal__cell--has-events {
    @apply bg-emerald-600;
  }
  .vuecal__cell-events-count {
    display: none;
  }
</style>
