<script setup>
import { computed } from "vue";
import useGeneric from "@/composables/utils/useGeneric";
import { useRRHHStore } from "@/stores/useRRHHStore";

const { decimalToHoursMinutes, formatCurrency } = useGeneric();
const RRHH_STORE = useRRHHStore();
const presentismoAvailable = computed(() => {
  return RRHH_STORE.presentismoAvailable;
});
</script>
<template>
  <div class="w-full grid p-2">
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
        >Rol:
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
      <span
        >Plus Guelcom ({{
          ((RRHH_STORE.plusGu / RRHH_STORE.totalUno) * 100).toFixed(2)
        }}%)</span
      >
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

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg">TOTAL 2</span>
      <span class="text-blue-700 text-lg font-bold">{{
        formatCurrency(RRHH_STORE.totalDos)
      }}</span>
    </div>

    <div class="col-12 flex justify-content-between align-items-center">
      <span class="text-blue-700 text-lg font-bold">TOTAL 3 (TOT1 + TOT2)</span>
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
  </div>
</template>
