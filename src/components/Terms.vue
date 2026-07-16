<script setup>
</script>

<template>
<div class="min-h-screen flex flex-col">
  <div class="container mx-auto p-4 max-w-3xl pt-16 pb-24 flex-1">
    <div class="prose prose-neutral prose-h1:text-3xl prose-h2:text-2xl text-ink max-w-none">
      <h1 class="font-medium tracking-tight">Điều khoản và Điều kiện</h1>
      <p class="text-muted">Cập nhật lần cuối: 07/07/2026</p>
      
      <hr class="my-8 border-border" />

      <h2 class="font-medium tracking-tight mt-8 mb-4">1. Giới thiệu</h2>
      <p>Chào mừng bạn đến với <strong>HabitFlow</strong>. Bằng việc truy cập và sử dụng ứng dụng của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>
      
      <h2 class="font-medium tracking-tight mt-8 mb-4">2. Tài khoản người dùng</h2>
      <p>Bạn hoàn toàn có quyền <strong>sử dụng ứng dụng ẩn danh (anonymous)</strong> mà không cần tạo tài khoản. Việc tạo tài khoản là hoàn toàn tùy chọn, chủ yếu dành cho mục đích đồng bộ dữ liệu hoặc chia sẻ thành tích. Nếu tạo tài khoản, bạn hoàn toàn chịu trách nhiệm bảo vệ tính bảo mật của mật khẩu và các hoạt động diễn ra dưới tài khoản của mình. Vui lòng không chia sẻ tài khoản cho người khác. Nếu phát hiện truy cập trái phép, bạn cần thông báo ngay cho chúng tôi qua email: <strong>contact@codechovui.dev</strong>.</p>
      
      <h2 class="font-medium tracking-tight mt-8 mb-4">3. Nội dung người dùng</h2>
      <p>Mọi nội dung bạn đăng tải (bao gồm tên thói quen, bài đăng chia sẻ thành tích, và mô tả) phải tuân thủ pháp luật và đạo đức xã hội. Nội dung <strong>không được chứa</strong> ngôn từ kích động, thù địch, quấy rối hoặc vi phạm quyền riêng tư của người khác. Chúng tôi có quyền xóa bất kỳ nội dung nào vi phạm mà không cần báo trước.</p>

      <h2 class="font-medium tracking-tight mt-8 mb-4">4. Dữ liệu và Quyền riêng tư</h2>
      <p>HabitFlow được xây dựng theo cơ chế <strong>Local-First</strong>. Theo mặc định, toàn bộ dữ liệu thói quen của bạn được lưu trữ trực tiếp và an toàn trên thiết bị của bạn (Local Storage). Nếu bạn đã tạo và đăng nhập tài khoản, dữ liệu của bạn sẽ được <strong>tự động đồng bộ (auto sync)</strong> lên máy chủ để đảm bảo an toàn và trải nghiệm xuyên suốt trên nhiều thiết bị. Bạn vẫn có thể đồng bộ thủ công bằng nút đồng bộ trên thanh điều hướng. Quyền chia sẻ thành tích lên Bảng tin công khai là hoàn toàn tùy chọn thuộc về bạn. Chúng tôi cam kết tuyệt đối không bán dữ liệu cá nhân của bạn cho bên thứ ba.</p>

      <h2 class="font-medium tracking-tight mt-8 mb-4">5. Giới hạn trách nhiệm</h2>
      <p>HabitFlow được cung cấp theo hiện trạng "nguyên trạng" (As Is). Chúng tôi luôn cố gắng mang lại trải nghiệm tốt nhất nhưng không cam kết ứng dụng sẽ hoàn toàn không có lỗi, không bị gián đoạn hoặc mất mát dữ liệu.</p>

      <h2 class="font-medium tracking-tight mt-8 mb-4">6. Thay đổi điều khoản</h2>
      <p>Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng ứng dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới đó.</p>
    </div>
  </div>

  <!-- Footer -->
  <footer class="py-8 bg-surface border-t border-border text-center flex flex-col items-center justify-center gap-2 mt-auto">
    <p class="text-sm text-muted font-mono"> &copy; {{ new Date().getFullYear() }} <span class="font-display italic font-semibold">HabitFlow @</span> CodeChoVui</p>
    <router-link to="/" class="text-xs text-muted hover:text-ink transition-colors underline underline-offset-2">Trở về Trang chủ</router-link>
  </footer>
</div>
</template>
