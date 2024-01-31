<script setup>
import { ref } from "vue";
import useSupabaseDB from "@/composables/useSupabaseDB";

const { dbResp, getLastOne } = useSupabaseDB();

const loading = ref(false);
const curretBaseValue = ref(0);

function getData() {
  loading.value = true;
  try {
    getLastOne({ table: "base" });
    if (dbResp.value) {
      curretBaseValue.value = dbResp.value;
      showSuccess("Carga exitosa");
    } else {
      curretBaseValue.value = 0;
      showError("No se encontraron archivos");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1>Valor Base</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6 grid">
    <div class="col-12 flex align-items-center justify-content-center">
      <div
        v-if="loading"
        class="flex align-items-center justify-content-center"
      >
        <i class="pi pi-spin pi-spinner mr-4" style="fontsize: 3rem"></i>
        <span>Cargando...</span>
      </div>
      <div v-else class="flex align-items-center justify-content-center">
        <Button
          @click="getData"
          label="Cargar"
          icon="pi pi-arrow-down"
          class="w-auto"
        />
        <span class="ml-2">Ultimo valor cargado: {{ lastOne }}</span>
      </div>
    </div>
  </div>
</template>
