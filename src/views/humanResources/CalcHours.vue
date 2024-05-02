<script setup>
import { ref, onMounted, computed, watch } from "vue";

import useSupabaseStorage from "@/composables/useSupabaseStorage";
import useGuCalculator from "@/composables/gu-calculator/useGuCalculator";
import useCustomToast from "@/composables/utils/useCustomToast";
import useGeneric from "@/composables/utils/useGeneric";
import useDatetime from "@/composables/utils/useDateTime";
import useSupaApi from "@/composables/useSupaApi";

import { useDateFormat } from "@vueuse/core";

import { useStorageStore } from "@/stores/useStorageStore";

import BaseInput from "@/components/base/BaseInput.vue";

const {
  getStaffRoles,
  getStaffMainRole,
  getLastStaffStatus,
  getStaffExpTitulos,
  getStaffExpExterna,
  getStaffExpGuelcom,
  getStaffDistance,
  getProfileIdFromFingerId,
  getStaffDescuentoCC,
  getLastSuperYpf,
  getLastPresentismoValue,
  getLastViaticoValue,
  getLastBaseHourValue,
  getStaffStatusHistory,
  getLastAntiguedad,
  savePaycheck,
} = useSupaApi();

const { getAllFiles } = useSupabaseStorage();

function formattedDate(date) {
  return useDateFormat(date, "ddd DD/MM/YY HH:mm").value;
}

function simpleFormattedDate(date) {
  return useDateFormat(date, "DD-MM-YY").value;
}

const { extractActivePeriods, calculateTotalTime } = useDatetime();

const { decimalToHoursMinutes, formatCurrency } = useGeneric();
const { uploadExcel, getFileUrl } = useSupabaseStorage();
const { showSuccess, showError } = useCustomToast();
const { getDataFromFile } = useGuCalculator();
const storageStore = useStorageStore();

const loadingHandleUpload = ref(false);
const loadingDocsOptions = ref(false);
const loadingSidebar = ref(false);
const loadingCalcHours = ref(false);
const loadingSavePaycheck = ref(false);
const sidebarVisible = ref(false);
const sidebarData = ref({});

const docsOptions = ref([]);
const filtro = ref("");

const baseHour = ref(0);

const presentismo = ref(0);
const presentismoGranted = ref(true);
const viatico = ref(0);
const viaticoGranted = ref(true);

const staffId = ref("");

const roleSelected = ref([]);
const statusSelected = ref();
const expTitulos = ref({});
const expExterna = ref({});
const expGuelcom = ref({});
const distancia = ref();
const descuentoCC = ref();
const mainRole = ref({});
const lastSuperYpf = ref();
const activePeriods = ref([]);
const totActiveTime = ref(0);
const antiguedad = ref(0);
const feriados = ref(0);
const vacaciones = ref(0);
const sac = ref(0);
const reciboSac = ref(0);
const reciboEstudioContable = ref(0);
const cuentaCC = ref(0);
const anticipos = ref([]);
const refuerzoPerc = ref(0);
const refuerzo = computed(() => {
  return (TOT1.value * refuerzoPerc.value) / 100;
});
const plusGuelcomPerc = ref(0);
const plusGuelcom = ref(0);
const plusCierrePerc = ref(0);
const plusCierre = ref(0);

const TOT1 = computed(() => {
  if (sidebarData.value.totalHours && baseHour.value) {
    return sidebarData.value.totalHours * baseHour.value;
  } else {
    return 0;
  }
});

const PRESENTISMO = computed(() => {
  if (TOT1.value && presentismoGranted.value) {
    return TOT1.value * presentismo.value;
  } else {
    return 0;
  }
});

const VIATICO = computed(() => {
  if (TOT1.value && viaticoGranted.value) {
    return TOT1.value * viatico.value;
  } else {
    return 0;
  }
});

