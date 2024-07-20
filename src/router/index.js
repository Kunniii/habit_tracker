import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Dashboard from "../components/Dashboard.vue";
import HabitDetail from "../components/HabitDetail.vue";
import AddHabit from "../components/AddHabit.vue";
import EditHabit from "../components/EditHabit.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/habit/:id", component: HabitDetail },
  { path: "/add", component: AddHabit },
  { path: "/edit/:id", component: EditHabit },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
