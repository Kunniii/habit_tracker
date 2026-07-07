# 🌿 HabitFlow

**HabitFlow** là một nền tảng theo dõi và chia sẻ thói quen (Habit Tracker) mang phong cách tối giản (Minimalist UI). Ứng dụng giúp bạn dễ dàng thiết lập mục tiêu hàng ngày, duy trì chuỗi ngày liên tiếp (streaks) và chia sẻ thành tích lên Bảng tin cộng đồng để cùng nhau tạo động lực phát triển bản thân.

## ✨ Tính năng nổi bật
- **Theo dõi thói quen**: Đánh dấu hoàn thành mỗi ngày, xem chuỗi ngày dài nhất.
- **Local-First & Offline Mode**: Ứng dụng là một PWA (Progressive Web App). Dữ liệu thói quen được lưu trữ cục bộ, cho phép bạn thao tác ngay cả khi mất mạng. Dữ liệu sẽ tự động đồng bộ (Auto-sync) ngay khi có kết nối Internet trở lại.
- **Bảng tin cộng đồng (Feed)**: Chia sẻ thành tích "Đã hoàn thành" của bạn lên bảng tin công khai và nhận được những tràng vỗ tay (claps) khích lệ từ người khác.
- **Thiết kế tinh tế**: Giao diện tập trung vào sự đơn giản, không gây xao nhãng, thân thiện trên mọi thiết bị.

## 🛠 Công nghệ sử dụng
- **Frontend**: Vue 3 (Composition API), Vite, TailwindCSS, Pinia, Vue Router, `@vueuse/core`.
- **Backend**: Node.js, Express, Sequelize (SQLite), JWT Authentication.
- **Triển khai (Deployment)**: Hỗ trợ Docker & Traefik (`docker-compose.yml` có sẵn).
