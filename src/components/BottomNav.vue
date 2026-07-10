<script setup>
import { Globe, LayoutDashboard, User } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90]">
    <div class="flex items-center gap-1 bg-surface/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full p-1.5 pointer-events-auto">
      
      <!-- Feed -->
      <RouterLink 
        to="/feed" 
        class="relative flex items-center justify-center px-8 py-3 rounded-full transition-all duration-300 group"
        :class="route.path.startsWith('/feed') ? 'text-ink bg-gray-100 shadow-sm' : 'text-muted hover:text-ink hover:bg-gray-50/50'"
        title="Cộng đồng"
      >
        <Globe class="w-5 h-5 relative z-10 transition-transform group-active:scale-95" />
      </RouterLink>

      <!-- Dashboard -->
      <RouterLink 
        to="/dashboard" 
        class="relative flex items-center justify-center px-8 py-3 rounded-full transition-all duration-300 group"
        :class="route.path === '/dashboard' || route.path === '/add' || route.path.startsWith('/habit') ? 'text-ink bg-gray-100 shadow-sm' : 'text-muted hover:text-ink hover:bg-gray-50/50'"
        title="Thói quen"
      >
        <LayoutDashboard class="w-5 h-5 relative z-10 transition-transform group-active:scale-95" />
      </RouterLink>

      <!-- Profile -->
      <RouterLink 
        to="/profile" 
        class="relative flex items-center justify-center px-8 py-3 rounded-full transition-all duration-300 group"
        :class="route.path.startsWith('/profile') ? 'text-ink bg-gray-100 shadow-sm' : 'text-muted hover:text-ink hover:bg-gray-50/50'"
        title="Hồ sơ"
      >
        <User class="w-5 h-5 relative z-10 transition-transform group-active:scale-95" />
      </RouterLink>
      
    </div>
  </div>
</template>
