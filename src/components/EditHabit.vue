<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";
  import { Trash2, X } from "lucide-vue-next";

  const route = useRoute();
  const router = useRouter();
  const habitStore = useHabitStore();

  const computedHabit = computed(() =>
    habitStore.habits.find((h) => h.id === Number(route.params.id))
  );
  const habit = computedHabit.value;
  const habitName = ref(habit?.name || "");
  const habitDescription = ref(habit?.description || "");
  const habitID = Number(route.params.id);

  const submitEdit = () => {
    habitStore.updateHabit(habitID, {
      ...habit,
      name: habitName.value,
      description: habitDescription.value,
    });
    router.push(`/habit/${habitID}`);
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/");
  };

  const deleteHabit = () => {
    habitStore.deleteHabit(Number(habitID));
    goHome();
  };

  onMounted(() => {
    if (!habit) {
      router.back();
    }
  });
</script>
<template>
  <div class="container mx-auto p-4">
    <div class="max-w-lg mx-auto bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-2xl font-bold text-white">Update Habit</h1>
        <div class="flex gap-2">
          <button
            title="Delete"
            @click="deleteHabit"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-rose-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <Trash2 />
          </button>
          <button
            title="Close"
            @click="goBack"
            class="text-gray-400 hover:text-white hover:scale-105 hover:bg-slate-500 rounded-lg p-1 transition hover:shadow-md"
          >
            <X />
          </button>
        </div>
      </div>
      <form
        @submit.prevent="submitEdit"
        class="space-y-4"
      >
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-300"
            >Habit Name</label
          >
          <input
            type="text"
            id="name"
            v-model="habitName"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-300"
            >Description</label
          >
          <textarea
            id="description"
            v-model="habitDescription"
            class="scrollable-container mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div class="flex gap-5">
          <button
            @click="goBack"
            tabindex="3"
            class="w-full inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="mx-auto">Go Back</span>
          </button>
          <button
            @click="goBack"
            tabindex="3"
            class="w-full inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <span class="mx-auto">Delete</span>
          </button>
          <button
            type="submit"
            class="w-full inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span class="mx-auto">Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
