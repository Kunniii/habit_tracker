<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Flame, User, PartyPopper, ArrowLeft, Share } from 'lucide-vue-next';
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json';
import confetti from 'canvas-confetti';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const isLoading = ref(true);
const error = ref(null);

const fetchPost = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(`http://localhost:3000/api/achievements/${route.params.id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Bài viết không tồn tại');
      throw new Error('Lỗi khi tải bài viết');
    }
    post.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPost();
});

let cheerTimer = null;
let pendingCheers = 0;

const cheerPost = async (event) => {
  if (!post.value) return;
  if (pendingCheers >= 50) return; // Cap maximum claps at 50
  
  pendingCheers++;
  const dynamicScalar = 1.5 + (pendingCheers * 0.1); 
  
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
        scalar: dynamicScalar,
        ticks: 60,
        gravity: 0.6,
        decay: 0.9,
        startVelocity: 15,
        colors: ['#ffffff']
      });
    } catch (e) {
      confetti({
        particleCount: 10 + pendingCheers,
        spread: 40,
        origin: { x, y },
        colors: ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63']
      });
    }
  }

  // Optimistic update
  post.value.cheered = true;
  post.value.cheers = (post.value.cheers || 0) + 1;

  // Debounce logic
  if (cheerTimer) {
    clearTimeout(cheerTimer);
  }
  
  cheerTimer = setTimeout(async () => {
    const amount = pendingCheers;
    pendingCheers = 0;
    
    if (amount === 0) return;
    
    try {
      await fetch(`http://localhost:3000/api/achievements/${post.value.id}/cheer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
    } catch (error) {
      // Revert on error
      post.value.cheers -= amount;
      if (post.value.cheers <= 0) post.value.cheered = false;
      console.error('Failed to cheer:', error);
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
  <div class="container mx-auto p-4 max-w-2xl pt-16 pb-24">
    <div class="mb-8">
      <button @click="router.push('/feed')" class="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors font-medium text-sm px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50">
        <ArrowLeft :size="16" />
        Quay lại Cộng đồng
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-24 text-muted animate-pulse">
      <div class="w-14 h-14 bg-gray-200 rounded-[1.25rem] mx-auto mb-6"></div>
      <div class="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-24 text-muted">
      <p class="text-lg">{{ error }}</p>
      <button @click="router.push('/feed')" class="mt-4 px-4 py-2 bg-ink text-white rounded-lg text-sm font-medium">Về trang chủ</button>
    </div>

    <div v-else-if="post" class="flex gap-5 items-start relative pb-12">
      <!-- Avatar -->
      <router-link 
        v-if="post.user !== 'Unknown' && post.user !== 'You'"
        :to="`/profile/${post.user}`"
        class="shrink-0 group block"
      >
        <div 
          v-if="generateAvatar(post.profilePic)" 
          class="w-14 h-14 rounded-[1.25rem] overflow-hidden bg-canvas border border-border ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105"
          v-html="generateAvatar(post.profilePic)"
        ></div>
        <div v-else class="w-14 h-14 rounded-[1.25rem] bg-canvas flex items-center justify-center border border-border ring-4 ring-surface shadow-subtle transition-transform group-hover:scale-105">
          <User :size="24" class="text-muted" />
        </div>
      </router-link>
      <div v-else class="shrink-0">
        <div 
          v-if="generateAvatar(post.profilePic)" 
          class="w-14 h-14 rounded-[1.25rem] overflow-hidden bg-canvas border border-border ring-4 ring-surface shadow-subtle"
          v-html="generateAvatar(post.profilePic)"
        ></div>
        <div v-else class="w-14 h-14 rounded-[1.25rem] bg-canvas flex items-center justify-center border border-border ring-4 ring-surface shadow-subtle">
          <User :size="24" class="text-muted" />
        </div>
      </div>

      <div class="flex-1 pt-1.5">
        <!-- Header -->
        <div class="flex items-baseline justify-between mb-3">
          <router-link 
            v-if="post.user !== 'Unknown' && post.user !== 'You'"
            :to="`/profile/${post.user}`" 
            class="font-medium text-ink text-base tracking-tight hover:underline underline-offset-4 decoration-2 decoration-border"
          >
            {{ post.user }}
          </router-link>
          <span v-else class="font-medium text-ink text-base tracking-tight">
            {{ post.user === 'You' ? 'Bạn' : post.user }}
          </span>
          <span class="text-sm text-muted">{{ formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: vi }) }}</span>
        </div>
        
        <!-- Content -->
        <p class="text-ink font-display text-2xl leading-[1.3] tracking-tight mb-5">
          {{ post.message === 'Completed a habit!' ? 'Đã hoàn thành một thói quen!' : post.message === 'I just crushed my daily goal!' ? 'Tôi vừa hoàn thành mục tiêu hàng ngày!' : post.message === 'I\'m staying consistent!' ? 'Tôi đang giữ được sự kiên trì!' : post.message }}
        </p>
        
        <!-- Meta (Habit Name, Streak & Cheer) -->
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <!-- Cheer Button -->
          <button 
            @click="cheerPost"
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

          <!-- Share Button -->
          <button 
            @click="copyLink(post.id)"
            class="ml-auto flex items-center justify-center w-8 h-8 bg-canvas border border-border text-muted hover:bg-surface hover:text-ink rounded-lg transition-all active:scale-[0.96]"
            title="Chia sẻ liên kết"
          >
            <Share :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
