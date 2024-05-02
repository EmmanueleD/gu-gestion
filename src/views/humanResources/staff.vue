<script setup>
import { ref, onMounted, computed } from "vue";

// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useCustomToast from "@/composables/utils/useCustomToast";
import useAuth from "@/composables/useAuth";
import useSupaApi from "@/composables/useSupaApi";

// COMPOSABLES VARIABLES
const { get, getAll, getWithFilter, create, update, dbResponseStatus, dbResp } =
  useSupabaseDB();
const { showSuccess, showError } = useCustomToast();
const { guAuthResponse, guRegister, fetchProfiles } = useAuth();
const { getEmployeeOptions, getGestRoleOptions, setProfileGestRole } =
  useSupaApi();

// STORES
import { useRRHHStore } from "@/stores/useRRHHStore";

// COMPONENTS
import BaseInput from "@/components/base/BaseInput.vue";
import NotesList from "@/components/sub-components/NotesList.vue";
import Convenio from "@/components/sub-components/Convenio.vue";

import Validator from "@/utils/Validator";
import staffInfo from "@/utils/validationJsons/staffInfo.json";

const RRHHStore = useRRHHStore();

const validator = new Validator(staffInfo);
const validatorResults = computed(() => {
  return validator.validate(RRHHStore.currentEmployee);
});

// COMPONENT VARIABLES
const employees = ref([]);
const loadingEmployees = ref(false);
const loadingEmployeesRoles = ref(false);
const loadingCreateStaff = ref(false);
const loadingFinger = ref(false);
const loadingGestRole = ref(false);
const sidebarVisible = ref(false);
const gestRoleOptions = ref([]);

const email = ref("");
const name = ref("");
const password = ref("staff123");

// METHODS

function hideSidebar() {
  sidebarVisible.value = false;
  RRHHStore.setCurrentEmployee({});
}

async function createStaff() {
  loadingCreateStaff.value = true;
  try {
    await guRegister({
      email: email.value,
      password: password.value,
      name: name.value + " - STAFF",
    });
    if (guAuthResponse.value.error) {
      if (
        guAuthResponse.value.error.toString().includes("already registered")
      ) {
        await getWithFilter({
          table: "profiles",
          orderingBy: "createdAt",
          filter: {
            column: "email",
            value: email.value,
          },
        });
        if (dbResponseStatus.value === "OK") {
          RRHHStore.setCurrentEmployee(dbResp.value[0]);
        } else {
          showError("No se encontraron Staff");
        }
      } else {
        showError(
          guAuthResponse.value.event,
          guAuthResponse.value.error.message || guAuthResponse.value.error
        );
      }
    } else {
      await fetchProfiles(guAuthResponse.value.data.user.id);
      await setProfileGestRole(guAuthResponse.value.data.user.id, 8);
      showSuccess(guAuthResponse.value.event, "Registro exitoso");
    }
  } catch (error) {
    showError(error);
  } finally {
    hideSidebar();
    loadingCreateStaff.value = false;
  }
}

async function showSidebar(employee) {
  if (employee.id) {
    RRHHStore.setCurrentEmployee(employee);
  } else {
    RRHHStore.setCurrentEmployee({ finger_id: RRHHStore.freeFingerId });
  }

  sidebarVisible.value = true;
}

