<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Flame, User, PartyPopper, ArrowLeft, Share, Send, Pencil, Trash2, X, AlertTriangle } from 'lucide-vue-next';
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json';
import confetti from 'canvas-confetti';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const post = ref(null);
const comments = ref([]);
const newComment = ref('');
const isSubmitting = ref(false);
const editingCommentId = ref(null);
const editingContent = ref('');
const isLoading = ref(true);
const error = ref(null);

const fetchPost = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(`/api/achievements/${route.params.id}`);
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

const fetchComments = async () => {
  try {
    const res = await fetch(`/api/achievements/${route.params.id}/comments`);
    if (res.ok) {
      comments.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch comments', err);
  }
};

const postComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const res = await fetch(`/api/achievements/${route.params.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ content: newComment.value })
    });
    if (!res.ok) throw new Error('Không thể đăng bình luận');
    const comment = await res.json();
    comments.value.unshift(comment);
    newComment.value = '';
    toast.success('Đã đăng bình luận');
  } catch (err) {
    toast.error(err.message);
  } finally {
    isSubmitting.value = false;
  }
};

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  editingContent.value = comment.content;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editingContent.value = '';
};

const saveEdit = async (commentId) => {
  if (!editingContent.value.trim()) return;
  try {
    const res = await fetch(`/api/achievements/${route.params.id}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ content: editingContent.value })
    });
    if (!res.ok) throw new Error('Không thể sửa bình luận');
    const updatedComment = await res.json();
    const index = comments.value.findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments.value[index].content = updatedComment.content;
      comments.value[index].updatedAt = updatedComment.updatedAt;
    }
    cancelEdit();
    toast.success('Đã cập nhật bình luận');
  } catch (err) {
    toast.error(err.message);
  }
};

const deletingCommentId = ref(null);
const deleteTimeout = ref(null);

const startDelete = (commentId) => {
  deletingCommentId.value = commentId;
  if (deleteTimeout.value) clearTimeout(deleteTimeout.value);
  deleteTimeout.value = setTimeout(() => {
    if (deletingCommentId.value === commentId) {
      deletingCommentId.value = null;
    }
  }, 3000);
};

const cancelDelete = () => {
  deletingCommentId.value = null;
  if (deleteTimeout.value) clearTimeout(deleteTimeout.value);
};

