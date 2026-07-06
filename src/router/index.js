import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: () => import("../components/LandingPage.vue") },
  { path: "/feed", component: () => import("../components/Feed.vue") },
  { path: "/feed/:id", component: () => import("../components/SinglePost.vue") },
  { path: "/auth", component: () => import("../components/Auth.vue") },
  { path: "/profile/:username?", component: () => import("../components/UserProfile.vue") },
  { path: "/dashboard", component: () => import("../components/Dashboard.vue") },
  { path: "/habit/:id", component: () => import("../components/HabitDetail.vue") },
  { path: "/add", component: () => import("../components/AddHabit.vue") },
  { path: "/edit/:id", component: () => import("../components/EditHabit.vue") },
  {
    path: "/habit/:id/calendar",
    component: () => import("../components/Calendar.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
