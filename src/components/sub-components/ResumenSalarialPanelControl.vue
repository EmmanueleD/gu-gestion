<script setup>
import { ref, onMounted } from "vue";
import { useRRHHStore } from "@/stores/useRRHHStore";
import useRRHH from "@/composables/utils/useRRHH";
const RRHH_STORE = useRRHHStore();
const { handleTotales } = useRRHH();

const cuentaCorriente = ref(0);
const vacaciones = ref(0);
const sac = ref(0);
const recibo = ref(0);
const reciboSac = ref(0);

const anticiposRows = ref([]);
const customRowsTot2 = ref([]);
const customRowsTot3 = ref([]);

const loadingPlacebo = ref(false);

function handleConfirm() {
  loadingPlacebo.value = true;

  setTimeout(() => {
    RRHH_STORE.setCuentaCorriente(cuentaCorriente.value);
    RRHH_STORE.setDevolucionCC(
      (cuentaCorriente.value * RRHH_STORE.descuentoCC) / 100
    );
    RRHH_STORE.setVacaciones(vacaciones.value);
    RRHH_STORE.setSac(sac.value);
    RRHH_STORE.setRecibo(recibo.value);
    RRHH_STORE.setReciboSac(reciboSac.value);

    RRHH_STORE.setCustomRowsTot2(customRowsTot2.value);
    RRHH_STORE.setAnticiposRows(anticiposRows.value);
    RRHH_STORE.setCustomRowsTot3(customRowsTot3.value);

    handleTotales();

    loadingPlacebo.value = false;
  }, Math.random() * 400 + 200);
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

function addCustomRowTot2() {
  customRowsTot2.value.push({
    label: "",
    value: 0,
  });
}

function addAnticiposRow() {
  anticiposRows.value.push({
    date: new Date(),
    value: 0,
  });
}

function addCustomRowTot3() {
  customRowsTot3.value.push({
    label: "",
    value: 0,
  });
}

onMounted(() => {
  if (RRHH_STORE.cuentaCorriente)
    cuentaCorriente.value = RRHH_STORE.cuentaCorriente;
  if (RRHH_STORE.vacaciones) vacaciones.value = RRHH_STORE.vacaciones;
  if (RRHH_STORE.sac) sac.value = RRHH_STORE.sac;
  if (RRHH_STORE.recibo) recibo.value = RRHH_STORE.recibo;
  if (RRHH_STORE.reciboSac) reciboSac.value = RRHH_STORE.reciboSac;

  if (RRHH_STORE.anticiposRows) anticiposRows.value = RRHH_STORE.anticiposRows;
  if (RRHH_STORE.customRowsTot2)
    customRowsTot2.value = RRHH_STORE.customRowsTot2;
  if (RRHH_STORE.customRowsTot3)
    customRowsTot3.value = RRHH_STORE.customRowsTot3;
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
      <span class="font-bold">Lineas libres TOT2</span>
      <Button
        @click="addCustomRowTot2"
        icon="pi pi-plus"
        class="p-button-secondary"
      />
    </div>

    <div class="col-12 grid" v-for="row in customRowsTot2" :key="row">
      <div class="col-12 md:col-5 flex flex-column">
        <span>Descripción</span>
        <InputText v-model="row.label" />
      </div>
      <div class="col-12 md:col-5 flex flex-column">
        <span>Valor</span>
        <InputNumber
          v-model="row.value"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          mode="currency"
          currency="ARS"
          locale="es-AR"
        />
      </div>
      <div class="col-12 md:col-2 flex justify-content-start align-items-end">
        <Button
          @click="customRowsTot2.splice(customRowsTot2.indexOf(row), 1)"
          icon="pi pi-times-circle"
          text
          class="p-button-secondary"
        />
      </div>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="font-bold">Anticipos</span>
      <Button
        @click="addAnticiposRow"
        icon="pi pi-plus"
        class="p-button-secondary"
      />
    </div>

    <div class="col-12 grid" v-for="row in anticiposRows" :key="row.date">
      <div class="col-12 md:col-5 flex flex-column">
        <span>Fecha</span>
        <Calendar v-model="row.date" />
      </div>
      <div class="col-12 md:col-5 flex flex-column">
        <span>Valor</span>
        <InputNumber
          v-model="row.value"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          mode="currency"
          currency="ARS"
          locale="es-AR"
        />
      </div>
      <div class="col-12 md:col-2 flex justify-content-start align-items-end">
        <Button
          @click="anticiposRows.splice(anticiposRows.indexOf(row), 1)"
          icon="pi pi-times-circle"
          text
          class="p-button-secondary"
        />
      </div>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="font-bold">Lineas libres TOT3</span>
      <Button
        @click="addCustomRowTot3"
        icon="pi pi-plus"
        class="p-button-secondary"
      />
    </div>

    <div class="col-12 grid" v-for="row in customRowsTot3" :key="row">
      <div class="col-12 md:col-5 flex flex-column">
        <span>Descripción</span>
        <InputText v-model="row.label" />
      </div>
      <div class="col-12 md:col-5 flex flex-column">
        <span>Valor</span>
        <InputNumber
          v-model="row.value"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          mode="currency"
          currency="ARS"
          locale="es-AR"
        />
      </div>
      <div class="col-12 md:col-2 flex justify-content-start align-items-end">
        <Button
          @click="customRowsTot3.splice(customRowsTot3.indexOf(row), 1)"
          icon="pi pi-times-circle"
          text
          class="p-button-secondary"
        />
      </div>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-end align-items-center my-2">
      <Button
        label="Confirmar"
        icon="pi pi-check"
        :loading="loadingPlacebo"
        @click="handleConfirm"
      />
    </div>
  </div>
</template>
