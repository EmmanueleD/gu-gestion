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
        label: "Personal",
        icon: "pi pi-fw pi-users",

        gest_role_id: [1, 2, 3],
        items: [
          {
            label: "Empleados",
            icon: "pi pi-fw pi-user",
            to: "/employees",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Roles",
            icon: "pi pi-fw pi-user",
            to: "/roles",
            gest_role_id: [1, 2, 3],
          },
        ],
      },
      {
        label: "Modificadores de Horas",
        icon: "pi pi-fw pi-clock",
        gest_role_id: [1, 2, 3],
        items: [
          {
            label: "Hora base",
            icon: "pi pi-fw pi-clock",
            to: "modifiers/base-value",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Presentismo",
            icon: "pi pi-fw pi-clock",
            to: "/presentismo",
            gest_role_id: [1, 2, 3],
          },
          {
            label: "Antiguedad",
            icon: "pi pi-fw pi-clock",
            to: "/antiguedad",
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
