<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center h-screen text-center bg-gray-900">
      <h1 class="text-5xl font-bold text-indigo-500 mb-4">Welcome to Habit Tracker</h1>
      <p class="text-xl text-green-400 mb-8">Track your habits efficiently and effortlessly.</p>
      <router-link to="/dashboard">
        <button
          class="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 focus:outline-none"
        >
          Go to Dashboard
        </button>
      </router-link>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-800">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-indigo-500 mb-12">Features</h2>
        <div class="flex flex-wrap -mx-4">
          <div class="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <div class="bg-gray-700 p-6 rounded-lg text-center">
              <h3 class="text-2xl font-bold mb-4">Easy Tracking</h3>
              <p>Track your habits with ease using our simple interface.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <div class="bg-gray-700 p-6 rounded-lg text-center">
              <h3 class="text-2xl font-bold mb-4">Detailed Reports</h3>
              <p>Get detailed reports on your progress and achievements.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-4">
            <div class="bg-gray-700 p-6 rounded-lg text-center">
              <h3 class="text-2xl font-bold mb-4">Custom Reminders</h3>
              <p>Set custom reminders to keep you on track with your goals.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-indigo-500 mb-8">
          Ready to start tracking your habits?
        </h2>
        <router-link to="/dashboard">
          <button
            class="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 focus:outline-none"
          >
            Get Started
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>
