<script setup>
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";

import { useConfirm } from "primevue/useconfirm";

import useSupabaseClient from "@/composables/useSupabaseClient";
import useGeneric from "@/composables/utils/useGeneric";
import useSupaApi from "@/composables/useSupaApi";

import { useRRHHStore } from "@/stores/useRRHHStore";

import ResumenSalarial from "@/components/sub-components/ResumenSalarial.vue";
import ResumenSalarialPanelControl from "@/components/sub-components/ResumenSalarialPanelControl.vue";

const RRHH_STORE = useRRHHStore();

const { formatCurrency, decimalToHoursMinutes } = useGeneric();
const { getProfileFromFingerId } = useSupaApi();
const { sbDB } = useSupabaseClient();

const confirm = useConfirm();

const dt = ref();

const loadingPaycheckList = ref(false);
const paycheckList = ref([]);

const loadingSidebar = ref(false);
const sidebarVisible = ref(false);
const sidebarData = ref({});

function handleHideSidebar() {
  sidebarVisible.value = false;
  sidebarData.value = { data: [] };
  RRHH_STORE.clearAll();
}

const exportCSV = () => {
  dt.value.exportCSV();
};

function handleDownloadRecibo() {
  //TODO: Implementar para descarga del recibo
  main();
}

function handleCellEdit(event) {
  const MAX_TARDANZAS = 3;
  const { data, newValue, field } = event;
  data[field] = newValue;

  if (field === "late") {
    RRHH_STORE.handleVariationLate(newValue === true ? 1 : -1);
  }

  if (RRHH_STORE.late >= MAX_TARDANZAS) {
    RRHH_STORE.setPresentismoAvailable(false);
    RRHH_STORE.setPresentismo(0);
  } else {
    RRHH_STORE.setPresentismoAvailable(true);
    RRHH_STORE.setPresentismo(
      RRHH_STORE.lastPresentismoValue * RRHH_STORE.totalUno
    );
  }

  RRHH_STORE.setTurnos(sidebarData.value.data);

  handleTotales();
}

async function handleDeletePaycheck(event) {
  confirm.require({
    message: "¿Desea eliminar este recibo de nómina?",
    header: "Confirmar eliminación",
    icon: "pi pi-info-circle",
    acceptLabel: "Si",
    rejectLabel: "No",
    acceptClassName: "p-button-danger",
    acceptIcon: "pi pi-trash",
    rejectIcon: "pi pi-times",
    rejectClassName: "p-button-secondary",
    accept: () => {
      deletePaycheck(event);
    },
    reject: () => {},
  });
}

async function deletePaycheck(event) {
  try {
    await sbDB("paycheck").delete().eq("paycheck_id", event.paycheck_id);
  } catch (error) {
    showError(error);
  } finally {
    await getData();
  }
}

async function getData() {
  loadingPaycheckList.value = true;

  let result;

  try {
    result = await sbDB("paycheck").select("*");
  } catch (error) {
    console.log(error);
  } finally {
    paycheckList.value = result.data;
    loadingPaycheckList.value = false;
  }
}

async function showSidebar(data) {
  sidebarData.value = data;
  loadingSidebar.value = true;

  let currentUser = await getProfileFromFingerId(data.fingerId);

  // calcResumenSalarial();
  RRHH_STORE.setIdPaycheck(data.paycheck_id);
  RRHH_STORE.setCurrentEmployee(currentUser);
  RRHH_STORE.setLastBaseHourValue(data.lastBaseHourValue);
  RRHH_STORE.setLastViaticoValue(data.lastViaticoValue);
  RRHH_STORE.setLastPresentismoValue(data.lastPresentismoValue);
  RRHH_STORE.setFingerId(data.fingerId);
  RRHH_STORE.setTotalHours(data.totalHours);
  RRHH_STORE.setStaffName(data.staffName);
  RRHH_STORE.setTotalUno(data.totalUno);
  RRHH_STORE.setPresentismoAvailable(data.presentismoAvailable);
  RRHH_STORE.setPresentismo(data.presentismo);
  RRHH_STORE.setViatico(data.viatico);
  RRHH_STORE.setRolPrincipalPerc(data.rolPrincipalPerc);
  RRHH_STORE.setRolPrincipalValue(data.rolPrincipalValue);
  RRHH_STORE.setStaffExp(data.staffExp);
  RRHH_STORE.setAntiguedad(data.antiguedad);
  RRHH_STORE.setAntiguedadValue(data.antiguedadValue);
  RRHH_STORE.setLastSuperYpf(data.lastSuperYpf);
  RRHH_STORE.setAyudaTransporte(data.ayudaTransporte);
  RRHH_STORE.setPlusGu(data.plusGu);
  RRHH_STORE.setRefuerzo(data.refuerzo);
  RRHH_STORE.setRespCierre(data.respCierre);
  RRHH_STORE.setHoraReal(data.horaReal);
  RRHH_STORE.setTotalDos(data.totalDos);
  RRHH_STORE.setStaffExpValue(data.staffExpValue);
  RRHH_STORE.setLate(data.late);
  RRHH_STORE.setViaticoAvailable(data.viaticoAvailable);
  RRHH_STORE.setFeriadosAvailable(data.feriadosAvailable);
  RRHH_STORE.setFeriadoTime(data.feriadoTime);
  RRHH_STORE.setFeriados(data.feriados);
  RRHH_STORE.setNumberOfDaysInShifts(data.numberOfDaysInShifts);
  RRHH_STORE.setCuentaCorriente(data.cuentaCorriente);
  RRHH_STORE.setDevolucionCC(data.devolucionCC);
  RRHH_STORE.setDescuentoCC(data.descuentoCC);
  RRHH_STORE.setVacaciones(data.vacaciones);
  RRHH_STORE.setSac(data.sac);
  RRHH_STORE.setTotalTres(data.totalTres);
  RRHH_STORE.setRecibo(data.recibo);
  RRHH_STORE.setReciboSac(data.reciboSac);
  RRHH_STORE.setTotalAnticipos(data.totalAnticipos);
  RRHH_STORE.setTotalNeto(data.totalNeto);
  RRHH_STORE.setCustomRowsTot2(data.customRowsTot2);
  RRHH_STORE.setAnticiposRows(data.anticiposRows);
  RRHH_STORE.setCustomRowsTot3(data.customRowsTot3);
  RRHH_STORE.setTurnos(data.turnos);
  RRHH_STORE.setFechaSalario(data.startDate);

  sidebarVisible.value = true;
  loadingSidebar.value = false;
}
function handleFeriadoChange(event) {
  if (event.feriado) {
    RRHH_STORE.handleVariationFeriatoTime(event.tot_hours);
  } else {
    RRHH_STORE.handleVariationFeriatoTime(-event.tot_hours);
  }
  RRHH_STORE.setFeriados(RRHH_STORE.feriadoTime * RRHH_STORE.lastBaseHourValue);
}
onMounted(async () => {
  await getData();
});
</script>