const confirmDelete = async (commentId) => {
  if (deleteTimeout.value) clearTimeout(deleteTimeout.value);
  try {
    const res = await fetch(`/api/achievements/${route.params.id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (!res.ok) throw new Error('Không thể xoá bình luận');
    comments.value = comments.value.filter(c => c.id !== commentId);
    toast.success('Đã xoá bình luận');
  } catch (err) {
    toast.error(err.message);
  } finally {
    cancelDelete();
  }
};

const handleGlobalClick = () => {
  if (deletingCommentId.value) {
    cancelDelete();
  }
};

onMounted(() => {
  fetchPost();
  fetchComments();
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
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
      await fetch(`/api/achievements/${post.value.id}/cheer`, {
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
  <div class="absolute inset-0 pt-16 pb-0 flex flex-col overflow-hidden bg-canvas">
    <!-- Use absolute positioning to ensure it takes exactly the remaining space without scrolling the body -->
    <div class="container mx-auto max-w-2xl w-full h-full flex flex-col">
      
      <!-- Top Fixed Area (Post Detail) -->
      <div class="flex-none px-4 pt-4 shrink-0 bg-canvas z-10 shadow-sm border-b border-border">
        <div class="mb-4">
          <button @click="router.push('/feed')" class="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors font-medium text-sm px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50">
            <ArrowLeft :size="16" />
            Quay lại Cộng đồng
          </button>
        </div>

        <div v-if="isLoading" class="text-center py-12 text-muted animate-pulse">
          <div class="w-14 h-14 bg-gray-200 rounded-[1.25rem] mx-auto mb-6"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>

        <div v-else-if="error" class="text-center py-12 text-muted">
          <p class="text-lg">{{ error }}</p>
          <button @click="router.push('/feed')" class="mt-4 px-4 py-2 bg-ink text-white rounded-lg text-sm font-medium">Về trang chủ</button>
        </div>

        <div v-else-if="post" class="flex gap-5 items-start relative pb-6">
          <!-- Avatar -->
          <router-link 
            v-if="post.user !== 'Unknown' && post.user !== 'You'"
            :to="`/profile/${post.user}`"
            class="shrink-0 group block"
          >
            <div 
              v-if="generateAvatar(post.profilePic)" 
              class="w-12 h-12 rounded-[1rem] overflow-hidden bg-canvas border border-border ring-2 ring-surface shadow-subtle transition-transform group-hover:scale-105"
              v-html="generateAvatar(post.profilePic)"
            ></div>
            <div v-else class="w-12 h-12 rounded-[1rem] bg-canvas flex items-center justify-center border border-border ring-2 ring-surface shadow-subtle transition-transform group-hover:scale-105">
              <User :size="20" class="text-muted" />
            </div>
          </router-link>
          <div v-else class="shrink-0">
            <div 
              v-if="generateAvatar(post.profilePic)" 
              class="w-12 h-12 rounded-[1rem] overflow-hidden bg-canvas border border-border ring-2 ring-surface shadow-subtle"
              v-html="generateAvatar(post.profilePic)"
            ></div>
            <div v-else class="w-12 h-12 rounded-[1rem] bg-canvas flex items-center justify-center border border-border ring-2 ring-surface shadow-subtle">
              <User :size="20" class="text-muted" />
            </div>
          </div>

          <div class="flex-1 pt-1">
            <!-- Header -->
            <div class="flex items-baseline justify-between mb-2">
              <router-link 
                v-if="post.user !== 'Unknown' && post.user !== 'You'"
                :to="`/profile/${post.user}`" 
                class="font-medium text-ink text-base tracking-tight hover:underline underline-offset-4 decoration-2 decoration-border"
              >
                {{ post.userDisplayName || post.user }}
              </router-link>
              <span v-else class="font-medium text-ink text-base tracking-tight">
                {{ post.user === 'You' ? 'Bạn' : (post.userDisplayName || post.user) }}
              </span>
              <span class="text-sm text-muted">{{ formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: vi }) }}</span>
            </div>
            
            <!-- Content -->
            <p class="text-ink font-display text-xl leading-[1.3] tracking-tight mb-4 line-clamp-3">
              {{ post.message === 'Completed a habit!' ? 'Đã hoàn thành một thói quen!' : post.message === 'I just crushed my daily goal!' ? 'Tôi vừa hoàn thành mục tiêu hàng ngày!' : post.message === 'I\'m staying consistent!' ? 'Tôi đang giữ được sự kiên trì!' : post.message }}
            </p>
            
            <!-- Meta (Habit Name, Streak & Cheer) -->
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <!-- Cheer Button -->
              <button 
                @click="cheerPost"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-[0.96] select-none"
                :class="post.cheered ? 'bg-accent-yellow-bg text-accent-yellow-text' : 'bg-gray-100 text-muted hover:bg-gray-200 hover:text-ink'"
              >
                <span class="text-sm leading-none">👏</span>
                <span>{{ post.cheers || 0 }}</span>
              </button>
              
              <!-- Habit Name -->
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-blue-bg text-accent-blue-text rounded-lg text-xs font-semibold tracking-wide">
                {{ post.habitName }}
              </div>
              
              <!-- Streak -->
              <div class="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-red-bg text-accent-red-text rounded-lg text-xs font-bold tracking-wide">
                <Flame :size="14" class="opacity-90" />
                <span>&times; {{ post.streak || 0 }}</span>
              </div>

              <!-- Share Button -->
              <button 
                @click="copyLink(post.id)"
                class="ml-auto flex items-center justify-center w-7 h-7 bg-canvas border border-border text-muted hover:bg-surface hover:text-ink rounded-lg transition-all active:scale-[0.96]"
                title="Chia sẻ liên kết"
              >
                <Share :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Scrollable Area (Comments List) -->
      <div class="flex-1 overflow-y-auto px-4 py-6 bg-surface/30 overflow-x-hidden">
        <h3 class="text-sm font-semibold text-ink mb-4 uppercase tracking-wider">Bình luận ({{ comments.length }})</h3>
        <TransitionGroup name="comment-list" tag="div" class="flex flex-col gap-4 relative">
          <div v-for="comment in comments" :key="comment.id" class="flex gap-3 w-full">
            <router-link :to="`/profile/${comment.user?.username || 'Unknown'}`" class="shrink-0">
              <div 
                v-if="generateAvatar(comment.user?.profilePic)" 
                class="w-8 h-8 rounded-lg overflow-hidden bg-canvas border border-border ring-1 ring-surface shadow-sm"
                v-html="generateAvatar(comment.user?.profilePic)"
              ></div>
              <div v-else class="w-8 h-8 rounded-lg bg-canvas flex items-center justify-center border border-border ring-1 ring-surface shadow-sm">
                <User :size="16" class="text-muted" />
              </div>
            </router-link>
            
            <div class="flex-1">
              <div 
                class="bg-canvas p-3 relative group shadow-sm transition-all duration-300"
                :class="deletingCommentId === comment.id ? 'rounded-2xl border-[3px] border-accent-red-text border-dashed animate-shake shadow-[0_0_15px_rgba(248,113,113,0.2)]' : 'rounded-2xl rounded-tl-none border border-border border-solid'"
              >
                <div class="flex justify-between items-baseline mb-1.5">
                  <div class="flex items-center gap-2">
                    <router-link :to="`/profile/${comment.user?.username || 'Unknown'}`" class="font-medium text-xs text-ink hover:underline tracking-tight">
                      {{ comment.user?.displayName || comment.user?.username || 'Người dùng ẩn danh' }}
                    </router-link>
                    <span 
                      v-if="comment.user?.username && post?.user && comment.user.username === post.user"
                      class="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide bg-ink text-canvas"
                    >
                      Tác giả
                    </span>
                  </div>
                  <div class="grid place-items-end items-center">
                    <span 
                      class="col-start-1 row-start-1 text-[10px] text-muted font-medium transition-all duration-300 whitespace-nowrap"
                      :class="[
                        !!authStore.token && (authStore.user?.id === comment.user?.id || authStore.user?.username === post?.user) ? 'group-hover:opacity-0 group-hover:translate-x-2' : '',
                        deletingCommentId === comment.id ? 'opacity-0 translate-x-2 pointer-events-none' : ''
                      ]"
                    >
                      {{ formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi }) }}
                    </span>
                    <div 
                      v-if="!!authStore.token && (authStore.user?.id === comment.user?.id || authStore.user?.username === post?.user)"
                      class="col-start-1 row-start-1 transition-all duration-300 flex items-center gap-1 bg-canvas relative z-10"
                      :class="deletingCommentId === comment.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'"
                    >
                      <button v-if="comment.user && authStore.user?.id === comment.user.id" @click.stop.prevent="startEdit(comment)" class="text-muted hover:text-ink transition-colors p-0.5" title="Sửa">
                        <Pencil :size="12" />
                      </button>
                      <button 
                        @click.stop.prevent="deletingCommentId === comment.id ? confirmDelete(comment.id) : startDelete(comment.id)" 
                        class="transition-colors p-0.5" 
                        :class="deletingCommentId === comment.id ? 'text-accent-red-text scale-110' : 'text-muted hover:text-accent-red-text'" 
                        :title="deletingCommentId === comment.id ? 'Click lần nữa để xoá' : 'Xoá'"
                      >
                        <Trash2 :size="12" />
                      </button>
                    </div>
                  </div>
                </div>

                
                <div v-if="editingCommentId === comment.id" class="mt-2">
                  <textarea 
                    v-model="editingContent"
                    class="w-full bg-surface border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink resize-none min-h-[50px]"
                  ></textarea>
                  <div class="flex justify-end gap-2 mt-1">
                    <button @click="cancelEdit" class="px-2 py-1 text-[10px] font-medium text-muted hover:bg-gray-100 rounded transition-colors">Huỷ</button>
                    <button @click="saveEdit(comment.id)" class="px-2 py-1 text-[10px] font-medium bg-ink text-white rounded transition-colors">Lưu</button>
                  </div>
                </div>
                <p v-else class="text-ink text-sm font-display leading-relaxed whitespace-pre-wrap">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="comments.length === 0" key="empty" class="text-center py-6 text-muted text-xs border-2 border-dashed border-border rounded-xl">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        </TransitionGroup>
      </div>

      <!-- Bottom Fixed Area (Comment Form) -->
      <div v-if="post" class="flex-none p-4 pb-24 shrink-0 bg-transparent z-10 relative">
        <div class="max-w-[800px] mx-auto w-full">
          <!-- Auth form -->
          <div v-if="!!authStore.token" class="flex gap-3 p-2 bg-surface/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[2rem] items-center">
            <!-- Avatar -->
            <div class="shrink-0 ml-1 flex items-center">
              <div 
                v-if="generateAvatar(authStore.user?.profilePic)" 
                class="w-9 h-9 rounded-full overflow-hidden bg-canvas border border-border shadow-sm flex items-center justify-center"
                v-html="generateAvatar(authStore.user?.profilePic)"
              ></div>
              <div v-else class="w-9 h-9 rounded-full bg-canvas flex items-center justify-center border border-border shadow-sm">
                <User :size="16" class="text-muted" />
              </div>
            </div>
            <!-- Input -->
            <div class="flex-1 relative mr-1 flex items-center">
              <textarea 
                v-model="newComment"
                placeholder="Viết bình luận..."
                class="w-full bg-transparent px-1 py-2.5 pr-10 focus:outline-none resize-none max-h-[120px] overflow-y-auto leading-normal text-ink placeholder-muted font-[playfair-display]"
                rows="1"
                @keydown.enter.prevent="postComment"
              ></textarea>
              <button 
                @click="postComment"
                :disabled="!newComment.trim() || isSubmitting"
                class="absolute right-0 w-8 h-8 flex items-center justify-center text-white bg-ink rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                title="Gửi (Enter)"
              >
                <Send :size="14" class="ml-0.5" />
              </button>
            </div>
          </div>
          <div v-else class="bg-surface/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-[2rem] p-3 px-5 text-center flex items-center justify-between">
            <p class="text-muted text-sm font-medium">Đăng nhập để tham gia thảo luận</p>
            <button @click="router.push('/auth')" class="px-5 py-2 bg-ink text-white rounded-full text-xs font-medium transition-all active:scale-95 shadow-sm">Đăng nhập</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.comment-list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.comment-list-leave-active {
  position: absolute;
  width: 100%;
  animation: dissolveOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes dissolveOut {
  0% { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
    filter: blur(0px); 
  }
  30% {
    opacity: 0.9;
    transform: scale(1.02) translateY(-2px);
    filter: blur(1px);
  }
  100% { 
    opacity: 0; 
    transform: scale(0.85) translateY(20px) rotate(1deg); 
    filter: blur(8px); 
  }
}
.comment-list-move {
  transition: transform 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-0.5px) rotate(-0.25deg); }
  75% { transform: translateX(0.5px) rotate(0.25deg); }
}
.animate-shake {
  animation: shake 0.08s linear infinite;
}
</style>
