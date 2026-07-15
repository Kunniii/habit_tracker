<script setup>
import { computed, onMounted, ref } from "vue";
import { useHabitStore } from "../stores/habitStore";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Flame, User, PartyPopper, Share, Loader2, WifiOff, MessageCircle } from "lucide-vue-next";
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json';
import confetti from 'canvas-confetti';
import { toast } from 'vue-sonner';
import { useIntersectionObserver, useNetwork } from "@vueuse/core";
import FeedSkeleton from './FeedSkeleton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const habitStore = useHabitStore();
const feed = computed(() => habitStore.feed);
const loadMoreTrigger = ref(null);
const { isOnline } = useNetwork();

onMounted(() => {
  habitStore.fetchFeed(true);
});

useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && habitStore.hasMoreFeed) {
    habitStore.fetchFeed();
  }
});

const cheerTimers = {};
const pendingCheers = {};

const cheerPost = async (post, event) => {
  const postId = post.id;
  if ((pendingCheers[postId] || 0) >= 50) return; // Cap maximum claps at 50
  
  pendingCheers[postId] = (pendingCheers[postId] || 0) + 1;
  const currentClaps = pendingCheers[postId];
  
  // Calculate size based on current claps (up to 50)
  const dynamicScalar = 2 + (currentClaps * 0.1); 

  // Trigger flying clap effect at the click position
  if (event) {
    const rect = event.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    try {
      const clap = confetti.shapeFromText({ text: '👏', scalar: dynamicScalar });
      confetti({
        particleCount: 1,
        spread: 30,
        origin: { x, y },
        shapes: [clap],
        scalar: 2,
        ticks: 60,
        gravity: 0.6,
        decay: 0.9,
        startVelocity: 15,
        colors: ['#ffffff']
      });
    } catch (e) {
      confetti({
        particleCount: 10 + currentClaps, // increase particles instead if emoji fails
        spread: 40,
        origin: { x, y },
        colors: ['#FFC700', '#FF0000', '#2E3192', '#1BFFFF']
      });
    }
  }

  // Optimistic update
  post.cheers = (post.cheers || 0) + 1;
  post.cheered = true;
  
  // Debounce logic
  
  if (cheerTimers[postId]) {
    clearTimeout(cheerTimers[postId]);
  }
  
  cheerTimers[postId] = setTimeout(async () => {
    const amount = pendingCheers[postId];
    pendingCheers[postId] = 0;
    
    if (amount === 0) return;
    
    try {
      await fetch(`/api/achievements/${postId}/cheer`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
    } catch (e) {
      console.error('Failed to cheer:', e);
      post.cheers -= amount;
      if (post.cheers <= 0) post.cheered = false;
    }
  }, 600);
};

const copyLink = async (id) => {
  try {
    const url = `${window.location.origin}/feed/${id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Đã sao chép liên kết bài viết');
  } catch (err) {
    toast.error('Không thể sao chép liên kết');
  }
};

const generateAvatar = (seed) => {
  if (!seed) return '';
  try {
    const style = new Style(definition);
    const avatar = new Avatar(style, { seed });
    return avatar.toString();
  } catch(e) {
    return '';
  }
};
</script>

<template>
  <div class="container mx-auto p-3 sm:p-4 max-w-2xl pt-12 sm:pt-16 pb-24 sm:pb-24">

    <div v-if="!isOnline" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-16 h-16 bg-canvas border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <WifiOff class="text-muted w-8 h-8" />
      </div>
      <h2 class="text-xl font-medium tracking-tight mb-2">Không có kết nối mạng</h2>
      <p class="text-muted max-w-sm">Bạn đang ngoại tuyến. Vui lòng kiểm tra lại kết nối Internet để xem Bảng tin.</p>
    </div>

    <template v-else>
      <div v-if="feed.length === 0 && habitStore.isFeedLoading" class="w-full flex flex-col gap-12">
        <FeedSkeleton v-for="i in 5" :key="`skeleton-${i}`" />
      </div>

      <div v-else-if="feed.length === 0 && !habitStore.isFeedLoading" class="text-center py-24 text-muted">
        <p class="text-lg">Ở đây yên tĩnh quá. Hãy là người đầu tiên chia sẻ thành tích!</p>
      </div>

      <TransitionGroup v-else name="list" tag="div" class="flex flex-col gap-8 sm:gap-12">

      <div 
        v-for="post in feed" 
        :key="post.id"
        @click="router.push(`/feed/${post.id}`)"
        class="group flex gap-3 sm:gap-5 items-start relative pb-8 sm:pb-12 border-b border-border/50 last:border-0 last:pb-0 cursor-pointer"
      >
        <!-- Avatar -->
        <router-link 
          v-if="post.user !== 'Unknown' && post.user !== 'You'"
          :to="`/profile/${post.user}`"
          class="shrink-0"
          @click.stop
        >
          <div 
            v-if="generateAvatar(post.profilePic)" 
            class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.25rem] overflow-hidden bg-canvas border border-border ring-2 sm:ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105"
            v-html="generateAvatar(post.profilePic)"
          ></div>
          <div v-else class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.25rem] bg-canvas flex items-center justify-center border border-border ring-2 sm:ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105">
            <User :size="20" class="text-muted sm:w-6 sm:h-6" />
          </div>
        </router-link>
        <div v-else class="shrink-0">
          <div 
            v-if="generateAvatar(post.profilePic)" 
            class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.25rem] overflow-hidden bg-canvas border border-border ring-2 sm:ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105"
            v-html="generateAvatar(post.profilePic)"
          ></div>
          <div v-else class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.25rem] bg-canvas flex items-center justify-center border border-border ring-2 sm:ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105">
            <User :size="20" class="text-muted sm:w-6 sm:h-6" />
          </div>
        </div>

        <div class="flex-1 pt-1">
          <!-- Header -->
          <div class="flex items-baseline justify-between mb-3">
            <div class="flex items-baseline gap-2">
              <router-link 
                v-if="post.user !== 'Unknown' && post.user !== 'You'"
                :to="`/profile/${post.user}`" 
                class="font-medium text-ink text-base tracking-tight hover:underline underline-offset-4 decoration-2 decoration-border"
                @click.stop
              >
                {{ post.userDisplayName || post.user }}
              </router-link>
              <span v-else class="font-medium text-ink text-base tracking-tight">
                {{ post.user === 'You' ? 'Bạn' : (post.userDisplayName || post.user) }}
              </span>
              <span v-if="post.user !== 'Unknown' && post.user !== 'You'" class="text-sm text-muted hidden sm:inline">
                @{{ post.user }}
              </span>
            </div>
            <span class="text-sm text-muted whitespace-nowrap">{{ formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: vi }) }}</span>
          </div>
          
          <!-- Content -->
          <p class="text-ink font-display text-2xl leading-[1.3] tracking-tight mb-5">
            {{ post.message === 'Completed a habit!' ? 'Đã hoàn thành một thói quen!' : post.message === 'I just crushed my daily goal!' ? 'Tôi vừa hoàn thành mục tiêu hàng ngày!' : post.message === 'I\'m staying consistent!' ? 'Tôi đang giữ được sự kiên trì!' : post.message }}
          </p>
          
          <!-- Meta (Habit Name, Streak & Cheer) -->
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <!-- Cheer Button -->
            <button 
              @click.stop="(e) => cheerPost(post, e)"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-[0.96] select-none"
              :class="post.cheered ? 'bg-accent-yellow-bg text-accent-yellow-text' : 'bg-gray-100 text-muted hover:bg-gray-200 hover:text-ink'"
            >
              <span class="text-sm leading-none">👏</span>
              <span>{{ post.cheers || 0 }}</span>
            </button>
            
            <!-- Habit Name -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-blue-bg text-accent-blue-text rounded-lg text-xs font-semibold tracking-wide">
              {{ post.habitName }}
            </div>
            
            <!-- Streak -->
            <div class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-accent-red-bg text-accent-red-text rounded-lg text-xs font-bold tracking-wide">
              <Flame :size="14" class="opacity-90" />
              <span>&times; {{ post.streak || 0 }}</span>
            </div>

            <!-- Comments Count -->
            <button 
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 text-muted hover:bg-gray-200 hover:text-ink rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-[0.96] select-none"
            >
              <MessageCircle :size="14" class="opacity-90" />
              <span>{{ post.commentCount || 0 }}</span>
            </button>

            <!-- Share Button -->
            <button 
              @click.stop="copyLink(post.id)"
              class="ml-auto flex items-center justify-center w-8 h-8 bg-canvas border border-border text-muted hover:bg-surface hover:text-ink rounded-lg transition-all active:scale-[0.96]"
              title="Chia sẻ liên kết"
            >
              <Share :size="15" />
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div v-if="habitStore.hasMoreFeed && feed.length > 0" ref="loadMoreTrigger" class="py-12 flex justify-center">
      <Loader2 class="w-6 h-6 text-muted animate-spin" />
    </div>
    </template>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  display: none;
}
</style>
