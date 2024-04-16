<script setup>
import { ref, onMounted, computed } from "vue";

// COMPOSABLES
import useSupaApi from "@/composables/useSupaApi";
import useCustomToast from "@/composables/utils/useCustomToast";
import useDatetime from "@/composables/utils/useDateTime";

// COMPOSABLES VARIABLES
const {
  getStaffRoleOptions,
  getStatusOptions,
  getLastSuperYpf,
  getStaffIdRoles,
  setStaffIdRoles,
  saveStaffMainRole,
  getLastStaffStatus,
  saveStaffStatus,
  getStaffExpTitulos,
  saveStaffExpTitulos,
  getStaffExpExterna,
  saveStaffExpExterna,
  getStaffDistance,
  saveStaffDistance,
  getStaffDescuentoCC,
  saveStaffDescuentoCC,
  getStaffMainRoleId,
  getStaffStatusHistory,
  getLastAntiguedad,
} = useSupaApi();
const { showSuccess, showError } = useCustomToast();

const { extractActivePeriods, calculateTotalTime } = useDatetime();

// STORES
import { useAppStore } from "@/stores/useAppStore";

// COMPONENTS
import BaseInput from "../base/BaseInput.vue";

// COMPONENT VARIABLES
const appStore = useAppStore();
const currentEmployee = appStore.currentEmployee;

const loadingRoleOptions = ref(false);
const loadingStatusOptions = ref(false);
const loadingSave = ref(false);

const lastSuperYpf = ref();
const roleOptions = ref([]);
const roleSelected = ref([]);
const mainRole = ref();
const statusOptions = ref([]);
const statusSelected = ref([]);
const statusHistory = ref([]);
const activePeriods = ref([]);
const totActiveTime = ref(0);

const expTitulos = ref({ description: "", value: 0 });
const expExterna = ref({ description: "", value: 0 });

const distancia = ref();
const ayudaTransporteNumber = computed(() => {
  if (!distancia.value || !lastSuperYpf.value) {
    return 0;
  } else {
    return (distancia.value / 10) * lastSuperYpf.value * 24;
  }
});
const descuentoCC = ref();
const antiguedad = ref();

async function saveConvenio() {
  loadingSave.value = true;

  try {
    await setStaffIdRoles(currentEmployee.id, roleSelected.value);
    await saveStaffMainRole(currentEmployee.id, mainRole.value);
    await saveStaffStatus(currentEmployee.id, statusSelected.value);
    await saveStaffDistance(currentEmployee.id, distancia.value);
    await saveStaffDescuentoCC(currentEmployee.id, descuentoCC.value);
    await saveStaffExpTitulos({
      profile_id: currentEmployee.id,
      ...expTitulos.value,
    });
    await saveStaffExpExterna({
      profile_id: currentEmployee.id,
      ...expExterna.value,
    });
  } catch (error) {
    showError("ERROR SALVANDO STAFF:", error);
  } finally {
    loadingSave.value = false;
  }
}

