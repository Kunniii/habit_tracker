<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json';
import { useAuthStore } from '../stores/auth';
import { useHabitStore } from '../stores/habitStore';
import { User as UserIcon, Pencil } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const habitStore = useHabitStore();

const isSyncing = ref(false);

const seed = ref('');
const originalSeed = ref('');
const bio = ref('');
const originalBio = ref('');
const username = ref('');
const displayName = ref('');
const originalDisplayName = ref('');
const isSaving = ref(false);
const isLoading = ref(true);

const mode = ref('view'); // 'view' or 'edit'

const avatarSvg = computed(() => {
  if (!seed.value) return '';
  try {
    const style = new Style(definition);
    const avatar = new Avatar(style, { seed: seed.value });
    return avatar.toString();
  } catch(e) {
    console.error("Dicebear Error:", e);
    return '';
  }
});

const randomizeAvatar = () => {
  seed.value = Math.random().toString(36).substring(7);
};

const loadProfile = async () => {
  isLoading.value = true;
  
  if (route.query.mode === 'edit') {
    mode.value = 'edit';
  }
  
  if (!auth.user && auth.token) {
    await auth.fetchProfile();
  }

  const targetUsername = route.params.username;

  if (targetUsername) {
    try {
      const res = await fetch(`/api/user/${targetUsername}`);
      if (res.ok) {
        const data = await res.json();
        seed.value = data.profilePic || '';
        originalSeed.value = seed.value;
        bio.value = data.bio || '';
        originalBio.value = bio.value;
        username.value = data.username;
        displayName.value = data.displayName || data.username;
        originalDisplayName.value = displayName.value;
      } else {
        toast.error("Người dùng không tồn tại");
        router.push('/feed');
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    if (auth.user) {
      seed.value = auth.user.profilePic || '';
      originalSeed.value = seed.value;
      bio.value = auth.user.bio || '';
      originalBio.value = bio.value;
      username.value = auth.user.username;
      displayName.value = auth.user.displayName || auth.user.username;
      originalDisplayName.value = displayName.value;
    } else {
      router.push('/auth');
      return;
    }
  }
  
  isLoading.value = false;
};

const saveProfile = async () => {
  isSaving.value = true;
  if (!auth.token) {
    toast.warning("Vui lòng đăng nhập để lưu.");
    isSaving.value = false;
    return;
  }
  try {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        profilePic: seed.value,
        bio: bio.value,
        displayName: displayName.value
      })
    });
    if (res.ok) {
      toast.success("Đã lưu thành công!");
      await auth.fetchProfile(); 
      router.replace('/profile');
    } else {
      toast.error("Lỗi khi lưu");
    }
  } catch(e) {
    toast.error("Lỗi khi lưu");
  } finally {
    isSaving.value = false;
  }
};

const cancelEdit = () => {
  seed.value = originalSeed.value;
  bio.value = originalBio.value;
  displayName.value = originalDisplayName.value;
  router.replace('/profile');
};

onMounted(() => {
  loadProfile();
});

watch(() => route.params.username, () => {
  mode.value = route.query.mode === 'edit' ? 'edit' : 'view';
  loadProfile();
});

watch(() => route.query.mode, (newMode) => {
  if (newMode === 'edit') mode.value = 'edit';
  else mode.value = 'view';
});
</script>

<template>
  <div class="max-w-2xl mx-auto px-3 sm:px-6 py-4 mt-4 sm:mt-8 pb-24">
    <div class="bg-surface border border-border rounded-xl p-5 sm:p-8 shadow-sm">
      <div v-if="isLoading" class="text-center py-8 text-muted">Đang tải...</div>
      
      <div v-else-if="mode === 'view'">
        <div class="flex flex-col items-center mb-6 gap-4">
          <div v-if="avatarSvg" class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-[2rem] overflow-hidden border border-border shadow-subtle ring-4 ring-surface" v-html="avatarSvg"></div>
          <div v-else class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-[2rem] flex items-center justify-center border border-border shadow-subtle ring-4 ring-surface">
            <UserIcon class="w-10 h-10 sm:w-12 sm:h-12 text-muted" />
          </div>
          
          <div class="text-center mt-2">
            <h2 class="font-playwrite text-xl sm:text-2xl text-ink font-medium tracking-wide">{{ displayName }}</h2>
            <p class="text-sm text-muted mt-1">@{{ username }}</p>
          </div>
        </div>

        <div class="mb-8 text-center max-w-lg mx-auto">
          <p class="text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-playwrite" :class="bio ? 'text-ink' : 'text-muted italic'">
            {{ bio || 'Chưa có thông tin giới thiệu.' }}
          </p>
        </div>
      </div>

      <div v-else-if="mode === 'edit'">
        <div class="flex flex-col items-center mb-8 gap-4">
          <div v-if="avatarSvg" class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-[2rem] overflow-hidden border border-border ring-4 ring-surface shadow-subtle" v-html="avatarSvg"></div>
          <div v-else class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-[2rem] flex items-center justify-center border border-border ring-4 ring-surface shadow-subtle">
             <UserIcon class="w-10 h-10 sm:w-12 sm:h-12 text-muted" />
          </div>
          <button 
            @click="randomizeAvatar"
            class="text-sm px-4 py-2 bg-gray-200 text-ink rounded-md hover:bg-gray-300 transition-colors"
          >
            🎲 Đổi ảnh ngẫu nhiên
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-ink mb-2">Tên hiển thị</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="Tên của bạn"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[16px] sm:text-sm bg-background border border-border rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-ink mb-2">Giới thiệu bản thân (Bio)</label>
          <textarea
            v-model="bio"
            rows="4"
            placeholder="Hãy viết vài dòng về bạn..."
            class="font-playwrite w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[16px] sm:text-sm bg-background border border-border rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-ink"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button 
            @click="cancelEdit" 
            class="px-4 py-2 text-ink bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="saveProfile"
            :disabled="isSaving"
            class="px-6 py-2 bg-ink text-white rounded-md hover:bg-black transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Đang lưu...' : 'Lưu' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
