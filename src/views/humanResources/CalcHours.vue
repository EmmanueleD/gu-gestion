<script setup>
import { ref, onMounted, computed } from "vue";

import useSupabaseStorage from "@/composables/useSupabaseStorage";
import useGuCalculator from "@/composables/gu-calculator/useGuCalculator";
import useCustomToast from "@/composables/utils/useCustomToast";
import useGeneric from "@/composables/utils/useGeneric";
import useSupaApi from "@/composables/useSupaApi";
import useRRHH from "@/composables/utils/useRRHH";

import { useDateFormat } from "@vueuse/core";

import { useStorageStore } from "@/stores/useStorageStore";
import { useRRHHStore } from "@/stores/useRRHHStore";

import ResumenSalarial from "@/components/sub-components/ResumenSalarial.vue";
import ResumenSalarialPanelControl from "@/components/sub-components/ResumenSalarialPanelControl.vue";

const { savePaycheck, getProfileFromFingerId } = useSupaApi();

const { getAllFiles } = useSupabaseStorage();

const { calcResumenSalarial, handleTotales } = useRRHH();

function formattedDate(date) {
  return useDateFormat(date, "ddd DD/MM/YY HH:mm").value;
}

const { decimalToHoursMinutes, formatCurrency } = useGeneric();
const { uploadExcel, getFileUrl } = useSupabaseStorage();
const { showSuccess, showError } = useCustomToast();
const { getDataFromFile } = useGuCalculator();

const storageStore = useStorageStore();
const RRHH_STORE = useRRHHStore();

const loadingHandleUpload = ref(false);
const loadingDocsOptions = ref(false);
const loadingSidebar = ref(false);
const loadingCalcHours = ref(false);
const loadingSavePaycheck = ref(false);
const sidebarVisible = ref(false);
const sidebarData = ref({});

const docsOptions = ref([]);
const filtro = ref("");

const fileOptions = ref({
  name: "",
  bucket: "excel_hours",
  folder: "excel_hours",
});
const fileUrl = ref("");
const fileData = ref([]);

async function handleUpload(event) {
  loadingHandleUpload.value = true;
  fileUrl.value = null;
  fileData.value = null;
  let response;
  try {
    response = await uploadExcel(event, fileOptions.value);
    if (response?.error) {
      showError(response.error);
    } else {
      showSuccess("Carga exitosa");
    }
    storageStore.setCurrentFile(response);
  } catch (error) {
    showError(error);
  } finally {
    fileUrl.value = await handleGetFileUrl();
    loadingHandleUpload.value = false;
  }
}

async function handleGetFileUrl() {
  let result;
  try {
    result = await getFileUrl(fileOptions.value);
    if (result) {
      showSuccess("Descarga exitosa");
      return result;
    }
    showError("No se encontraron archivos");
    return null;
  } catch (error) {
    showError(error);
    return null;
  }
}

