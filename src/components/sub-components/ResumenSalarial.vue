<script setup>
import { ref, onMounted } from "vue";

import useRRHH from "@/composables/utils/useRRHH";

import { useRRHHStore } from "@/stores/useRRHHStore";

const { calcResumenSalarial } = useRRHH();

const RRHH_STORE = useRRHHStore();

onMounted(() => {
  calcResumenSalarial(RRHH_STORE.fingerId);
});
</script>
<template>
  <div class="w-full">
    <pre>{{ RRHH_STORE }}</pre>
  </div>
</template>
