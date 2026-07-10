<script setup>
  import { computed, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import ShareModal from "./ShareModal.vue";
  import { SquarePen, Flame, CalendarDays, CheckCircle2, Share } from "lucide-vue-next";
  import { format } from "date-fns";
  import confetti from "canvas-confetti";
  import { calculateCurrentStreak } from "../utils/habitUtils";

  const router = useRouter();

  const props = defineProps({
    habitID: {
      type: Number,
      required: true,
    },
  });

  const habitStore = useHabitStore();
  const isShared = ref(false);

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

  const markAsDone = (e) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const dates = habit.value?.datesDone || [];
    if (!dates.includes(today)) {
      habitStore.markHabitAsDone(Number(props.habitID), today);
      
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 80,
        spread: 60,
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

  const currentStreak = computed(() => {
    return calculateCurrentStreak(habit.value?.datesDone);
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
  <div 
    v-if="habit" 
    :class="['rounded-xl p-5 flex flex-col justify-between transition hover:shadow-subtle group', isDoneToday ? 'bg-[#EDF3EC]/40 border border-[#346538]/20' : 'bg-surface border border-border']"
  >
    <div>
      <div class="flex justify-between items-start mb-4">
        <h2
          class="text-lg font-medium tracking-tight text-ink hover:text-muted cursor-pointer transition-colors"
          @click="viewDetails"
        >
          {{ habit.name }}
        </h2>
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            title="Calendar"
            @click="goToCalendar"
            class="text-muted hover:text-ink hover:bg-canvas rounded-md p-1.5 transition-colors"
          >
            <CalendarDays :size="16" />
          </button>
          <button
            title="Edit"
            @click="editHabit"
            class="text-muted hover:text-ink hover:bg-canvas rounded-md p-1.5 transition-colors"
          >
            <SquarePen :size="16" />
          </button>
        </div>
      </div>

      <div class="flex gap-4 mb-6">
        <div class="flex-1 bg-canvas border border-border rounded-lg p-3 text-center">
           <span class="block text-xs uppercase tracking-widest text-muted mb-1">Hiện tại</span>
           <div class="flex items-center justify-center gap-1.5">
             <span class="text-xl font-semibold">{{ currentStreak }}</span>
             <Flame :size="18" :class="currentStreak > 0 ? 'text-accent-red-text fill-accent-red-bg' : 'text-muted'" />
           </div>
        </div>
        <div class="flex-1 bg-canvas border border-border rounded-lg p-3 text-center">
           <span class="block text-xs uppercase tracking-widest text-muted mb-1">Kỷ lục</span>
           <div class="flex items-center justify-center gap-1.5">
             <span class="text-xl font-semibold">{{ longestStreak }}</span>
           </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2 h-[38px]">
      <button
        v-if="!isDoneToday"
        @click="markAsDone"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ink hover:bg-black transition-transform hover:scale-[0.98]"
      >
        <CheckCircle2 :size="16" />
        Hoàn thành hôm nay
      </button>

      <template v-else>
        <button
          disabled
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-md text-muted bg-canvas cursor-not-allowed"
        >
          <CheckCircle2 :size="16" class="text-accent-green-text" />
          Đã hoàn thành
        </button>
        <button
          @click="handleShareClick"
          :title="isShared ? 'Đã chia sẻ lên bảng tin!' : 'Chia sẻ thành tích'"
          class="flex-shrink-0 flex items-center justify-center w-[38px] border border-border rounded-md text-ink bg-surface hover:bg-canvas transition-colors"
        >
          <Share :size="16" :class="{'text-accent-green-text': isShared}" />
        </button>
      </template>
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
