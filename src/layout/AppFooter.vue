<script setup>
import { useLayout } from "@/layout/composables/layout";
import { computed } from "vue";

const { layoutConfig } = useLayout();

function navigateTo(url) {
  window.open(url, "_blank");
}
</script>

<template>
  <div class="layout-footer mt-8">
    <span class="text-900 font-medium">gü-gestión by</span>
    <div
      @click="navigateTo('https://www.emmanueledurante.com')"
      class="flex align-items-center ml-2 w-4rem h-1rem cursor-pointer"
    >
      <img
        src="@/assets/img/emmd-logo.png"
        class="w-full h-auto"
        alt="PrimeVue"
      />
    </div>
  </div>
  <span class="mt-1 text-400 text-xs text-center">Copyright © 2024</span>
</template>
<style lang="scss" scoped></style>
