<script setup>
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import ShareModal from "./ShareModal.vue";
  import { format, parseISO } from "date-fns";
  import { SquarePen, Trash2, X, Flame, CalendarDays, CheckCircle2, Share, ArrowLeft } from "lucide-vue-next";
  import { marked } from "marked";
  import VueCal from "vue-cal";
  import "vue-cal/dist/vuecal.css";
  import confetti from "canvas-confetti";

  const route = useRoute();
  const router = useRouter();
  const habitStore = useHabitStore();
  const habitID = route.params.id;
  const habit = computed(() => habitStore.habits.find((habit) => habit.id === Number(habitID)));
  const events = ref([]);
  const isShared = ref(false);

  if (!habit.value) {
    router.back();
  }

  events.value = habit.value?.datesDone?.map((date) => ({
    start: format(new Date(date), "yyyy-MM-dd"),
    end: format(new Date(date), "yyyy-MM-dd"),
    title: "Done",
  })) || [];

  const renderedDescription = ref(marked(habit.value?.description || ""));

  const markAsDone = (e) => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (!habit.value.datesDone.includes(today)) {
      habitStore.markHabitAsDone(Number(habitID), today);
      
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { x, y },
        colors: ['#346538', '#1F6C9F', '#956400', '#9F2F2D']
      });
    }
  };
  
  const isDoneToday = computed(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return (habit.value?.datesDone || []).includes(today);
  });
  const showShareModal = ref(false);
  
  const handleShareClick = () => {
    showShareModal.value = true;
  };

  const handleShared = () => {
    isShared.value = true;
    setTimeout(() => {
      isShared.value = false;
    }, 3000);
  };

  const goBack = () => {
    router.back();
  };

  const editHabit = () => {
    router.push(`/edit/${habitID}`);
  };

  const deleteHabit = () => {
    habitStore.deleteHabit(Number(habitID));
    router.push("/dashboard");
  };

  const goToCalendar = () => {
    router.push(`/habit/${habitID}/calendar`);
  };

  const currentStreak = computed(() => {
    const dates = habit.value?.datesDone || [];
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
    const dates = [...(habit.value?.datesDone || [])].sort();
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
  <div class="container mx-auto p-4 max-w-3xl pt-8 pb-24">
    <div class="mb-8">
      <button @click="goBack" class="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors font-medium text-sm px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50">
        <ArrowLeft :size="16" />
        Quay lại Bảng điều khiển
      </button>
    </div>
    
    <div v-if="habit" class="bg-surface border border-border rounded-xl p-8">
      <div class="flex justify-between items-start mb-8">
        <div>
           <div class="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-border rounded-full text-xs uppercase tracking-widest font-mono text-muted">
              Chi tiết thói quen
            </div>
          <h1 class="text-4xl font-display tracking-tight font-medium text-ink">{{ habit.name }}</h1>
        </div>
        <div class="flex gap-2">
          <button
            title="Calendar"
            @click="goToCalendar"
            class="text-muted hover:text-ink hover:bg-canvas rounded-md p-2 transition-colors"
          >
            <CalendarDays :size="20" />
          </button>
          <button
            title="Edit"
            @click="editHabit"
            class="text-muted hover:text-ink hover:bg-canvas rounded-md p-2 transition-colors"
          >
            <SquarePen :size="20" />
          </button>
          <button
            title="Delete"
            @click="deleteHabit"
            class="text-muted hover:text-accent-red-text hover:bg-accent-red-bg rounded-md p-2 transition-colors"
          >
            <Trash2 :size="20" />
          </button>
          <button
            title="Close"
            @click="goBack"
            class="text-muted hover:text-ink hover:bg-canvas rounded-md p-2 transition-colors ml-4"
          >
            <X :size="20" />
          </button>
        </div>
      </div>
      
      <div
        v-if="renderedDescription"
        class="prose prose-neutral prose-h1:text-2xl prose-h2:text-1xl prose-h3:text-xl text-ink max-h-[45vh] overflow-y-auto overflow-x-hidden mb-8"
        v-html="renderedDescription"
      ></div>

      <div class="flex gap-4 mb-8">
        <div class="flex-1 bg-canvas border border-border rounded-lg p-4 text-center">
           <span class="block text-xs uppercase tracking-widest text-muted mb-2">Chuỗi hiện tại</span>
           <div class="flex items-center justify-center gap-2">
             <span class="text-3xl font-medium tracking-tight text-ink">{{ currentStreak }}</span>
             <Flame :size="24" :class="currentStreak > 0 ? 'text-accent-red-text fill-accent-red-bg' : 'text-muted'" />
           </div>
        </div>
        <div class="flex-1 bg-canvas border border-border rounded-lg p-4 text-center">
           <span class="block text-xs uppercase tracking-widest text-muted mb-2">Chuỗi dài nhất</span>
           <div class="flex items-center justify-center gap-2">
             <span class="text-3xl font-medium tracking-tight text-ink">{{ longestStreak }}</span>
           </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-12 h-[50px]">
        <button
          v-if="!isDoneToday"
          @click="markAsDone"
          class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-ink hover:bg-black transition-transform hover:scale-[0.98]"
        >
          <CheckCircle2 :size="18" />
          Hoàn thành hôm nay
        </button>
        <template v-else>
          <button
            disabled
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-sm font-medium rounded-md text-muted bg-canvas cursor-not-allowed"
          >
            <CheckCircle2 :size="18" class="text-accent-green-text" />
            Đã hoàn thành
          </button>
          <button
            @click="handleShareClick"
            :title="isShared ? 'Đã chia sẻ lên bảng tin!' : 'Chia sẻ thành tích'"
            class="flex-shrink-0 flex items-center justify-center w-[50px] border border-border rounded-md text-ink bg-surface hover:bg-canvas transition-colors"
          >
            <Share :size="18" :class="{'text-accent-green-text': isShared}" />
          </button>
        </template>
      </div>
      
      <div class="border-t border-border pt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-medium tracking-tight">Lịch sử</h2>
        </div>

        <VueCal
          :events="events"
          :time="false"
          :transitions="false"
          :disable-views="['week', 'day']"
          hide-view-selector
          events-count-on-year-view
          active-view="month"
          xsmall
          class="h-96 rounded-lg border border-border"
        />
      </div>
    </div>
    
    <ShareModal 
      v-if="habit"
      :habit="habit"
      :show="showShareModal"
      @close="showShareModal = false"
      @shared="handleShared"
    />
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
