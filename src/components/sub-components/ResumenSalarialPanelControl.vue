<script setup>
import { ref } from "vue";
import { useRRHHStore } from "@/stores/useRRHHStore";
import useRRHH from "@/composables/utils/useRRHH";
const RRHH_STORE = useRRHHStore();
const { handleTotales } = useRRHH();
const cuentaCorriente = ref(0);
const vacaciones = ref(0);
const sac = ref(0);
const recibo = ref(0);
const reciboSac = ref(0);

function handleConfirm() {
  RRHH_STORE.setCuentaCorriente(cuentaCorriente.value);
  RRHH_STORE.setDevolucionCC(
    (cuentaCorriente.value * RRHH_STORE.descuentoCC) / 100
  );
  RRHH_STORE.setVacaciones(vacaciones.value);
  RRHH_STORE.setSac(sac.value);
  RRHH_STORE.setRecibo(recibo.value);
  RRHH_STORE.setReciboSac(reciboSac.value);

  handleTotales();
}

function handleChangeViatico() {
  RRHH_STORE.setViaticoAvailable(!RRHH_STORE.viaticoAvailable);
  if (RRHH_STORE.viaticoAvailable) {
    RRHH_STORE.setViatico(RRHH_STORE.lastViaticoValue * RRHH_STORE.totalUno);
  } else {
    RRHH_STORE.setViatico(0);
  }

  handleTotales();
}
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
      </div>
    </div>

    <div class="col-12 flex flex-column my-2">
      <span class="font-bold">Recibo</span>
      <div class="w-full flex justify-content-start align-items-center">
        <InputNumber
          v-model="recibo"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
        />
      </div>
    </div>

    <div class="col-12 flex flex-column my-2">
      <span class="font-bold">Recibo SAC</span>
      <div class="w-full flex justify-content-start align-items-center">
        <InputNumber
          v-model="reciboSac"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
        />
      </div>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="col-12 font-bold">Anticipos</span>
      <Button icon="pi pi-plus" class="p-button-secondary" />
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-end align-items-center">
      <Button
        label="Confirmar"
        class="p-button-secondary"
        icon="pi pi-check"
        @click="handleConfirm"
      />
    </div>
  </div>
</template>
