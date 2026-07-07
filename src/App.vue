<script setup>
  import NavBar from "./components/NavBar.vue";
  import { Toaster, toast } from 'vue-sonner';
  import { useNetwork } from '@vueuse/core';
  import { watch } from 'vue';
  import { useHabitStore } from './stores/habitStore';
  import { useAuthStore } from './stores/auth';

  const { isOnline } = useNetwork();
  const habitStore = useHabitStore();
  const authStore = useAuthStore();

  watch(isOnline, async (newVal, oldVal) => {
    // Only trigger sync if we just came back online and the user is logged in
    if (newVal === true && oldVal === false && authStore.token) {
      toast('Đã kết nối mạng lại, đang đồng bộ...', { icon: '🔄' });
      try {
        await habitStore.syncHabits();
        toast.success('Đồng bộ thành công!');
      } catch (e) {
        toast.error('Đồng bộ thất bại: ' + e.message);
      }
    }
  });
</script>

<template>
  <div class="min-h-[100dvh] bg-canvas text-ink font-sans selection:bg-ink selection:text-white">
    <NavBar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Toaster richColors position="top-center" />
  </div>
</template>
