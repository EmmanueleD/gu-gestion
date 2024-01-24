<script setup>
import { useLayout } from "@/layout/composables/layout";
import { computed } from "vue";

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
  return `layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
  }.svg`;
});

function navigateTo(url) {
  window.open(url, "_blank");
}
</script>

<template>
  <div class="layout-footer">
    gü-gestión by
    <div
      @click="navigateTo('https://www.emmanueledurante.com')"
      class="flex align-items-center ml-2 w-4rem h-1rem"
    >
      <img
        src="/layout/images/emmd-logo.png"
        class="w-full h-auto"
        alt="PrimeVue"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
