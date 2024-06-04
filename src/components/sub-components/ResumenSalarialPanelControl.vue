<script setup>
import { ref, onMounted } from "vue";
import { useRRHHStore } from "@/stores/useRRHHStore";
import useRRHH from "@/composables/utils/useRRHH";
const RRHH_STORE = useRRHHStore();
const { handleTotalDos, handleTotalTres } = useRRHH();
const cuentaCorriente = ref(0);
const vacaciones = ref(0);
const sac = ref(0);

function handleChangeViatico() {
  RRHH_STORE.setViaticoAvailable(!RRHH_STORE.viaticoAvailable);
  if (RRHH_STORE.viaticoAvailable) {
    RRHH_STORE.setViatico(RRHH_STORE.lastViaticoValue * RRHH_STORE.totalUno);
  } else {
    RRHH_STORE.setViatico(0);
  }
  handleTotalDos();
  handleTotalTres();
}

function handleChangeCuentaCorriente() {
  RRHH_STORE.setCuentaCorriente(cuentaCorriente.value);
  RRHH_STORE.setDevolucionCC(
    (cuentaCorriente.value * RRHH_STORE.descuentoCC) / 100
  );
  handleTotalDos();
  handleTotalTres();
}

function handleChangeVacaciones() {
  RRHH_STORE.setVacaciones(vacaciones.value);
  handleTotalDos();
  handleTotalTres();
}

function handleChangeSac() {
  RRHH_STORE.setSac(sac.value);
  handleTotalDos();
  handleTotalTres();
}

onMounted(() => {
  if (RRHH_STORE.cuentaCorriente)
    cuentaCorriente.value = RRHH_STORE.cuentaCorriente;
});
</script>

<template>
  <div class="w-full grid p-2">
    <div class="col-12 flex justify-content-start align-items-center my-2">
      <Checkbox
        v-model="RRHH_STORE.viaticoAvailable"
        :binary="true"
        class="mr-2"
      ></Checkbox>
      <span @click="handleChangeViatico" class="cursor-pointer select-none"
        >Viatico</span
      >
    </div>

    <div class="col-12 flex flex-column my-2">
      <span class="font-bold">Cuenta Corriente</span>
      <div class="w-full flex justify-content-start align-items-center">
        <InputNumber
          v-model="cuentaCorriente"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
        />
        <Button
          @click="handleChangeCuentaCorriente"
          label="Confirmar"
          icon="pi pi-check"
          class="p-button-secondary ml-2"
        />
      </div>
    </div>

    <div class="col-12 flex flex-column my-2">
      <span class="font-bold">Vacaciones</span>
      <div class="w-full flex justify-content-start align-items-center">
        <InputNumber
          v-model="vacaciones"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
        />
        <Button
          @click="handleChangeVacaciones"
          label="Confirmar"
          icon="pi pi-check"
          class="p-button-secondary ml-2"
        />
      </div>
    </div>

    <div class="col-12 flex flex-column my-2">
      <span class="font-bold">SAC</span>
      <div class="w-full flex justify-content-start align-items-center">
        <InputNumber
          v-model="sac"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
        />
        <Button
          @click="handleChangeSac"
          label="Confirmar"
          icon="pi pi-check"
          class="p-button-secondary ml-2"
        />
      </div>
    </div>
  </div>
</template>
