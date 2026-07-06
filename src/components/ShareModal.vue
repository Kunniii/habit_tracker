<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useHabitStore } from '../stores/habitStore';
import { X, Share, LogIn } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const props = defineProps({
  habit: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'shared']);

const router = useRouter();
const auth = useAuthStore();
const habitStore = useHabitStore();

const comment = ref('');
const isLoading = ref(false);
const error = ref('');

const isLoggedIn = computed(() => !!auth.user);

const handleClose = () => {
  emit('close');
  comment.value = '';
  error.value = '';
};

const handleLoginRedirect = () => {
  handleClose();
  router.push('/auth');
};

const handleShare = async () => {
  if (!isLoggedIn.value) return;
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const res = await fetch('/api/achievements/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        habitName: props.habit.name,
        streak: props.habit.datesDone?.length || 0,
        comment: comment.value || "Đã hoàn thành mục tiêu hôm nay!"
      })
    });
    
    if (res.ok) {
      // Local feed update
      habitStore.shareAchievement(props.habit.id, comment.value || "Đã hoàn thành mục tiêu hôm nay!");
      emit('shared');
      handleClose();
      toast.success('Chia sẻ lên Bảng tin thành công! 🎉');
    } else {
      const data = await res.json();
      error.value = data.error || 'Có lỗi xảy ra khi chia sẻ';
    }
  } catch (err) {
    error.value = 'Lỗi kết nối máy chủ';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-surface w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h3 class="font-medium text-ink">Chia sẻ thành tích</h3>
        <button @click="handleClose" class="text-muted hover:text-ink transition-colors p-1 rounded-md hover:bg-gray-100">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Body: Not Logged In -->
      <div v-if="!isLoggedIn" class="p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-muted">
          <LogIn class="w-6 h-6" />
        </div>
        <h4 class="text-lg font-medium text-ink mb-2">Bạn chưa đăng nhập</h4>
        <p class="text-sm text-muted mb-6">Vui lòng đăng nhập hoặc tạo tài khoản để có thể chia sẻ thành tích của bạn lên Bảng tin cộng đồng.</p>
        <button @click="handleLoginRedirect" class="w-full bg-ink text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#333333] transition-transform hover:scale-[0.98] active:scale-95">
          Đăng nhập ngay
        </button>
      </div>

      <!-- Body: Logged In -->
      <div v-else class="p-6">
        <div class="mb-4">
          <label class="block text-xs font-medium uppercase tracking-[0.05em] text-muted mb-2">Thói quen</label>
          <div class="p-3 bg-canvas border border-border rounded-md text-sm text-ink font-medium">
            🔥 {{ habit.name }} (Chuỗi: {{ habit.datesDone?.length || 0 }} ngày)
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex justify-between items-end mb-2">
            <label class="block text-xs font-medium uppercase tracking-[0.05em] text-muted">Lời bình của bạn</label>
            <span class="text-[10px] text-muted/70">{{ comment.length }}/400</span>
          </div>
          <textarea
            v-model="comment"
            rows="3"
            maxlength="400"
            placeholder="Chia sẻ cảm nghĩ của bạn..."
            class="w-full p-3 bg-background border border-border rounded-md text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors font-display text-lg resize-none"
          ></textarea>
        </div>

        <div v-if="error" class="p-3 bg-[#FDEBEC] text-[#9F2F2D] text-sm border border-[#EAEAEA] rounded-md mb-4">
          {{ error }}
        </div>

        <button 
          @click="handleShare" 
          :disabled="isLoading"
          class="w-full bg-ink text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#333333] transition-transform hover:scale-[0.98] active:scale-95 flex items-center justify-center gap-2"
        >
          <Share class="w-4 h-4" />
          {{ isLoading ? 'Đang chia sẻ...' : 'Chia sẻ lên Bảng tin' }}
        </button>
      </div>
    </div>
  </div>
</template>
