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

  if (habit.value) {
    events.value = habit.value.datesDone.map((date) => ({
      start: format(new Date(date), "yyyy-MM-dd"),
      end: format(new Date(date), "yyyy-MM-dd"),
      title: "Đã hoàn thành",
    }));
  }

  const onEventClick = (event) => {
    // optional click handler
  };

  onMounted(() => {
    if (!habit.value) {
      router.back();
    }
  });
</script>

<template>
  <div class="container mx-auto p-4 max-w-xl pt-12 pb-24">
    <div class="bg-surface border border-border shadow-subtle rounded-xl p-8">
      <div class="flex justify-between items-center mb-10">
        <div>
           <div class="inline-flex items-center gap-2 px-3 py-1 mb-2 border border-border rounded-full text-xs uppercase tracking-widest font-mono text-muted">
              Xem lịch
            </div>
           <h1 class="text-3xl font-display font-medium tracking-tight text-ink">{{ habit?.name }}</h1>
        </div>
        <button
          title="Đóng"
          @click="goBack"
          class="text-muted hover:text-ink hover:bg-canvas rounded-md p-2 transition-colors"
        >
          <X :size="20" />
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
        class="h-96 rounded-lg border border-border"
      />
    </div>
  </div>
</template>

<style>
  .vuecal__cell--has-events {
    background-color: theme('colors.accent.green.bg') !important;
    color: theme('colors.accent.green.text') !important;
  }
  .vuecal__cell-events-count {
    display: none;
  }
  .vuecal {
    border: none !important;
  }
  .vuecal__menu {
    background-color: theme('colors.canvas') !important;
    border-bottom: 1px solid theme('colors.border') !important;
  }
  .vuecal__title-bar {
    background-color: theme('colors.surface') !important;
    border-bottom: 1px solid theme('colors.border') !important;
  }
  .vuecal__heading {
    background-color: theme('colors.canvas') !important;
  }
  .vuecal__cell {
    border: 1px solid theme('colors.border') !important;
  }
</style>
