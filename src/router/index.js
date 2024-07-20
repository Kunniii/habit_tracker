import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import HabitDetail from "../components/HabitDetail.vue";
import AddHabit from "../components/AddHabit.vue";
import EditHabit from "../components/EditHabit.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/habit/:id", component: HabitDetail },
  { path: "/add", component: AddHabit },
  { path: "/edit/:id", component: EditHabit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