const MAIN_ROLE_MODIFIER = computed(() => {
  if (TOT1.value && mainRole.value) {
    return TOT1.value * mainRole.value.last_modifier_value;
  } else {
    return 0;
  }
});

const EXPERIENCE = computed(() => {
  if (
    TOT1.value &&
    expExterna.value &&
    expGuelcom.value &&
    expTitulos.value &&
    roleSelected.value
  ) {
    return (
      TOT1.value *
      ((expExterna.value.value ||
        0 + expTitulos.value.value ||
        0 + expGuelcom.value.value ||
        0 + roleSelected.value.length * 2) /
        100)
    );
  } else {
    return 0;
  }
});

const AYUDA_TRANSPORTE = computed(() => {
  if (TOT1.value && distancia.value && lastSuperYpf.value) {
    return (
      (distancia.value / 10) *
      lastSuperYpf.value *
      sidebarData.value.data.length
    );
  } else {
    return 0;
  }
});

const TOT2 = computed(() => {
  return (
    (PRESENTISMO.value || 0) +
    (VIATICO.value || 0) +
    (MAIN_ROLE_MODIFIER.value || 0) +
    (EXPERIENCE.value || 0) +
    (AYUDA_TRANSPORTE.value || 0) +
    (totActiveTime.value.toFixed(0) || 0) *
      (antiguedad.value || 0) *
      (TOT1.value || 0) +
    (feriados.value || 0) +
    (vacaciones.value || 0) +
    (sac.value || 0) +
    (plusCierre.value || 0) +
    (refuerzo.value || 0) +
    (plusGuelcom.value || 0)
  );
});

const TOT3 = computed(() => {
  if (TOT2.value && TOT1.value) {
    return TOT2.value + TOT1.value;
  } else {
    return 0;
  }
});

const TOT_ANTICIPOS = computed(() => {
  const totalAnticipos = anticipos.value.reduce((a, b) => a + b.value, 0);

  return (
    cuentaCC.value -
    (cuentaCC.value * descuentoCC.value) / 100 +
    reciboEstudioContable.value +
    reciboSac.value +
    Number(totalAnticipos)
  );
});

const fileOptions = ref({
  name: "",
  bucket: "excel_hours",
  folder: "excel_hours",
});
const fileUrl = ref("");
const fileData = ref([]);

function addAnticipo() {
  anticipos.value.push({
    date: new Date(),
    value: 0,
  });
}

function removeAnticipo(index) {
  anticipos.value.splice(index, 1);
}

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
  console.log("handleCalcHours FILE DATA", fileData.value);
  console.log("handleCalcHours FILE OPTIONS", fileOptions.value);

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
  let { data, newValue, field } = event;
  data[field] = newValue;
}

function handleDownload() {
  //TODO: download
}

async function showSidebar(data) {
  loadingSidebar.value = true;
  sidebarVisible.value = true;
  sidebarData.value = data;
  try {
    staffId.value = await getProfileIdFromFingerId(data.fingerId);

    mainRole.value = await getStaffMainRole(staffId.value);
    expTitulos.value = await getStaffExpTitulos(staffId.value);
    expExterna.value = await getStaffExpExterna(staffId.value);
    expGuelcom.value = await getStaffExpGuelcom(staffId.value);
    roleSelected.value = await getStaffRoles(staffId.value);
    statusSelected.value = await getLastStaffStatus(staffId.value);
    distancia.value = await getStaffDistance(staffId.value);
    descuentoCC.value = await getStaffDescuentoCC(staffId.value);
    lastSuperYpf.value = await getLastSuperYpf();
    let statusHistory = await getStaffStatusHistory(staffId.value);
    activePeriods.value = extractActivePeriods(statusHistory);
    totActiveTime.value = calculateTotalTime(activePeriods.value);
  } catch (error) {
    showError(error);
  } finally {
    loadingSidebar.value = false;
  }
}

