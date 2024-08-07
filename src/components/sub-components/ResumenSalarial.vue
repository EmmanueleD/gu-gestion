<script setup>
import { ref, computed, onMounted } from "vue";
import useGeneric from "@/composables/utils/useGeneric";
import useSupaApi from "@/composables/useSupaApi";
import useCustomToast from "@/composables/utils/useCustomToast";
import usePrintReciboSueldo from "@/composables/jsPDF/usePrintReciboSueldo";
import { useRRHHStore } from "@/stores/useRRHHStore";
import { useDateFormat } from "@vueuse/core";

const { savePaycheck } = useSupaApi();
const { showError } = useCustomToast();
const { print } = usePrintReciboSueldo();
const { decimalToHoursMinutes, formatCurrency } = useGeneric();
const RRHH_STORE = useRRHHStore();
const presentismoAvailable = computed(() => {
  return RRHH_STORE.presentismoAvailable;
});

const loading = ref(false);
const loadingSaveRecibo = ref(false);
const loadingDownloadRecibo = ref(false);

function handleDownloadRecibo() {
  loadingDownloadRecibo.value = true;
  try {
    print();
  } catch (error) {
    showError("Error al generar recibo");
    console.log("Error al generar recibo", error);
  } finally {
    loadingDownloadRecibo.value = false;
  }
}

async function handleSaveRecibo() {
  loadingSaveRecibo.value = true;
  try {
    await savePaycheck();
  } catch (error) {
    showError("Error al generar recibo");
    console.log("Error al generar recibo", error);
  } finally {
    loadingSaveRecibo.value = false;
  }
}
</script>

<template>
  <div
    v-if="loading"
    class="w-full flex justify-content-center align-items-center"
  >
    <i class="pi pi-spin pi-spinner mr-2" v-if="loading"></i>
    <span>Cargando...</span>
  </div>
  <div v-else class="w-full grid p-2">
    <div class="col-12 flex justify-content-between align-items-center">
      <span>Hora Base:</span>
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.lastBaseHourValue)
      }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span>Hora Real:</span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.horaReal) }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span>Tot horas:</span>
      <span class="font-bold"
        >{{ decimalToHoursMinutes(RRHH_STORE.totalHours) }} hs</span
      >
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg">TOTAL 1</span>
      <span class="text-blue-700 text-lg font-bold">{{
        formatCurrency(RRHH_STORE.totalUno)
      }}</span>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span>Devolución CC ({{ RRHH_STORE.descuentoCC }}%)</span>
      <span class="font-bold">
        {{ formatCurrency(RRHH_STORE.devolucionCC) }}
      </span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span
        >Area:
        {{
          RRHH_STORE.MAP_STAFF_ROLE_OPTIONS[
            RRHH_STORE.currentEmployee.main_role_id
          ].label
        }}

        ({{
          ((RRHH_STORE.rolPrincipalValue / RRHH_STORE.totalUno) * 100).toFixed(
            2
          )
        }}%)</span
      >
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.rolPrincipalValue)
      }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span>Experiencia ({{ RRHH_STORE.staffExp }}%)</span>
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.staffExpValue)
      }}</span>
    </div>

    <div
      v-if="RRHH_STORE.viaticoAvailable"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span
        >Viatico ({{
          ((RRHH_STORE.viatico / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.viatico) }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span>
        Presentismo ({{
          ((RRHH_STORE.presentismo / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
      <span v-if="presentismoAvailable" class="font-bold">{{
        formatCurrency(RRHH_STORE.presentismo)
      }}</span>
      <span v-if="!presentismoAvailable" class="font-bold">-</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span
        >Antiguedad ({{
          ((RRHH_STORE.antiguedadValue / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.antiguedadValue)
      }}</span>
    </div>

    <div
      v-if="RRHH_STORE.ayudaTransporte"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span
        >Ayuda Transporte ({{
          ((RRHH_STORE.ayudaTransporte / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)
      </span>
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.ayudaTransporte)
      }}</span>
    </div>

    <div
      v-if="RRHH_STORE.respCierre"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span
        >Responsable cierre ({{
          ((RRHH_STORE.respCierre / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.respCierre) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.refuerzo"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span
        >Refuerzo ({{
          ((RRHH_STORE.refuerzo / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.refuerzo) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.plusGu"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Plus Guelcom </span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.plusGu) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.feriados"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Feriados </span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.feriados) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.vacaciones"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Vacaciones</span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.vacaciones) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.sac"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>SAC</span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.sac) }}</span>
    </div>

    <div
      v-for="row in RRHH_STORE.customRowsTot2"
      :key="row"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>{{ row.label }}</span>
      <span class="font-bold">{{ formatCurrency(row.value) }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg">TOTAL 2</span>
      <span class="text-blue-700 text-lg font-bold">{{
        formatCurrency(RRHH_STORE.totalDos)
      }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg font-bold">TOT1 + TOT2</span>
      <span class="text-blue-700 text-lg font-bold">{{
        formatCurrency(RRHH_STORE.totalTres)
      }}</span>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span>Cuenta Corriente</span>
      <span class="font-bold">{{
        formatCurrency(RRHH_STORE.cuentaCorriente)
      }}</span>
    </div>

    <div
      v-if="RRHH_STORE.recibo"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Recibo</span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.recibo) }}</span>
    </div>

    <div
      v-if="RRHH_STORE.reciboSac"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Recibo SAC</span>
      <span class="font-bold">{{ formatCurrency(RRHH_STORE.reciboSac) }}</span>
    </div>

    <div
      v-for="row in RRHH_STORE.anticiposRows"
      :key="row"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>Adelanto: {{ useDateFormat(row.date, "DD-MM-YYYY").value }}</span>
      <span class="font-bold">{{ formatCurrency(row.value) }}</span>
    </div>

    <div
      v-for="row in RRHH_STORE.customRowsTot3"
      :key="row"
      class="col-12 flex justify-content-between align-items-center"
    >
      <span>{{ row.label }}</span>
      <span class="font-bold">{{ formatCurrency(row.value) }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg font-bold">TOTAL ANTICIPOS</span>
      <span class="text-blue-700 text-lg font-bold">{{
        formatCurrency(RRHH_STORE.totalAnticipos)
      }}</span>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-2xl font-bold"
        >TOTAL NETO (TOT3 - TOT ANTICIPOS)</span
      >
      <span class="text-blue-700 text-2xl font-bold">{{
        formatCurrency(RRHH_STORE.totalNeto)
      }}</span>
    </div>

    <Divider class="col-12" />

    <div class="col-12 flex justify-content-end align-items-center">
      <Button
        label="Descargar"
        icon="pi pi-download"
        class="p-button-outlined mr-2"
        @click="handleDownloadRecibo"
        :loading="loadingDownloadRecibo"
      />
      <Button
        label="Guardar"
        icon="pi pi-save"
        @click="handleSaveRecibo"
        :loading="loadingSaveRecibo"
      />
    </div>
  </div>
</template>
