<script setup>
  import NavBar from "./components/NavBar.vue";
  import { Toaster } from 'vue-sonner';
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