async function handleCalcHours() {
  if (!fileOptions.value.name) return;

  fileUrl.value = await handleGetFileUrl();

  let result;
  loadingCalcHours.value = true;
  try {
    result = await getDataFromFile(fileUrl.value);
    if (result) {
      showSuccess("Carga exitosa");
      fileData.value = result;
    } else {
      showError("No se encontraron archivos");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingCalcHours.value = false;
  }

  // fileData.value = fakedata.data;
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

function handleFeriadoChange(event) {
  if (event.feriado) {
    RRHH_STORE.handleVariationFeriatoTime(event.tot_hours);
  } else {
    RRHH_STORE.handleVariationFeriatoTime(-event.tot_hours);
  }
  RRHH_STORE.setFeriados(RRHH_STORE.feriadoTime * RRHH_STORE.lastBaseHourValue);
}

function handleDownload() {
  //TODO: download
}

async function showSidebar(data) {
  loadingSidebar.value = true;
  RRHH_STORE.setFingerId(data.fingerId);
  RRHH_STORE.setTotalHours(data.totalHours);
  RRHH_STORE.setNumberOfShifts(data.data.length);
  RRHH_STORE.setStaffName(data.name);
  RRHH_STORE.setPresentismoAvailable(true);
  RRHH_STORE.setLate(0);
  RRHH_STORE.setTurnos(data.data);
  let currentEmployee = await getProfileFromFingerId(data.fingerId);
  RRHH_STORE.setCurrentEmployee(currentEmployee);

  try {
    await calcResumenSalarial();
  } catch (error) {
    showError(error);
  } finally {
    sidebarVisible.value = true;
    sidebarData.value = data;
    loadingSidebar.value = false;
  }
}

function handleHideSidebar() {
  console.log("handleHideSidebar");
  sidebarVisible.value = false;
  sidebarData.value = { data: [] };

  for (let staff of fileData.value) {
    for (let turno of staff.data) {
      turno.late = false;
      turno.feriado = false;
    }
  }

  RRHH_STORE.clearAll();
}

async function getDocsOptions() {
  loadingDocsOptions.value = true;
  try {
    docsOptions.value = await getAllFiles();
  } catch (error) {
    showError(error);
  } finally {
    loadingDocsOptions.value = false;
  }
}

const filteredFileData = computed(() => {
  return fileData.value.filter((file) =>
    file.name.toLowerCase().includes(filtro.value.toLocaleLowerCase())
  );
});

onMounted(async () => {
  getDocsOptions();
});
</script>

<template>
  <h1>Importador Horas Excel</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <div class="w-full grid">
      <div class="col-12 md:col-6 lg:col-3 flex flex-column mr-4">
        <h4>Archivos existentes</h4>
        <div class="flex flex-column">
          <span>File existentes</span>
          <Dropdown
            filter
            show-clear
            :loading="loadingDocsOptions"
            :options="
              docsOptions.filter(
                (doc) => doc.name !== '.emptyFolderPlaceholder'
              )
            "
            optionLabel="name"
            optionValue="name"
            v-model="fileOptions.name"
          ></Dropdown>
        </div>
      </div>

      <Divider layout="vertical" />

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <h4>Cargar archivo</h4>

        <div class="flex flex-column">
          <span>Nombre file</span>

          <InputText :disabled="loadingCalcHours" v-model="fileOptions.name" />
          <div class="flex justify-content-end align-items-center mt-2">
            <div
              v-if="loadingHandleUpload"
              class="flex align-items-center h-full"
            >
              <i class="pi pi-spinner pi-spin mr-2"></i>
              <span>Cargando...</span>
            </div>
            <FileUpload
              v-else
              mode="basic"
              name="gu-employees-hours"
              :customUpload="true"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :maxFileSize="1000000"
              @uploader="handleUpload"
              :auto="true"
              :chooseLabel="
                loadingHandleUpload ? 'Cargando...' : 'Cargar archivo'
              "
              :disabled="loadingHandleUpload"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="fileOptions.name" class="w-full grid my-4">
      <div class="col-12">
        <Button
          icon="pi pi-file-excel"
          :loading="loadingCalcHours"
          label="Elaborar horas"
          @click="handleCalcHours"
        ></Button>
      </div>
    </div>
  </div>

  <div class="w-full my-4 grid surface-card py-6 px-3 sm:px-6 my-5">
    <div class="w-full grid my-4">
      <div class="col-12 flex justify-content-end align-items-center">
        <InputText v-model="filtro" placeholder="Buscar..."></InputText>
      </div>
    </div>

    <div v-if="fileData" class="w-full grid">
      <div
        v-for="item in filteredFileData"
        class="col-12 md:col-4 lg:col-3 py-3 px-3"
      >
        <Card class="w-full surface-100 border-1 border-round border-500">
          <template #title>
            {{ item.name }}
          </template>
          <template #content>
            <div class="w-full flex flex-column align-items-center gap-3">
              <div
                class="w-full flex justify-content-start align-items-center gap-1"
              >
                <span>Horas: </span>
                <span class="font-bold">{{
                  decimalToHoursMinutes(item.totalHours)
                }}</span>
              </div>
              <div
                class="w-full flex justify-content-between align-items-center gap-1 mt-4"
              >
                <Button
                  @click="handleDownload(item)"
                  disabled
                  size="small"
                  icon="pi pi-download"
                ></Button>
                <Button
                  @click="showSidebar(item)"
                  size="small"
                  label="Detalle"
                  icon="pi pi-pencil"
                ></Button>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>

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
  </Dialog>

  <Sidebar
    @hide="handleHideSidebar"
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    :header="'Resumen salarial - ' + sidebarData.name"
  >
    <TabView>
      <TabPanel header="Resumen salarial">
        <ResumenSalarial />
      </TabPanel>

      <TabPanel header="Panel de control">
        <ResumenSalarialPanelControl />
      </TabPanel>

      <TabPanel header="Turnos">
        <div class="col-12">
          <DataTable
            :value="sidebarData.data"
            class="p-datatable-sm"
            showGridlines
            responsiveLayout="scroll"
            stripedRows
            editMode="cell"
            @cell-edit-complete="handleCellEdit"
          >
            <Column field="shift_start" header="Inicio">
              <template #body="{ data }">
                {{ formattedDate(data.shift_start) }}
              </template>
            </Column>
            <Column field="shift_end" header="Fin">
              <template #body="{ data }">
                {{ formattedDate(data.shift_end) }}
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
</template>
