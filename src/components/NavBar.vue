<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, Globe, LayoutDashboard, Plus, Pencil, Cloud, LogOut, HelpCircle } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useHabitStore } from '../stores/habitStore';
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json';
import { onClickOutside } from '@vueuse/core';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'vue-sonner';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const habitStore = useHabitStore();

const pageTitle = computed(() => {
  if (route.path === '/feed') return 'Cộng đồng';
  if (route.path.startsWith('/feed/')) return 'Bài viết';
  if (route.path === '/dashboard') return 'Thói quen';
  if (route.path === '/add') return 'Thêm mới';
  if (route.path.startsWith('/profile')) return 'Hồ sơ';
  if (route.path.startsWith('/edit')) return 'Chỉnh sửa';
  return '';
});

const todayDate = format(new Date(), "EEEE, dd 'tháng' MM", { locale: vi });

const dropdownRef = ref(null);
const isDropdownOpen = ref(false);
onClickOutside(dropdownRef, () => isDropdownOpen.value = false);

const isSyncing = ref(false);

const handleSync = async () => {
  isSyncing.value = true;
  try {
    await habitStore.syncHabits();
    toast.success('Đồng bộ thành công!');
  } catch(e) {
    toast.error(e.message);
  } finally {
    isSyncing.value = false;
    isDropdownOpen.value = false;
  }
};

const showLogoutModal = ref(false);

const openLogoutModal = () => {
  isDropdownOpen.value = false;
  showLogoutModal.value = true;
};

const handleLogoutNoSync = () => {
  auth.logout();
  router.push('/');
  showLogoutModal.value = false;
};

const handleAvatarClick = () => {
  if (auth.token) {
    isDropdownOpen.value = !isDropdownOpen.value;
  } else {
    router.push('/auth');
  }
};

const handleSyncAndLogout = async () => {
  isSyncing.value = true;
  try {
    await habitStore.syncHabits();
    toast.success('Đồng bộ thành công!');
    auth.logout();
    router.push('/');
  } catch(e) {
    toast.error(e.message);
  } finally {
    isSyncing.value = false;
    showLogoutModal.value = false;
  }
};

onMounted(() => {
  auth.fetchProfile();
});

const avatarSvg = computed(() => {
  if (auth.user?.profilePic) {
    try {
      const style = new Style(definition);
      const avatar = new Avatar(style, { seed: auth.user.profilePic });
      return avatar.toString();
    } catch (e) {
      return '';
    }
  }
  return '';
});
</script>

<template>
  <nav class="bg-surface/80 backdrop-blur-xl border-b border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)] px-3 sm:px-4 py-3 select-none sticky top-0 z-[100]">
    <div class="container mx-auto max-w-5xl relative flex justify-between items-center h-8">
      
      <!-- Left side: Date & Context -->
      <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <span class="text-sm font-medium text-muted capitalize hidden sm:block">{{ todayDate }}</span>
        <template v-if="pageTitle">
          <span class="text-muted/30 select-none hidden sm:block">/</span>
          <span class="text-ink font-display text-base sm:text-lg tracking-tight font-medium truncate">{{ pageTitle }}</span>
        </template>
      </div>

      <!-- Center: Logo -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <RouterLink to="/" class="flex items-center gap-2 text-ink hover:text-muted transition-colors">
          <img src="/favicon.png" alt="HabitFlow" class="w-6 h-6 object-contain rounded-md" />
          <span class="font-display text-xl font-semibold tracking-tight italic hidden sm:block">HabitFlow</span>
        </RouterLink>
      </div>

      <!-- Right side: Avatar dropdown -->
      <div class="flex items-center justify-end flex-1 min-w-0 gap-2 sm:gap-4">
        <div class="relative" ref="dropdownRef">
          <button @click="handleAvatarClick"
            class="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors focus:outline-none">
            <div v-if="avatarSvg" class="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full overflow-hidden border border-border shrink-0"
              v-html="avatarSvg"></div>
            <User v-else class="w-5 h-5" />
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-surface border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 flex flex-col z-[100] transform origin-top-right transition-all">
            <RouterLink to="/profile" @click="isDropdownOpen = false" class="px-4 py-2 text-sm text-ink hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <User class="w-4 h-4 text-muted" /> Xem hồ sơ
            </RouterLink>
            <RouterLink to="/profile?mode=edit" @click="isDropdownOpen = false" class="px-4 py-2 text-sm text-ink hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <Pencil class="w-4 h-4 text-muted" /> Sửa hồ sơ
            </RouterLink>
            <button @click="handleSync" :disabled="isSyncing" class="px-4 py-2 text-sm text-ink hover:bg-gray-50 flex items-center gap-3 text-left disabled:opacity-50 w-full transition-colors">
              <Cloud class="w-4 h-4 text-muted" :class="isSyncing ? 'animate-pulse' : ''" /> {{ isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Cloud' }}
            </button>
            <div class="h-px bg-border my-1 w-full"></div>
            <button @click="openLogoutModal" class="px-4 py-2 text-sm text-[#9F2F2D] hover:bg-[#FDEBEC] flex items-center gap-3 text-left w-full transition-colors">
              <LogOut class="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 flex items-center justify-center z-[200]">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity" @click="showLogoutModal = false"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-surface border border-white/20 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all flex flex-col gap-6" style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5);">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <LogOut class="w-6 h-6 text-accent-red-text" />
          </div>
          <h3 class="text-xl font-display font-semibold text-ink">Đăng xuất tài khoản</h3>
          <p class="text-sm text-muted">
            Dữ liệu chưa đồng bộ sẽ bị mất. Bạn có muốn đồng bộ lên Cloud trước khi thoát không?
          </p>
        </div>

        <!-- Actions (Vertical Stack for better readability) -->
        <div class="flex flex-col gap-3 mt-2">
          <button @click="handleSyncAndLogout" :disabled="isSyncing" class="w-full px-4 py-3.5 text-white bg-ink hover:bg-black rounded-xl transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98]">
            <Cloud class="w-4 h-4" :class="isSyncing ? 'animate-pulse' : ''" />
            {{ isSyncing ? 'Đang xử lý...' : 'Đồng bộ & Đăng xuất' }}
          </button>
          
          <button @click="handleLogoutNoSync" class="w-full px-4 py-3 text-accent-red-text bg-red-50 hover:bg-red-100 rounded-xl transition-all font-medium active:scale-[0.98]">
            Đăng xuất không đồng bộ
          </button>
          
          <button @click="showLogoutModal = false" class="w-full px-4 py-3 text-muted hover:text-ink transition-colors font-medium rounded-xl">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
