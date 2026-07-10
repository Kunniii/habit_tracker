<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useHabitStore } from "../stores/habitStore";

  const habitName = ref("");
  const habitDescription = ref("");
  const habitStore = useHabitStore();
  const router = useRouter();

  const submitHabit = () => {
    const newHabit = {
      id: Date.now(),
      name: habitName.value,
      description: habitDescription.value,
      datesDone: [],
    };
    habitStore.addHabit(newHabit);
    router.back();
  };

  const goBack = () => {
    router.back();
  };
</script>

<template>
  <div class="container mx-auto px-3 sm:px-4 max-w-xl pt-8 sm:pt-12 pb-24">
    <div class="bg-surface border border-border shadow-subtle rounded-xl p-5 sm:p-8">
      <h1 class="text-3xl sm:text-4xl font-display tracking-tight font-medium mb-6 sm:mb-8 text-ink">Thói quen mới</h1>
      <form
        @submit.prevent="submitHabit"
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
            placeholder="VD: Đọc 10 trang sách"
            class="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm border border-border rounded-md focus:outline-none bg-canvas text-ink placeholder-muted focus:ring-1 focus:ring-ink focus:border-ink transition-shadow"
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
            placeholder="Tại sao bạn muốn xây dựng thói quen này?"
            class="block w-full h-32 px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm border border-border rounded-md focus:outline-none bg-canvas text-ink placeholder-muted focus:ring-1 focus:ring-ink focus:border-ink transition-shadow resize-y"
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
            Tạo thói quen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
