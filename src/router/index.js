import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: () => import("../components/LandingPage.vue"), meta: { title: "Trang chủ" } },
  { path: "/feed", component: () => import("../components/Feed.vue"), meta: { title: "Bảng tin" } },
  { path: "/feed/:id", component: () => import("../components/SinglePost.vue"), meta: { title: "Bài đăng" } },
  { path: "/auth", component: () => import("../components/Auth.vue"), meta: { title: "Đăng nhập" } },
  { path: "/profile/:username?", component: () => import("../components/UserProfile.vue"), meta: { title: "Hồ sơ" } },
  { path: "/dashboard", component: () => import("../components/Dashboard.vue"), meta: { title: "Bảng điều khiển" } },
  { path: "/habit/:id", component: () => import("../components/HabitDetail.vue"), meta: { title: "Chi tiết thói quen" } },
  { path: "/add", component: () => import("../components/AddHabit.vue"), meta: { title: "Thêm thói quen" } },
  { path: "/edit/:id", component: () => import("../components/EditHabit.vue"), meta: { title: "Sửa thói quen" } },
  {
    path: "/habit/:id/calendar",
    component: () => import("../components/Calendar.vue"),
    meta: { title: "Lịch sử" }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | HabitFlow` : 'HabitFlow';
});

export default router;
