<script setup>
import useGuCalculator from "@/composables/useGuCalculator";

const { getBaseUrl } = useGuCalculator();

console.log(getBaseUrl());
</script>

<template>
  <h1>Test</h1>
</template>
