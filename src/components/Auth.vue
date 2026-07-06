<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User as UserIcon, Lock, CheckCircle, LogIn, UserPlus } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  successMessage.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin';
    successMessage.value = '';
    return;
  }
  
  if (!isLogin.value && password.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
    successMessage.value = '';
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register';
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      if (isLogin.value) {
        auth.login(data.token, data.username);
        router.push('/profile');
      } else {
        // Registered successfully
        isLogin.value = true;
        successMessage.value = 'Đăng ký thành công. Vui lòng đăng nhập.';
        password.value = '';
        confirmPassword.value = '';
      }
    } else {
      error.value = data.error || 'Có lỗi xảy ra';
    }
  } catch (err) {
    error.value = 'Không thể kết nối đến máy chủ';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-canvas">
    <div class="w-full max-w-[400px] bg-surface border border-border p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      
      <!-- Brand & Header -->
      <div class="flex flex-col items-center mb-8 text-center">
        <RouterLink to="/" class="flex items-center gap-2 text-ink hover:opacity-80 transition-opacity mb-6">
          <img src="/favicon.png" alt="HabitFlow" class="w-8 h-8 object-contain rounded-md" />
          <span class="font-display text-3xl font-semibold tracking-tight italic">HabitFlow</span>
        </RouterLink>
        <h1 class="text-xl font-medium tracking-tight text-ink mb-1">
          {{ isLogin ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản mới' }}
        </h1>
        <p class="text-sm text-muted">
          {{ isLogin ? 'Chào mừng bạn quay trở lại' : 'Bắt đầu hành trình xây dựng thói quen' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-[0.05em] text-muted flex items-center gap-1.5">
            <UserIcon class="w-3.5 h-3.5" /> Tên đăng nhập
          </label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full px-3 py-2.5 bg-background border border-border rounded-md text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
            placeholder="username"
            autocomplete="username"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-[0.05em] text-muted flex items-center gap-1.5">
            <Lock class="w-3.5 h-3.5" /> Mật khẩu
          </label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-3 py-2.5 bg-background border border-border rounded-md text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
            placeholder="••••••••"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
          />
        </div>

        <div v-if="!isLogin" class="flex flex-col gap-2">
          <label class="text-xs font-medium uppercase tracking-[0.05em] text-muted flex items-center gap-1.5">
            <CheckCircle class="w-3.5 h-3.5" /> Xác nhận
          </label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="w-full px-3 py-2.5 bg-background border border-border rounded-md text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>

        <div v-if="error" class="p-3 bg-[#FDEBEC] text-[#9F2F2D] text-sm border border-[#EAEAEA] rounded-md">
          {{ error }}
        </div>
        
        <div v-if="successMessage" class="p-3 bg-[#EDF3EC] text-[#346538] text-sm border border-[#EAEAEA] rounded-md">
          {{ successMessage }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="mt-2 w-full px-4 py-2.5 bg-ink text-white text-sm font-medium rounded-md hover:bg-[#333333] transition-transform hover:scale-[0.98] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          <component :is="isLogin ? LogIn : UserPlus" class="w-4 h-4" />
          {{ isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký') }}
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-border text-center">
        <p class="text-sm text-muted">
          {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
          <button 
            @click="toggleMode"
            class="text-ink font-medium hover:underline ml-1"
          >
            {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
