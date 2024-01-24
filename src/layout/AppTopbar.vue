<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useRouter } from "vue-router";
import useSupabaseAuth from "@/composables/useSupabaseAuth";
import useCustomToast from "@/composables/useCustomToast";

import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();

const { showSuccess, showError } = useCustomToast();
const { layoutConfig, onMenuToggle } = useLayout();
const { logout } = useSupabaseAuth();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const loading = ref(false);

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
  topbarMenuActive.value = false;
  router.push("/documentation");
};
const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl?.isSameNode(event.target) ||
    sidebarEl?.contains(event.target) ||
    topbarEl?.isSameNode(event.target) ||
    topbarEl?.contains(event.target)
  );
};

async function handleSignOut() {
  loading.value = true;
  try {
    await logout();
    showSuccess("Sesión cerrada");
    router.push({ name: "access" });
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img src="@/assets/img/logo-dark.svg" alt="logo" class="border-circle" />
      <span>gestión</span>
    </router-link>

    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <Button
        @click="handleSignOut()"
        label="Cerrar Sesión"
        icon="pi pi-sign-out"
        class="ml-4"
      ></Button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
