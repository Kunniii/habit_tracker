<script setup>
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import { SquarePen, Flame, CalendarDays } from "lucide-vue-next";
  import { format } from "date-fns";

  const router = useRouter();

  const props = defineProps({
    habitID: {
      type: Number,
      required: true,
    },
  });

  const habitStore = useHabitStore();

  const viewDetails = () => {
    router.push(`/habit/${props.habitID}`);
  };

  const editHabit = () => {
    router.push(`/edit/${props.habitID}`);
  };

  const goToCalendar = () => {
    router.push(`/habit/${props.habitID}/calendar`);
  };

  const habit = computed(() => habitStore.habits.find((h) => h.id === Number(props.habitID)));

  if (!habit.value) {
    router.back();
  }

  const markAsDone = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (!habit.value.datesDone.includes(today)) {
      habitStore.markHabitAsDone(Number(props.habitID), today);
    }
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
  <div class="bg-gray-800 shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center">
      <h2
        class="text-lg font-bold text-white hover:underline hover:cursor-pointer"
        @click="viewDetails"
      >
        {{ habit.name }}
      </h2>
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
      </div>
    </div>

    <table
      class="min-w-full bg-slate-700 text-slate-300 rounded-lg overflow-hidden text-center my-5"
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
        @click="viewDetails"
        class="transition transform hover:scale-105 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span class="mx-auto">View Details</span>
      </button>
      <button
        @click="markAsDone"
        class="transition transform hover:scale-105 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span class="mx-auto">Mark as Done</span>
      </button>
    </div>
  </div>
</template>
