<script setup>
  import { AlarmClockCheck, BookType, FileText, Goal } from "lucide-vue-next";
  import FeatureCard from "./FeatureCard.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Hero Section -->
    <section
      class="flex flex-col items-center justify-center h-svh text-center bg-gray-900 animate-fade-in"
    >
      <h1 class="text-5xl font-bold text-indigo-400 mb-4">Welcome to Habit Tracker</h1>
      <p class="text-xl text-green-400 mb-8">Track your habits efficiently and effortlessly.</p>
      <router-link to="/dashboard">
        <button
          class="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 focus:outline-none transition hover:scale-105 animate-bounce"
        >
          Let's Get Started
        </button>
      </router-link>
    </section>

    <!-- Features Section -->
    <section class="pt-24 pb-28 bg-gray-800">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-indigo-400 mb-12 animate-fade-in">
          Features
        </h2>
        <div class="grid grid-cols-5 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 -mx-4">
          <FeatureCard
            title="Easy Tracking"
            description="Track your habits with ease using our simple interface."
          >
            <Goal
              :size="40"
              :stroke-width="2.5"
            />
          </FeatureCard>
          <FeatureCard
            title="Detailed Reports"
            description="Get detailed reports on your progress and achievements."
          >
            <FileText
              :size="40"
              :stroke-width="2.5"
            />
          </FeatureCard>
          <FeatureCard
            title="Custom Reminders"
            description="Set custom reminders to keep you on track with your goals."
          >
            <AlarmClockCheck
              :size="40"
              :stroke-width="2.5"
            />
          </FeatureCard>
          <FeatureCard
            title="Markdown Support"
            description="Write your notes and goals in markdown for better formatting."
          >
            <BookType
              :size="40"
              :stroke-width="2.5"
            />
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-green-400 mb-8 animate-fade-in">
          Ready to start tracking your habits?
        </h2>
        <router-link to="/dashboard">
          <button
            class="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 focus:outline-none animate-bounce"
          >
            Get Started
          </button>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 bg-gray-800 text-center">
      <p class="text-indigo-400">&copy; 2024 Habit Tracker. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-fade-in {
    animation: fade-in 1s ease-in;
  }
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  .animate-bounce {
    animation: bounce 2s infinite;
  }
</style>
