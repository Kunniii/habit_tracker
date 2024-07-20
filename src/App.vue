<script setup>
  import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white">
    <NavBar />
    <RouterView />
  </div>
</template>
