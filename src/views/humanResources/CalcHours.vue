<script setup>
import { ref, onMounted } from "vue";

import useSupabaseStorage from "@/composables/useSupabaseStorage";
import useGuCalculator from "@/composables/gu-calculator/useGuCalculator";
import useCustomToast from "@/composables/utils/useCustomToast";
import useGeneric from "@/composables/utils/useGeneric";

import { useDateFormat } from "@vueuse/core";

import { useStorageStore } from "@/stores/useStorageStore";

function formattedDate(date) {
  return useDateFormat(date, "ddd DD/MM/YY HH:mm").value;
}

const { decimalToHoursMinutes } = useGeneric();
const { uploadExcel, getFileUrl } = useSupabaseStorage();
const { showSuccess, showError } = useCustomToast();
const { getDataFromFile } = useGuCalculator();
const storageStore = useStorageStore();

const loadingHandleUpload = ref(false);
const loadingCalcHours = ref(false);
const sidebarVisible = ref(false);
const sidebarData = ref({});

const currentUser = ref({
  modifiers: [
    {
      label: "Hora base",
      value: "1.020,00 (ARS)",
    },
    {
      label: "Rol",
      value: "10% (Barista)",
    },
    {
      label: "Antiguedad",
      value: "2% (1 año)",
    },
    {
      label: "Experiencia y titulos",
      value: "5%",
    },
    {
      label: "Viaticos",
      value: "5%",
    },
    {
      label: "Presentismo",
      value: "10%",
    },
  ],
});

const fileOptions = ref({
  name: "",
  bucket: "excel_hours",
  folder: "excel_hours",
});
const fileUrl = ref();
const fileData = ref();

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

function defaultFileName() {
  return `horas_${new Date().getMonth() + 1}_${new Date().getFullYear()}`;
}

async function handleCalcHours() {
  if (!fileUrl.value) return;
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
  let { data, newValue, field } = event;
  data[field] = newValue;
}

function handleDownload() {
  //TODO: download
}

onMounted(() => {
  fileOptions.value.name = defaultFileName();
});
</script>

<template>
  <h1>Importador Horas Excel</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <div class="w-full grid">
      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Nombre file</span>
        <InputText v-model="fileOptions.name" class="w-full" />
      </div>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>File</span>
        <div v-if="loadingHandleUpload" class="flex align-items-center h-full">
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
          :chooseLabel="loadingHandleUpload ? 'Cargando...' : 'Cargar archivo'"
          :disabled="loadingHandleUpload"
        />
      </div>
    </div>
    <div v-if="fileUrl" class="w-full grid my-4">
      <div class="col-12">
        <Button
          icon="pi pi-file-excel"
          :loading="loadingCalcHours"
          label="Elaborar horas"
          @click="handleCalcHours"
        ></Button>
      </div>
    </div>

    <div v-if="fileData" class="w-full grid">
      <div v-for="item in fileData" class="col-12 md:col-6 lg:col-3 py-3 px-3">
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
                  size="small"
                  icon="pi pi-download"
                ></Button>
                <Button
                  @click="
                    sidebarVisible = true;
                    sidebarData = item;
                  "
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

  <Sidebar
    @hide="
      sidebarVisible = false;
      sidebarData = {};
    "
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    :header="sidebarData.name"
  >
    <div class="w-full grid my-4 p-4">
      <h5>Resumen</h5>
      <div class="col-12 grid">
        <div class="col-12 md:col-6 flex align-items-center gap-1">
          <span>Horas totales: </span>
          <span class="font-bold"
            >{{ decimalToHoursMinutes(sidebarData.totalHours) }}
          </span>
        </div>
        <div
          v-for="item in currentUser.modifiers"
          class="col-12 md:col-6 flex align-items-center gap-1"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="
              item.label == 'Presentismo' &&
              sidebarData.data.some((x) => x.late)
            "
            class="font-bold"
          >
            0%
          </span>
          <span v-else class="font-bold">
            {{ item.value }}
          </span>
        </div>
      </div>
      <h5 class="col-12">Turnos</h5>
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
                    ? 'pi-check text-green-500'
                    : 'pi-times text-red-500'
                "
              ></i>
            </template>
            <template #editor="{ data }">
              <Checkbox v-model="data.late" :binary="true" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </Sidebar>
</template>
@/composables/gu-calculator/useGuCalculator@/composables/utils/useCustomToast
@/composables/utils/useGeneric @/composables/gu-calculator/useGuCalculator
