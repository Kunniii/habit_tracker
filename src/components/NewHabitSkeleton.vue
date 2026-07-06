<script setup>
  import { useRouter } from "vue-router";
  import { Plus } from "lucide-vue-next";

  const router = useRouter();

  const addNewHabit = () => {
    router.push("/add");
  };
</script>

<template>
  <div
    class="cursor-pointer bg-surface border border-dashed border-border rounded-xl p-5 min-h-[220px] flex flex-col justify-center items-center group transition hover:border-ink hover:bg-canvas"
    @click="addNewHabit"
  >
    <div class="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted group-hover:text-ink group-hover:border-ink transition-colors mb-4">
      <Plus :size="24" />
    </div>
    <p class="font-medium text-muted group-hover:text-ink transition-colors">Thêm thói quen mới</p>
  </div>
</template>