async function getCurrentFingerId() {
  loadingFinger.value = true;

  RRHHStore.setFreeFingerId(null);
  RRHHStore.currentEmployee.finger_id = null;

  try {
    await get({
      table: "finger_id",
      id: { key: "finger_id_id", value: 1 },
    });
    if (dbResponseStatus.value === "OK") {
      RRHHStore.setFreeFingerId(dbResp.value.value + 1);

      RRHHStore.currentEmployee.finger_id = dbResp.value.value + 1;
    } else {
      showError("No se encontraron huellas");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingFinger.value = false;
  }
}

async function saveEmployee() {
  loadingCreateStaff.value = true;

  try {
    await update({
      table: "profiles",
      id: { key: "id", value: RRHHStore.currentEmployee.id },
      data: RRHHStore.currentEmployee,
    });

    if (dbResponseStatus.value === "OK") {
      await saveNewFingerId();
      showSuccess(dbResponseStatus.value, "Actualizado exitosamente");
    } else {
      showError(dbResponseStatus.value, dbResp.value);
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingCreateStaff.value = false;
    sidebarVisible.value = false;
  }
}

async function saveNewFingerId() {
  loadingFinger.value = true;
  try {
    await update({
      table: "finger_id",
      id: { key: "finger_id_id", value: 1 },
      data: {
        value: Number(RRHHStore.currentEmployee.finger_id),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    showError(error);
  } finally {
    loadingFinger.value = false;
  }
}

async function getData() {
  loadingEmployees.value = true;
  loadingGestRole.value = true;
  try {
    employees.value = await getEmployeeOptions();
    gestRoleOptions.value = await getGestRoleOptions();
  } catch (error) {
    showError(error);
  } finally {
    loadingEmployees.value = false;
    loadingGestRole.value = false;
  }
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="w-full flex justify-content-between align-items-center">
    <h1>Staff</h1>
    <div class="flex justify-content-end align-items-center">
      <Button
        label="Actualizar"
        icon="pi pi-refresh"
        class="w-auto p-button-secondary mr-2"
        :disabled="loadingEmployees"
        @click="getData"
      />
      <Button
        label="Nuevo Empleado"
        icon="pi pi-plus"
        class="w-auto"
        :disabled="loadingEmployees"
        @click="showSidebar({})"
      />
    </div>
  </div>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <DataTable
      :value="employees"
      :loading="loadingEmployees || loadingEmployeesRoles"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      v-if="employees.length > 0"
      :paginator="true"
      :rows="50"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
    >
      <Column field="acciones" header="Acciones" style="width: 150px">
        <template #body="{ data }">
          <Button
            icon="pi pi-user"
            @click="showSidebar(data)"
            label="Ver"
            class="p-button-secondary"
          />
          <!-- <Button
            icon="pi pi-trash"
            class="p-button-danger ml-2"
          /> -->
        </template>
      </Column>
      <Column field="name" header="Nombre Fudo" sortable>
        <template #body="{ data }">
          <Avatar
            size="xlarge"
            shape="circle"
            :image="
              data.avatar_url && !data.avatar_url.includes('StorageApiError')
                ? data.avatar_url
                : null
            "
            :label="
              !data.avatar_url || data.avatar_url.includes('StorageApiError')
                ? data.name[0]
                : null
            "
          ></Avatar>
        </template>
      </Column>
      <Column field="finger_id" header="Numero Huella" sortable>
        <template #body="{ data }">
          <pre>{{ data.finger_id }}</pre>
        </template>
      </Column>
      <Column field="username" header="Nombre" sortable> </Column>
    </DataTable>
  </div>
  <Sidebar
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    @hide="hideSidebar"
  >
    <h1>{{ RRHHStore.currentEmployee?.username || "Crear staff" }}</h1>

    <TabView v-if="RRHHStore.currentEmployee.id" class="w-full">
      <TabPanel header="Información">
        <div class="w-full grid pt-4">
          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput label="Nombre">
              <InputText
                v-model="RRHHStore.currentEmployee.username"
                class="w-full"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput label="Nombre Fudo">
              <InputText
                v-model="RRHHStore.currentEmployee.name"
                class="w-full"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput label="Fecha de nacimiento">
              <Calendar
                v-model="RRHHStore.currentEmployee.birthdate"
                class="w-full"
                jsaction="paste:puy29d;"
                maxlength="2048"
                name="q"
                type="text"
                aria-autocomplete="both"
                aria-haspopup="false"
                autocapitalize="off"
                autocomplete="off"
                autocorrect="off"
                autofocus=""
                role="combobox"
                spellcheck="false"
                title="Pesquisar"
                value=""
                aria-label="Pesquisar"
                data-ved="0ahUKEwjw0svW6brxAhWdqJUCHXoYDRsQ39UDCAQ"
              ></Calendar>
            </BaseInput>
          </div>

          <div class="col-12"></div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput label="Dirección">
              <InputText
                v-model="RRHHStore.currentEmployee.address"
                class="w-full"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput
              label="Email"
              :error-message="validatorResults.messages.email"
            >
              <InputText
                v-model="RRHHStore.currentEmployee.email"
                class="w-full"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput label="Telefono">
              <InputText
                v-model="RRHHStore.currentEmployee.phone"
                class="w-full"
              />
            </BaseInput>
          </div>

          <Divider class="col-12"></Divider>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput
              label="Rol en el sistema"
              :error-message="validatorResults.messages.gest_role_id"
            >
              <Dropdown
                v-model="RRHHStore.currentEmployee.gest_role_id"
                :options="gestRoleOptions"
                optionLabel="label"
                optionValue="gest_role_id"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column">
            <BaseInput
              label="Numero Huella"
              :error-message="validatorResults.messages.finger_id"
            >
              <InputNumber
                :disabled="true"
                v-model="RRHHStore.currentEmployee.finger_id"
                class="w-full"
              />
            </BaseInput>
          </div>

          <div class="col-12 md:col-6 lg:col-4 mb-2 flex flex-column pl-2">
            <BaseInput label="Genera Numero Huella" class="w-full">
              <Button
                @click="getCurrentFingerId"
                :icon="loadingFinger ? 'pi pi-spin pi-sync' : 'pi pi-sync'"
                class="p-button-secondary"
                :disabled="loadingFinger"
              ></Button>
            </BaseInput>
          </div>
        </div>
        <div class="w-full flex justify-content-end align-items-center mt-4">
          <Button
            @click="saveEmployee"
            label="Guardar"
            icon="pi pi-save"
            class="w-auto"
            :loading="loadingCreateStaff"
            :disabled="!validatorResults.validation"
          />
        </div>
      </TabPanel>
      <TabPanel header="Convenio">
        <Convenio />
      </TabPanel>
      <TabPanel header="Documentos"> Work in progress... </TabPanel>
      <TabPanel header="Notas">
        <NotesList
          table="staff_note"
          :filter="{
            column: 'profile_id',
            value: RRHHStore.currentEmployee.id,
          }"
          :ascending="false"
        />
      </TabPanel>
    </TabView>
    <div v-else>
      <Message>
        <div class="w-full flex flex-column">
          <span class="font-bold mb-2">¡ATENCIÓN!</span>
          <span
            >Si el nuevo Staff es o fué parte de la comünidad usar el mail que
            utiliza para iniciar sesión</span
          >
        </div>
      </Message>

      <div class="w-full grid">
        <BaseInput label="Email" class="col-12 md:col-6 mb-4 flex flex-column">
          <InputText v-model="email"></InputText>
        </BaseInput>

        <BaseInput label="Nombre" class="col-12 md:col-6 mb-2 flex flex-column">
          <InputText v-model="name"></InputText>
        </BaseInput>

        <BaseInput
          label="Contraseña"
          class="col-12 md:col-6 mb-2 flex flex-column"
        >
          <InputText v-model="password"></InputText>
        </BaseInput>
      </div>

      <div class="w-full flex justify-content-end align-items-center">
        <Button
          :loading="loadingCreateStaff"
          :disabled="loadingCreateStaff || !email"
          @click="createStaff"
          label="Registrar nuevo staff"
          icon="pi pi-user"
          class="p-button-secondary"
        ></Button>
      </div>
    </div>
  </Sidebar>
</template>
