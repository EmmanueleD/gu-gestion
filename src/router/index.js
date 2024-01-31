import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

import AppLayout from "@/layout/AppLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/Home.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "test",
          name: "test",
          component: () => import("@/views/Test.vue"),
          meta: { requiresAuth: true, gest_role_id: [1, 3] },
        },
        {
          path: "calc-hours",
          name: "calc-hours",
          component: () => import("@/views/humanResources/CalcHours.vue"),
          meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
        },
        {
          path: "list-excel-hours",
          name: "list-excel-hours",
          component: () => import("@/views/humanResources/ListExcelHours.vue"),
          meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
        },
        {
          path: "modifiers",
          name: "modifiers",
          children: [
            {
              path: "base-value",
              name: "base-value",
              component: () => import("@/views/modifiers/base-value.vue"),
              meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
            },
          ],
        },
      ],
    },
    {
      path: "/access",
      name: "access",
      component: () => import("@/views/auth/Access.vue"),
    },
    {
      path: "/access-denied",
      name: "access-denied",
      component: () => import("@/views/auth/AccessDenied.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/auth/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: "access" });
    } else {
      if (!to.meta.gest_role_id) {
        next();
      } else {
        if (to.meta.gest_role_id.includes(authStore.profile?.gest_role_id)) {
          next();
        } else {
          next({ name: "access-denied" });
        }
      }
    }
  } else {
    next();
  }
});

export default router;
