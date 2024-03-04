<script setup>
import { ref, onMounted } from "vue";

// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useGeneric from "@/composables/utils/useGeneric";
import useCustomToast from "@/composables/utils/useCustomToast";

// COMPOSABLES VARIABLES
const { getAll, dbResponseStatus, dbResp } = useSupabaseDB();
const { percToNumber, numberToPerc } = useGeneric();
const { showSuccess } = useCustomToast();

// COMPONENT VARIABLES
const employees = ref([]);
const employees_roles = ref([]);
const loadingEmployees = ref(false);
const loadingEmployeesRoles = ref(false);

// METHODS

function employeeRoles(employee_id) {
  const roles = [];
  employees_roles.value.forEach((employee_role) => {
    if (employee_role.employee_id === employee_id) {
      roles.push(employee_role.role_id);
    }
  });
  return roles;
}

async function getEmployees() {
  loadingEmployees.value = true;

  try {
    await getAll({ table: "employee" });

    if (dbResponseStatus.value === "OK") {
      employees.value = dbResp.value;
      showSuccess("Carga exitosa");
    } else {
      showError("No se encontraron empleados");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingEmployees.value = false;
  }
}

async function getEmployeesRoles() {
  loadingEmployeesRoles.value = true;
  try {
    await getAll({ table: "employee_role" });
    if (dbResponseStatus.value === "OK") {
      employees_roles.value = dbResp.value;

      showSuccess("Carga exitosa");
    } else {
      showError("No se encontraron roles");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingEmployeesRoles.value = false;
  }
}

async function getData() {
  await getEmployees();
  await getEmployeesRoles();
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="w-full flex justify-content-between align-items-center">
    <h1>Empleados</h1>
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
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
    >
      <Column field="full_name" header="Nombre Completo"></Column>
      <Column field="role_id" header="Rol">
        <template #body="{ data }">
          {{
            employees_roles
              .find((role) => role.id === data.role_id)
              ?.label.replace(" ", "")
          }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
