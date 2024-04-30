<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import AppMenuItem from "./AppMenuItem.vue";

const authStore = useAuthStore();

const model = ref([
  {
    label: "Dev",
    gest_role_id: [1],
    items: [
      {
        label: "Test",
        icon: "pi pi-fw pi-eraser",
        to: "/test",
        gest_role_id: [1],
      },
      {
        label: "Playground",
        icon: "pi pi-fw pi-desktop",
        to: "/playground",
        gest_role_id: [1],
      },
      {
        label: "404",
        icon: "pi pi-fw pi-times",
        to: "/404",
        gest_role_id: [1],
      },
    ],
  },
  {
    label: "Gestión",
    gest_role_id: [1, 2, 3],
    items: [
      {
        label: "Home",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "Perfil",
        icon: "pi pi-fw pi-user",
        to: "/profile",
      },
    ],
  },
  {
    label: "Comünidad",
    gest_role_id: [1, 3, 7],
    items: [
      {
        label: "Status report",
        icon: "pi pi-fw pi-info-circle",
        to: "/community/status-report",
      },
    ],
  },
  {
    label: "Recursos Humanos",
    gest_role_id: [1, 2, 3],
    items: [
      {
        label: "Lista Documentos Cargados",
        icon: "pi pi-fw pi-folder",
        to: "/list-excel-hours",
        gest_role_id: [1, 2, 3],
      },
      {
        label: "Calculadora Horas",
        icon: "pi pi-fw pi-th-large",
        to: "/calc-hours",
        gest_role_id: [1, 2, 3],
      },
      {
        label: "Suledos",
        icon: "pi pi-fw pi-money-bill",
        to: "/paycheck-list",
        gest_role_id: [1, 2, 3],
      },
      {
        label: "Staff",
        icon: "pi pi-fw pi-users",
        to: "/staff",
        gest_role_id: [1, 2, 3],
      },
      {
        label: "Roles",
        icon: "pi pi-fw pi-users",
        to: "/roles",
        gest_role_id: [1, 2, 3],
      },
      {
        label: "Modificadores e indicadores",
        icon: "pi pi-fw pi-clock",
        gest_role_id: [1, 2, 3],
        items: [
          {
            label: "Hora base",
            icon: "pi pi-fw pi-clock",
            to: "/modifiers/base-value",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Presentismo",
            icon: "pi pi-fw pi-clock",
            to: "/modifiers/presence-modifier",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Antiguedad",
            icon: "pi pi-fw pi-clock",
            to: "/modifiers/seniority-modifier",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Rol",
            icon: "pi pi-fw pi-clock",
            to: "/modifiers/role-modifier",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Valor Super YPF LSM",
            icon: "pi pi-fw pi-clock",
            to: "/modifiers/ypf-lsm",
            gest_role_id: [1, 2, 3],
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <div class="w-full pt-4 pb-2">
    <h5>Hola {{ authStore.profile?.username }}</h5>
  </div>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
