<template>
  <nav class="bg-gray-800 p-4 select-none">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-xl font-bold">
        <RouterLink to="/"> Habit Tracker </RouterLink>
      </div>
      <div>
        <router-link
          to="/"
          class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </router-link>
        <router-link
          to="/add"
          class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Add Habit
        </router-link>
      </div>
    </div>
  </nav>
</template>
