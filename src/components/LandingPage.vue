<script setup>
  import { Activity, Users, Flame, LayoutTemplate, Lock } from "lucide-vue-next";
</script>

<template>
  <div class="min-h-[100dvh] bg-canvas text-ink flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 flex flex-col justify-center py-24 px-6 relative overflow-hidden">
      <!-- Mobile Background -->
      <div class="absolute inset-0 md:hidden">
        <div class="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-80"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-canvas/40 via-canvas/80 to-canvas"></div>
      </div>

      <div class="container mx-auto max-w-5xl relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="max-w-xl animate-fade-in">
            <div class="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-border rounded-full text-xs uppercase tracking-widest font-mono text-muted">
              <span class="w-2 h-2 rounded-full bg-accent-green-text"></span>
              Habit Tracking - Social
            </div>
            <h1 class="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-[1.1] mb-6">
              Track less.<br />Achieve more.
            </h1>
            <p class="text-lg text-muted mb-8 max-w-[45ch] leading-relaxed">
              Một không gian tối giản để xây dựng thói quen, duy trì chuỗi ngày và chia sẻ tiến độ. Không ồn ào, chỉ tập trung.
            </p>
            <div class="flex gap-4">
              <router-link to="/dashboard">
                <button class="bg-ink text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-black transition-transform hover:scale-[0.98]">
                  Bắt đầu một thói quen mới
                </button>
              </router-link>
              <router-link to="/feed">
                <button class="bg-surface border border-border text-ink px-6 py-3 rounded-md text-sm font-medium hover:bg-canvas transition-colors">
                  Xem mọi người đạt được gì
                </button>
              </router-link>
            </div>
          </div>
          <div class="hidden md:flex justify-center animate-fade-in relative">
             <div class="absolute inset-0 bg-accent-blue-bg rounded-3xl blur-3xl opacity-50 -z-10"></div>
             <img src="/hero.png" alt="Consistency and Focus" class="w-full max-w-sm rounded-2xl shadow-subtle border border-border object-cover aspect-[4/3] bg-surface" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Features Section -->
    <section class="py-24 bg-surface border-t border-border">
      <div class="container mx-auto px-6 max-w-5xl">
        <h2 class="text-4xl md:text-5xl font-display font-medium tracking-tight mb-12">Giúp bạn giữ vững thói quen mỗi ngày.</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-1 md:col-span-2 bg-canvas border border-border rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <div class="w-12 h-12 rounded-xl bg-accent-blue-bg text-accent-blue-text flex items-center justify-center mb-6">
                <Users :size="24" />
              </div>
              <h3 class="text-xl font-medium mb-3">Cộng đồng là trung tâm</h3>
              <p class="text-muted max-w-[40ch]">
                Chia sẻ cột mốc của bạn lên bảng tin toàn cầu. Lấy cảm hứng từ những người khác đang đạt mục tiêu và duy trì chuỗi ngày của họ.
              </p>
            </div>
          </div>

          <div class="col-span-1 bg-canvas border border-border rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
               <div class="w-12 h-12 rounded-xl bg-accent-red-bg text-accent-red-text flex items-center justify-center mb-6">
                <Activity :size="24" />
              </div>
              <h3 class="text-xl font-medium mb-3">Theo dõi chuỗi ngày</h3>
              <p class="text-muted">
                Hình ảnh hóa sự kiên trì là cách tốt nhất để duy trì nó. Hãy xem chuỗi ngày của bạn tăng lên.
              </p>
            </div>
          </div>
          
          <div class="col-span-1 bg-canvas border border-border rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
             <div>
               <div class="w-12 h-12 rounded-xl bg-accent-green-bg text-accent-green-text flex items-center justify-center mb-6">
                <LayoutTemplate :size="24" />
              </div>
              <h3 class="text-xl font-medium mb-3">Giao diện tinh tế</h3>
              <p class="text-muted">
                Một môi trường sạch sẽ, không xao nhãng, mang lại cảm giác giống một cuốn nhật ký cao cấp hơn là một cơ sở dữ liệu.
              </p>
            </div>
          </div>

          <div class="col-span-1 md:col-span-2 bg-canvas border border-border rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
               <div class="w-12 h-12 rounded-xl bg-accent-yellow-bg text-accent-yellow-text flex items-center justify-center mb-6">
                <Lock :size="24" />
              </div>
              <h3 class="text-xl font-medium mb-3">Dữ liệu của bạn là của riêng bạn.</h3>
              <p class="text-muted max-w-[40ch]">
                Lưu trữ mọi thứ trong bộ nhớ trình duyệt. Tốc độ cực nhanh, ngoại tuyến, và hoàn toàn riêng tư.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 bg-surface border-t border-border text-center flex flex-col items-center justify-center gap-2">
      <p class="text-sm text-muted font-mono"> &copy; {{ new Date().getFullYear() }} <span class="font-display italic font-semibold">HabitFlow @</span> CodeChoVui</p>
      <router-link to="/terms" class="text-xs text-muted hover:text-ink transition-colors underline underline-offset-2">Điều khoản và Điều kiện</router-link>
    </footer>
  </div>
</template>

<style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