onMounted(async () => {
  loadingRoleOptions.value = true;
  loadingStatusOptions.value = true;
  try {
    roleOptions.value = await getStaffRoleOptions();
    statusOptions.value = await getStatusOptions();
    lastSuperYpf.value = await getLastSuperYpf();
    antiguedad.value = await getLastAntiguedad();

    if (currentEmployee) {
      roleSelected.value = await getStaffIdRoles(currentEmployee.id);
      statusSelected.value = await getLastStaffStatus(currentEmployee.id);
      expTitulos.value = await getStaffExpTitulos(currentEmployee.id);
      expExterna.value = await getStaffExpExterna(currentEmployee.id);
      distancia.value = await getStaffDistance(currentEmployee.id);
      descuentoCC.value = await getStaffDescuentoCC(currentEmployee.id);
      mainRole.value = await getStaffMainRoleId(currentEmployee.id);
      statusHistory.value = await getStaffStatusHistory(currentEmployee.id);
      activePeriods.value = extractActivePeriods(statusHistory.value);
      totActiveTime.value = calculateTotalTime(activePeriods.value);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingRoleOptions.value = false;
    loadingStatusOptions.value = false;
  }
});
</script>

<template>
  <div class="w-full grid pt-4">
    <span class="col-12 font-bold m-0">Convenio</span>

    <div class="col-12 md:col-6 lg:col-4 flex flex-column mb-2">
      <BaseInput label="Status">
        <Dropdown
          :options="statusOptions"
          :loading="loadingStatusOptions"
          v-model="statusSelected"
          optionLabel="label"
          optionValue="status_id"
        ></Dropdown>
      </BaseInput>
    </div>

    <div class="col-12 md:col-6 lg:col-4 flex flex-column mb-2">
      <BaseInput label="Antiguedad">
        <InputNumber
          :disabled="true"
          :placeholder="'Años:' + Number(totActiveTime).toFixed(0)"
        ></InputNumber>
      </BaseInput>
    </div>

    <div
      class="col-12 flex flex-column align-items-end justify-content-center"
    ></div>

    <div class="col-12 md:col-8 flex flex-column mb-2">
      <BaseInput label="Roles">
        <MultiSelect
          :options="roleOptions"
          :loading="loadingRoleOptions"
          v-model="roleSelected"
          optionLabel="label"
          optionValue="staff_role_id"
        ></MultiSelect>
      </BaseInput>
    </div>

    <div
      class="col-12 md:col-4 flex flex-column align-items-end justify-content-center"
    >
      <span>Experiencia Roles: </span>
      <span class="text-900 font-bold">{{ roleSelected.length * 2 }} %</span>
    </div>

    <div class="col-12 md:col-6 lg:col-4 flex flex-column">
      <BaseInput label="De los cuales el principal es">
        <Dropdown
          :options="
            roleOptions.filter((role) =>
              roleSelected.includes(role.staff_role_id)
            )
          "
          v-model="mainRole"
          optionLabel="label"
          optionValue="staff_role_id"
        ></Dropdown>
      </BaseInput>
    </div>

    <div
      v-if="mainRole"
      class="col-12 md:col-6 lg:col-8 flex flex-column align-items-end justify-content-center"
    >
      <span>Modificador Rol: </span>
      <span class="text-900 font-bold"
        >{{
          roleOptions.filter((role) => role.staff_role_id == mainRole)[0]
            .last_modifier_value * 100
        }}
        %</span
      >
    </div>

    <Divider class="col-12 my-4"></Divider>

    <span class="col-12 font-bold">Exp. Titulos</span>
    <div class="col-12 flex flex-column mb-2">
      <div class="w-full flex justify-content-start align-items-center">
        <BaseInput label="Descripción" class="mr-2 mb-2">
          <InputText v-model="expTitulos.description"></InputText>
        </BaseInput>
        <BaseInput label="Valor total">
          <InputNumber v-model="expTitulos.value" suffix="%"></InputNumber>
        </BaseInput>
      </div>
    </div>

    <span class="col-12 font-bold">Exp. Externa</span>

    <div class="col-12 flex flex-column mb-2">
      <div class="w-full flex justify-content-start align-items-center">
        <BaseInput label="Descripción" class="mr-2 mb-2">
          <InputText v-model="expExterna.description"></InputText>
        </BaseInput>
        <BaseInput label="Valor total">
          <InputNumber v-model="expExterna.value" suffix="%"></InputNumber>
        </BaseInput>
      </div>
    </div>

    <Divider class="col-12 my-4"></Divider>

    <span class="col-12 font-bold">Ayuda Transporte</span>

    <div class="col-12 flex flex-column mb-2">
      <div class="w-full flex justify-content-start align-items-center">
        <BaseInput label="Distancia en Km" class="mr-2 mb-2">
          <InputNumber v-model="distancia"></InputNumber>
        </BaseInput>
        <BaseInput label="Ayuda Transporte (suponiendo 24 días trabajados)">
          <InputNumber
            v-model="ayudaTransporteNumber"
            :disabled="true"
            locale="es"
            currency="ARS"
            mode="currency"
          ></InputNumber>
        </BaseInput>
      </div>
    </div>

    <Divider class="col-12 my-4"></Divider>

    <span class="col-12 font-bold">Cuenta corriente</span>

    <div class="col-12 md:col-6 lg:col-4 flex flex-column mb-2">
      <BaseInput label="Descuento CC" class="mb-2">
        <InputNumber v-model="descuentoCC" suffix="%"></InputNumber>
      </BaseInput>
    </div>

    <Divider class="col-12 my-4"></Divider>

    <div class="col-12 flex justify-content-end align-items-center">
      <Button
        label="Guardar"
        icon="pi pi-save"
        @click="saveConvenio"
        :loading="loadingSave"
      ></Button>
    </div>
  </div>
</template>
