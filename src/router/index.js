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
          path: "profile",
          name: "profile",
          component: () => import("@/views/profile.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "test",
          name: "test",
          component: () => import("@/views/Test.vue"),
          meta: { requiresAuth: true, gest_role_id: [1, 3] },
        },
        {
          path: "playground",
          name: "playground",
          component: () => import("@/views/playground.vue"),
          meta: { requiresAuth: true, gest_role_id: [1] },
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
          path: "roles",
          name: "roles",
          component: () => import("@/views/humanResources/roles.vue"),
          meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
        },
        {
          path: "staff",
          name: "staff",
          component: () => import("@/views/humanResources/staff.vue"),
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
            {
              path: "presence-modifier",
              name: "presence-modifier",
              component: () =>
                import("@/views/modifiers/presence-modifier.vue"),
              meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
            },
            {
              path: "seniority-modifier",
              name: "seniority-modifier",
              component: () =>
                import("@/views/modifiers/seniority-modifier.vue"),
              meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
            },
            {
              path: "role-modifier",
              name: "role-modifier",
              component: () => import("@/views/modifiers/role-modifier.vue"),
              meta: { requiresAuth: true, gest_role_id: [1, 2, 3] },
            },
            {
              path: "ypf-lsm",
              name: "ypf-lsm",
              component: () => import("@/views/modifiers/ypf-lsm.vue"),
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
      path: "/auth/password-reset",
      name: "password-reset",
      component: () => import("@/views/auth/password-reset.vue"),
    },
    {
      path: "/beneficios",
      name: "beneficios",
      component: () => import("@/views/beneficios.vue"),
    },
    {
      path: "/auth/password-change",
      name: "password-change",
      component: () => import("@/views/auth/password-change.vue"),
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
