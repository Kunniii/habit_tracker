<script setup>
  import { Star } from "lucide-vue-next";
</script>

<template>
  <nav class="bg-gray-800 px-4 py-2 select-none">
    <div class="container mx-auto flex justify-between items-center">
      <div
        class="text-white text-xl font-bold hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md cursor-pointer"
      >
        <RouterLink to="/"> Habit Tracker </RouterLink>
      </div>
      <div>
        <RouterLink
          to="/"
          class="text-gray-300 transition hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/add"
          class="text-gray-300 transition hover:bg-green-700 hover:text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium"
        >
          Add Habit
        </RouterLink>
        <span class="mx-3">|</span>
        <a
          href="https://github.com/Kunniii/habit_tracker"
          target="_blank"
          class="text-gray-300 hover:bg-gray-700 hover:text-white hover:underline px-3 py-2 rounded-md cursor-pointer text-sm font-medium"
        >
          Source Code
        </a>
      </div>
    </div>
  </nav>
</template>
