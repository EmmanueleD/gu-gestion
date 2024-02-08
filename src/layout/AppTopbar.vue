<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useRouter } from "vue-router";
import useAuth from "@/composables/useAuth";
import useCustomToast from "@/composables/utils/useCustomToast";

const { guLogout, guAuthResponse } = useAuth();
const { showSuccess, showError } = useCustomToast();
const { layoutConfig, onMenuToggle } = useLayout();

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

const handleSignOut = async () => {
  loading.value = true;
  try {
    await guLogout();
    if (guAuthResponse.value.error) {
      showError(
        guAuthResponse.value.event,
        guAuthResponse.value.error.message || guAuthResponse.value.error
      );
    }
    showSuccess("Sesión cerrada");
    router.push({ name: "access" });
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
};

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
@/composables/utils/useCustomToast