<template>
  <h1>Sueldos</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6 my-4">
    <DataTable
      :value="paycheckList"
      :loading="loadingPaycheckList"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
      ref="dt"
    >
      <template #header>
        <div style="text-align: left">
          <Button
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV($event)"
          />
        </div>
      </template>
      <Column field="actions" header="Acciones">
        <template #body="{ data }">
          <Button
            class="p-button-outlined mr-2"
            icon="pi pi-eye"
            @click="showSidebar(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-outlined ml-2"
            @click="handleDeletePaycheck(data)"
          />
        </template>
      </Column>
      <Column field="startDate" header="Fecha primer dia" sortable>
        <template #body="{ data }">
          {{ useDateFormat(data.startDate, "DD/MM/YYYY").value }}
        </template>
      </Column>
      <Column field="endDate" header="Fecha ultimo dia" sortable>
        <template #body="{ data }">
          {{ useDateFormat(data.endDate, "DD/MM/YYYY").value }}
        </template>
      </Column>
      <Column field="staffName" header="Nombre" sortable></Column>

      <Column field="totalNeto" header="Neto">
        <template #body="{ data }">
          {{ formatCurrency(data.totalNeto) }}
        </template>
      </Column>
    </DataTable>
  </div>

  <Sidebar
    @hide="handleHideSidebar"
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    :header="'Resumen salarial - ' + RRHH_STORE.currentEmployee?.username || ''"
  >
    <div
      v-if="loadingSidebar"
      class="flex align-items-center justify-content-center w-full h-full p-3"
    >
      <i class="pi pi-spin pi-spinner text-3xl"></i>
      <span class="ml-3 font-bold text-xl">Cargando...</span>
    </div>
    <TabView v-else>
      <TabPanel header="Resumen salarial">
        <ResumenSalarial />
      </TabPanel>

      <TabPanel header="Panel de control">
        <ResumenSalarialPanelControl />
      </TabPanel>

      <TabPanel header="Turnos">
        <div class="col-12">
          <DataTable
            :value="RRHH_STORE.turnos"
            class="p-datatable-sm"
            showGridlines
            responsiveLayout="scroll"
            stripedRows
            editMode="cell"
            @cell-edit-complete="handleCellEdit"
          >
            <Column field="shift_start" header="Inicio">
              <template #body="{ data }">
                {{ useDateFormat(data.shift_start, "DD/MM/YYYY HH:mm").value }}
              </template>
            </Column>
            <Column field="shift_end" header="Fin">
              <template #body="{ data }">
                {{ useDateFormat(data.shift_end, "DD/MM/YYYY HH:mm").value }}
              </template>
            </Column>
            <Column field="base_hours" header="Horas">
              <template #body="{ data }">
                {{ decimalToHoursMinutes(data.base_hours) }}
              </template>
            </Column>
            <Column field="late" header="Tardanza">
              <template #body="{ data }">
                <i
                  class="pi"
                  :class="
                    data.late
                      ? 'pi-check-circle text-red-500'
                      : 'pi-times text-gray-300'
                  "
                ></i>
              </template>
              <template #editor="{ data }">
                <Checkbox v-model="data.late" :binary="true" />
              </template>
            </Column>
            <Column
              v-if="RRHH_STORE.currentEmployee.feriados"
              field="feriado"
              header="Feriado"
            >
              <template #body="{ data }">
                <i
                  class="pi"
                  :class="
                    data.feriado
                      ? 'pi-check-circle text-green-500'
                      : 'pi-times text-gray-300'
                  "
                ></i>
              </template>
              <template #editor="{ data, index }">
                <Checkbox
                  @change="handleFeriadoChange({ ...data, index })"
                  v-model="data.feriado"
                  :binary="true"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </TabView>
  </Sidebar>

  <Dialog
    v-model:visible="loadingSidebar"
    :style="{ width: '250px', height: '100px' }"
    :modal="true"
  >
    <template #container>
      <div
        class="flex align-items-center justify-content-center w-full h-full p-3"
      >
        <i class="pi pi-spin pi-spinner text-3xl"></i>
        <span class="ml-3 font-bold text-xl">Cargando...</span>
      </div>
    </template>
    ></Dialog
  >
</template>