function handleHideSidebar() {
  sidebarVisible.value = false;
  sidebarData.value = {};
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

async function handleSavePaycheck() {
  loadingSavePaycheck.value = true;

  let paycheck = {
    profile_id: staffId.value,
    profile_name: sidebarData.value.name,
    reference_date: new Date(),

    horaBase: baseHour.value,
    horaReal: TOT3.value / sidebarData.value.totalHours,
    horasTotales: sidebarData.value.totalHours,

    total1: TOT1.value,

    presentismo: PRESENTISMO.value,
    viatico: VIATICO.value,
    rol: MAIN_ROLE_MODIFIER.value,
    experiencia: EXPERIENCE.value,
    antiguedad: totActiveTime.value * antiguedad.value * TOT1.value,
    ayudaTransporte: AYUDA_TRANSPORTE.value,
    feriados: feriados.value,
    vacaciones: vacaciones.value,
    sac: sac.value,
    plusCierre: plusCierre.value,
    refuerzo: refuerzo.value,
    plusGuelcom: plusGuelcom.value,

    total2: TOT2.value,

    total3: TOT3.value,

    cuentaCorriente: cuentaCC.value,
    devoluciones: (cuentaCC.value * descuentoCC.value) / 100,

    reciboEstudioContable: reciboEstudioContable.value,
    reciboSac: reciboSac.value,
    anticipos: anticipos.value.reduce((a, b) => a + b.value, 0),

    totalAnticipos: TOT_ANTICIPOS.value,

    totalNeto:
      TOT3.value -
      cuentaCC.value +
      (cuentaCC.value * descuentoCC.value) / 100 -
      anticipos.value.reduce((a, b) => a + b.value, 0) -
      reciboEstudioContable.value -
      reciboSac.value,
  };

  try {
    await savePaycheck(paycheck);
  } catch (error) {
    showError(error);
  } finally {
    loadingSavePaycheck.value = false;
  }
}

watch(plusCierre, (newValue) => {
  if (newValue > 0) {
    plusCierrePerc.value = (newValue * 100) / TOT1.value;
  }
});

watch(plusCierrePerc, (newValue) => {
  if (newValue > 0) {
    plusCierre.value = (newValue * TOT1.value) / 100;
  }
});

watch(plusGuelcom, (newValue) => {
  if (newValue > 0) {
    plusGuelcomPerc.value = (newValue * 100) / TOT1.value;
  }
});

watch(plusGuelcomPerc, (newValue) => {
  if (newValue > 0) {
    plusGuelcom.value = (newValue * TOT1.value) / 100;
  }
});

const filteredFileData = computed(() => {
  return fileData.value.filter((file) =>
    file.name.toLowerCase().includes(filtro.value.toLocaleLowerCase())
  );
});

onMounted(async () => {
  await getDocsOptions();

  presentismo.value = await getLastPresentismoValue();
  viatico.value = await getLastViaticoValue();
  antiguedad.value = await getLastAntiguedad();
  baseHour.value = await getLastBaseHourValue();
});
</script>

<template>
  <h1>Importador Horas Excel</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <div class="w-full grid">
      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>File existentes</span>
        <Dropdown
          filter
          show-clear
          :loading="loadingDocsOptions"
          :options="
            docsOptions.filter((doc) => doc.name !== '.emptyFolderPlaceholder')
          "
          optionLabel="name"
          optionValue="name"
          v-model="fileOptions.name"
        ></Dropdown>
      </div>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Nombre file</span>
        <InputText
          :disabled="loadingCalcHours"
          v-model="fileOptions.name"
          class="w-full"
        />
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

    <div class="w-full grid">
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

  <Sidebar
    @hide="handleHideSidebar"
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    :header="'Resumen salarial - ' + sidebarData.name"
  >
    <TabView>
      <TabPanel header="Resumen">
        <div class="col-12 grid">
          <div class="col-12 flex justify-content-between align-items-center">
            <span>Valor hora BASE:</span>
            <span class="font-bold">{{ formatCurrency(baseHour) }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <span>Valor hora REAL:</span>
            <span class="font-bold">{{
              formatCurrency(TOT3 / sidebarData.totalHours)
            }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <span>Horas totales:</span>
            <span class="font-bold"
              >{{ decimalToHoursMinutes(sidebarData.totalHours) }}hs
            </span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <div class="flex flex-column text-blue-700 text-lg">
              <span>TOTAL 1 : </span>
            </div>
            <span class="text-blue-700 text-lg font-bold">{{
              formatCurrency(TOT1)
            }}</span>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12 flex justify-content-between align-items-center">
            <span
              >{{ presentismoGranted ? presentismo * 100 : 0 }}% -
              Presentismo</span
            ><span class="font-bold">{{ formatCurrency(PRESENTISMO) }} </span>
          </div>

          <div
            v-if="viaticoGranted"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>{{ viaticoGranted ? viatico * 100 : 0 }}% - Viatico</span>
            <span class="font-bold">{{ formatCurrency(VIATICO) }}</span>
          </div>

          <div
            v-if="mainRole"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span
              >{{ mainRole.last_modifier_value * 100 }}% - Rol:
              {{ mainRole ? mainRole.label : "" }}</span
            >
            <span class="font-bold">{{
              formatCurrency(MAIN_ROLE_MODIFIER)
            }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <span
              >{{
                expExterna.value +
                expGuelcom.value +
                expTitulos.value +
                roleSelected.length * 2
              }}% - Experiencia</span
            >
            <span class="font-bold">{{ formatCurrency(EXPERIENCE) }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <span>{{ antiguedad * 100 }}%/año - Antiguedad</span>
            <span class="font-bold">{{
              formatCurrency(totActiveTime.toFixed(0) * antiguedad * TOT1)
            }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <span>Ayuda Transporte</span>
            <span class="font-bold">{{
              formatCurrency(AYUDA_TRANSPORTE)
            }}</span>
          </div>

          <div
            v-if="feriados"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>Feriados</span>
            <span class="font-bold">{{ formatCurrency(feriados) }}</span>
          </div>

          <div
            v-if="vacaciones"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>Vacaciones</span>
            <span class="font-bold">{{ formatCurrency(vacaciones) }}</span>
          </div>

          <div
            v-if="sac"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>S.A.C.</span>
            <span class="font-bold">{{ formatCurrency(sac) }}</span>
          </div>

          <div
            v-if="plusCierre"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span
              >{{ Number(plusCierrePerc).toFixed(2) }}% - Responsable
              cierre</span
            >
            <span class="font-bold">{{ formatCurrency(plusCierre) }}</span>
          </div>

          <div
            v-if="refuerzo"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>{{ Number(refuerzoPerc).toFixed(2) }}% - Refuerzo</span>
            <span class="font-bold">{{ formatCurrency(refuerzo) }}</span>
          </div>

          <div
            v-if="plusGuelcom"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span
              >{{ Number(plusGuelcomPerc).toFixed(2) }}% - Plus güelcom</span
            >
            <span class="font-bold">{{ formatCurrency(plusGuelcom) }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <div class="flex flex-column text-blue-700 text-lg">
              <span> TOTAL 2 : </span>
            </div>
            <span class="text-blue-700 text-lg font-bold">{{
              formatCurrency(TOT2)
            }}</span>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12 flex justify-content-between align-items-center">
            <div class="flex flex-column text-blue-700 text-lg">
              <span> TOTAL 1 + TOTAL 2 : </span>
            </div>
            <span class="text-blue-700 text-lg font-bold">{{
              formatCurrency(TOT3)
            }}</span>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12 flex justify-content-between align-items-center">
            <span>Cuenta corriente</span>
            <span class="font-bold">{{
              formatCurrency(cuentaCC - (cuentaCC * descuentoCC) / 100)
            }}</span>
          </div>

          <div
            v-if="reciboEstudioContable"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>Recibo</span>
            <span class="font-bold">{{
              formatCurrency(reciboEstudioContable)
            }}</span>
          </div>

          <div
            v-if="reciboSac"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>Recibo S.A.C.</span>
            <span class="font-bold">{{ formatCurrency(reciboSac) }}</span>
          </div>

          <div
            v-for="(anticipo, index) in anticipos"
            :key="index"
            class="col-12 flex justify-content-between align-items-center"
          >
            <span>Anticipo {{ simpleFormattedDate(anticipo.date) }}</span>
            <span class="font-bold">{{ formatCurrency(anticipo.value) }}</span>
          </div>

          <div class="col-12 flex justify-content-between align-items-center">
            <div class="flex flex-column text-blue-700 text-lg">
              <span> TOTAL ANTICIPOS : </span>
            </div>
            <span class="text-blue-700 text-lg font-bold">{{
              formatCurrency(TOT_ANTICIPOS)
            }}</span>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12 flex justify-content-between align-items-center">
            <div class="flex flex-column text-blue-700 text-xl font-bold">
              <span> TOTAL NETO : </span>
            </div>
            <span class="text-blue-700 text-xl font-bold">{{
              formatCurrency(TOT3 - TOT_ANTICIPOS)
            }}</span>
          </div>

          <div class="col-12 flex justify-content-end align-items-center">
            <Button
              label="Guardar resumen"
              icon="pi pi-save"
              class="p-button-outlined"
              :loading="loadingSavePaycheck"
              @click="handleSavePaycheck"
            ></Button>
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Panel de control">
        <div class="col-12 grid mt-4">
          <div class="col-12">
            <span class="font-bold text-xl">Modificadores personales</span>
          </div>

          <div class="col-12 flex justify-content-start align-items-center">
            <span class="font-bold"
              >Horas totales:
              {{ decimalToHoursMinutes(sidebarData.totalHours) }} hs
            </span>
          </div>

          <div
            v-if="mainRole"
            class="col-12 flex flex-column align-items-start"
          >
            <span class="font-bold"
              >Rol principal: {{ mainRole.last_modifier_value * 100 }} %</span
            >
            <span>{{ mainRole.label }}</span>
          </div>

          <div
            v-if="
              expTitulos && expExterna && expGuelcom && roleSelected.length > 0
            "
            class="col-12 flex flex-column align-items-start"
          >
            <span class="font-bold"
              >Experiencia:
              {{
                expTitulos.value +
                expGuelcom.value +
                expExterna.value +
                roleSelected.length * 2
              }}
              %</span
            >
            <div v-if="roleSelected.length">
              -
              <span v-for="role in roleSelected" :key="role" class="mr-2">{{
                role.label
              }}</span>
            </div>
            <div v-if="expExterna.value">
              <span>- {{ expExterna.description }}</span>
            </div>
            <div v-if="expTitulos.value">
              <span>- {{ expTitulos.description }}</span>
            </div>
            <div v-if="expGuelcom.value">
              <span>- exp gü {{ expGuelcom.value }}</span>
            </div>
          </div>

          <div
            v-if="distancia"
            class="col-12 flex flex-column align-items-start"
          >
            <span class="font-bold"
              >Ayuda Transporte: {{ "(" + sidebarData.data.length + " dias)" }}
              {{
                formatCurrency(
                  (distancia / 10) * lastSuperYpf * sidebarData.data.length
                )
              }}</span
            >
            <span>Distancia: {{ distancia }}Km</span>
          </div>

          <div
            v-if="descuentoCC"
            class="col-12 flex flex-column align-items-start"
          >
            <span class="font-bold"
              >Descuento en cuenta corriente: {{ descuentoCC }}%</span
            >
          </div>

          <Divider class="col-12 my-4"></Divider>

          <div class="col-12">
            <span class="font-bold text-xl">Modificadores fijos</span>
          </div>

          <div class="col-12 flex justify-content-start align-items-center">
            <Checkbox
              v-model="presentismoGranted"
              :binary="true"
              class="mr-2"
            ></Checkbox>
            <span
              @click="presentismoGranted = !presentismoGranted"
              class="cursor-pointer select-none"
              >Valor Presentismo: {{ presentismo * 100 }}%
            </span>
          </div>

          <div class="col-12 flex justify-content-start align-items-center">
            <Checkbox
              v-model="viaticoGranted"
              :binary="true"
              class="mr-2"
            ></Checkbox>
            <span
              @click="viaticoGranted = !viaticoGranted"
              class="cursor-pointer select-none"
              >Valor Viatico: {{ viatico * 100 }}%
            </span>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12">
            <span class="font-bold text-xl">Otros modificadores</span>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Refuerzo">
              <InputNumber
                v-model="refuerzoPerc"
                suffix="%"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
            <small>Refuerzo: {{ formatCurrency(refuerzo) }}</small>
          </div>

          <div class="col-12 md:col-6 flex flex-column mb-2">
            <BaseInput label="Plus güelcom">
              <InputNumber
                v-model="plusGuelcom"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 flex flex-column mb-2">
            <BaseInput label="Plus güelcom %">
              <InputNumber
                v-model="plusGuelcomPerc"
                suffix="%"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 flex flex-column mb-2">
            <BaseInput label="Responsable Cierre">
              <InputNumber
                v-model="plusCierre"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 flex flex-column mb-2">
            <BaseInput label="Responsable Cierre %">
              <InputNumber
                v-model="plusCierrePerc"
                suffix="%"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Feriados">
              <InputNumber
                v-model="feriados"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Vacaciones">
              <InputNumber
                v-model="vacaciones"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="S.A.C.">
              <InputNumber
                v-model="sac"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Cuenta corriente">
              <InputNumber
                v-model="cuentaCC"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
            <span class="text-sm"
              >- {{ descuentoCC }}% =
              {{
                formatCurrency(cuentaCC - (cuentaCC * descuentoCC) / 100)
              }}</span
            >
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Recibo">
              <InputNumber
                v-model="reciboEstudioContable"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 md:col-7 flex flex-column mb-2">
            <BaseInput label="Recibo S.A.C.">
              <InputNumber
                v-model="reciboSac"
                mode="currency"
                currency="ARS"
                locale="es-AR"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
              ></InputNumber>
            </BaseInput>
          </div>

          <div class="col-12 grid">
            <div
              class="col-12 flex justify-content-between align-items-center mb-2"
            >
              <span class="text-xl">Anticipos</span>
              <Button
                @click="addAnticipo()"
                label="Nuevo anticipo"
                icon="pi pi-plus"
                class="p-button-secondary"
              ></Button>
            </div>

            <div
              v-for="(anticipo, index) in anticipos"
              :key="index"
              class="col-12 flex justify-content-start align-items-end gap-3 mb-2"
            >
              <BaseInput label="Fecha">
                <Calendar
                  v-model="anticipo.date"
                  dateFormat="dd/mm/yy"
                ></Calendar>
              </BaseInput>

              <BaseInput label="Importe">
                <InputNumber
                  v-model="anticipo.value"
                  mode="currency"
                  currency="ARS"
                  locale="es-AR"
                ></InputNumber>
              </BaseInput>

              <div>
                <Button
                  @click="removeAnticipo(index)"
                  icon="pi pi-trash"
                  class="p-button-danger p-button-sm p-button-outlined p-button-rounded mb-3"
                ></Button>
              </div>
            </div>
          </div>
        </div>
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
            <Column field="fediado" header="Feriado">
              <template #body="{ data }">
                <i
                  class="pi"
                  :class="
                    data.fediado
                      ? 'pi-check-circle text-green-500'
                      : 'pi-times text-gray-300'
                  "
                ></i>
              </template>
              <template #editor="{ data }">
                <Checkbox v-model="data.fediado" :binary="true" />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </TabView>
  </Sidebar>
</template>
