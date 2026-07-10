<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";

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

  onMounted(() => {
    if (!habit) {
      router.back();
    }
  });
</script>

<template>
  <div class="container mx-auto px-3 sm:px-4 max-w-xl pt-8 sm:pt-12 pb-24">
    <div class="bg-surface border border-border shadow-subtle rounded-xl p-5 sm:p-8">
      <h1 class="text-3xl sm:text-4xl font-display tracking-tight font-medium mb-6 sm:mb-8 text-ink">Sửa thói quen</h1>
      <form
        @submit.prevent="submitEdit"
        class="space-y-6"
      >
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-ink mb-2"
            >Tên thói quen</label
          >
          <input
            type="text"
            id="name"
            v-model="habitName"
            required
            class="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-[16px] sm:text-sm border border-border rounded-md focus:outline-none bg-canvas text-ink placeholder-muted focus:ring-1 focus:ring-ink focus:border-ink transition-shadow"
          />
        </div>
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-ink mb-2"
            >Mô tả <span class="text-muted font-normal text-xs ml-2">(Hỗ trợ Markdown)</span></label
          >
          <textarea
            id="description"
            v-model="habitDescription"
            class="block w-full h-32 px-3 sm:px-4 py-2.5 sm:py-3 text-[16px] sm:text-sm border border-border rounded-md focus:outline-none bg-canvas text-ink placeholder-muted focus:ring-1 focus:ring-ink focus:border-ink transition-shadow resize-y"
          ></textarea>
        </div>
        <div class="flex gap-4 pt-4">
           <button
            type="button"
            @click="goBack"
            class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-border text-sm font-medium rounded-md text-ink bg-canvas hover:bg-border transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-ink hover:bg-black transition-transform hover:scale-[0.98]"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
