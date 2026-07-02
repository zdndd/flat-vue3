import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/casher",
      name: "casher",
      children: [],

      component: () => import("../views/CasherView.vue"),
    },
    {
      path: "/protal",
      name: "protal",
      children: [],

      component: () => import("../views/ProtalView.vue"),
    },
  ],
});

export default router;
