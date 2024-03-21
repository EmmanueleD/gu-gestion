<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="w-full flex flex-column md:py-8">
    <div class="w-full flex justify-content-center align-items-center">
      <img
        src="@/assets/img/comünidad-beneficios.jpeg"
        class="w-full h-full"
        style="max-width: 700px"
      />
    </div>
    <div class="w-full flex justify-content-center align-items-center mt-4">
      <Button
        label="Volver"
        icon="pi pi-arrow-left"
        @click="router.go(-1)"
      ></Button>
    </div>
  </div>
</template>
