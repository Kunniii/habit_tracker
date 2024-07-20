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
          class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/add"
          class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md cursor-pointer text-sm font-medium"
        >
          Add Habit
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
