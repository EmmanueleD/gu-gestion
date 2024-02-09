<script setup>
import { ref, computed, onMounted } from "vue";
// COMPOSABLES
import useGeneric from "@/composables/utils/useGeneric";
import useDateTime from "@/composables/utils/useDateTime";
import useSupabaseDB from "@/composables/useSupabaseDB";
import useCustomToast from "@/composables/utils/useCustomToast";
import useFudoApi from "@/composables/useFudoApi";
import { useDateFormat } from "@vueuse/core";
import useSupabaseStorage from "@/composables/useSupabaseStorage";

// STORES
import { useAuthStore } from "@/stores/useAuthStore";
import { useStorageStore } from "@/stores/useStorageStore";

// VARIABLES
const loading = ref(false);
const loadingUpload = ref(false);
const authStore = useAuthStore();
const storageStore = useStorageStore();
const { formatCurrency } = useGeneric();
const { fetchData } = useFudoApi();
const { countdownToBirthday } = useDateTime();
const { uploadSingleFile, getFileUrl } = useSupabaseStorage();
const { dbResponseStatus, dbResp, getAll, update, get } = useSupabaseDB();
const { showSuccess, showError } = useCustomToast();

const authProfile = ref({ ...authStore.profile });
const bucketName = ref("avatars");
const folderName = ref("profiles");
const fileName = ref("");
const fileUrl = ref(null);

const form = ref([
  {
    key: "username",
    label: "Username",
    type: "text",
    icon: "pi pi-user",
  },
  {
    key: "name",
    label: "Nombre completo",
    type: "text",
    icon: "pi pi-user",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    icon: "pi pi-envelope",
  },
  {
    key: "birthdate",
    label: "Cumpleaños",
    type: "date",
    icon: "pi pi-calendar",
  },
  {
    key: "gu_level_id",
    label: "Nivel güelcom",
    type: "dropdown",
    icon: "pi pi-user",
  },
  {
    key: "instagram",
    label: "Instagram",
    type: "text",
    icon: "pi pi-instagram",
  },
  {
    key: "address",
    label: "Dirección",
    type: "text",
    icon: "pi pi-map-marker",
  },
  {
    key: "phone",
    label: "Telefono",
    type: "text",
    icon: "pi pi-phone",
  },
]);

const formOptions = ref({
  gu_level_id: {
    table: "gu_level",
    options: [],
    loading: false,
  },
});

async function getFormOptions() {
  for (let field in formOptions.value) {
    formOptions.value[field].loading = true;

    try {
      formOptions.value[field].options = await getAll({
        table: formOptions.value[field].table,
      });
      if (dbResponseStatus.value === "OK") {
        formOptions.value[field].options = dbResp.value;
      } else {
        showError(dbResponseStatus.value, dbResp.value);
      }
    } catch (error) {
      showError(dbResponseStatus.value, error);
    } finally {
      formOptions.value[field].loading = false;
    }
  }
}

async function handleUpdateProfile() {
  loading.value = true;

  try {
    await update({
      table: "profiles",
      id: { key: "id", value: authProfile.value.id },
      data: authProfile.value,
    });
    if (dbResponseStatus.value === "OK") {
      showSuccess(dbResponseStatus.value, "Actualizado exitosamente");
    } else {
      showError(dbResponseStatus.value, dbResp.value);
    }

    const newFudoProfile = await fetchData(
      "customers/" + authProfile.value.fudo_id,
      "PATCH",
      {
        data: {
          id: authProfile.value.fudo_id,
          type: "Customer",
          attributes: {
            active: true,
            address: authProfile.value.address
              ? authProfile.value.address
              : null,
            // comment: "[from gu-gestion]",
            // discountPercentage: 0,
            // houseAccountEnabled: false,
            name: authProfile.value.name ? authProfile.value.name : null,
            // email: profile.email,
            phone: authProfile.value.phone ? authProfile.value.phone : null,
            // vatNumber: "",
          },
        },
      }
    );

    if (newFudoProfile) {
      showSuccess("OK", "Actualizado exitosamente");
    } else {
      showError("ERROR", newFudoProfile || "FUDO ERROR");
    }
  } catch (error) {
    showError(dbResponseStatus.value, error);
  } finally {
    loading.value = false;
    await getData();
  }
}

async function getData() {
  loading.value = true;

  try {
    await get({
      table: "profiles",
      id: { key: "id", value: authProfile.value.id },
    });
    if (dbResponseStatus.value === "OK") {
      authStore.setProfile(dbResp.value);
    } else {
      showError(dbResponseStatus.value, dbResp.value);
    }
  } catch (error) {
    showError(dbResponseStatus.value, error);
  } finally {
    loading.value = false;
  }
}

async function handleUpload(event) {
  loadingUpload.value = true;
  let response;
  fileName.value =
    authProfile.value.username +
    "-" +
    useDateFormat(new Date(), "YYYYMMDDHHmmss").value;
  try {
    response = await uploadSingleFile(event, {
      bucket: bucketName.value,
      folder: folderName.value,
      fileName: fileName.value,
    });
    if (response?.error) {
      console.error("UPLOAD ERROR", response.error);
      showError("UPLOAD ERROR", response.error);
    } else {
      showSuccess("UPLOAD OK", "Carga exitosa");
    }
    storageStore.setCurrentFile(response);
  } catch (error) {
    showError(error);
  } finally {
    await setNewAvatar();
    loadingUpload.value = false;
  }
}

async function setNewAvatar() {
  try {
    fileUrl.value = await getFileUrl({
      bucket: bucketName.value,
      folder: folderName.value,
      name: fileName.value,
    });

    if (!fileUrl.value.error) {
      authProfile.value.avatar_url = decodeURIComponent(fileUrl.value);
      await handleUpdateProfile();
    } else {
      console.error("AVATAR ERROR", fileUrl.value.error);
      showError("AVATAR ERROR", "No se pudo cargar la imagen");
    }
  } catch (error) {
    showError("AVATAR ERROR", error);
  }
}

onMounted(async () => {
  await getFormOptions();
});
</script>

<template>
  <h1>Tu Perfil</h1>

  <div
    v-if="loading"
    class="w-full surface-card py-6 px-3 sm:px-6 flex justify-content-center align-items-center"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-spin pi-spinner mr-4" style="fontsize: 3rem"></i>
      <span>Cargando...</span>
    </div>
  </div>

  <div
    v-else-if="!authProfile"
    class="w-full surface-card py-6 px-3 sm:px-6 flex justify-content-center align-items-center"
  >
    <Message severity="error" :closable="false">
      <p>No se encuentra el perfil de usuario.</p>
    </Message>
  </div>

  <div v-else class="w-full surface-card py-6 px-3 sm:px-6 grid">
    <div class="col-12">
      <div
        class="w-full py-6 px-3 sm:px-6 flex justify-content-between align-items-center border-round-md gap-2"
      >
        <span class="block text-900 font-bold text-2xl">
          Hola
          {{ authProfile && authProfile.username ? authProfile.username : "" }}
        </span>

        <div class="w-2 h-2 relative">
          <img
            :src="
              authProfile.avatar_url ||
              'https://64.media.tumblr.com/698bc7fed030cb0915b76538e103aca6/e9bb37e1e047df85-51/s540x810/2adb0bffd47ddc426534a14fe86c381581201e51.pnj'
            "
            class="w-full h-full border-round-lg"
          />
          <FileUpload
            mode="basic"
            name="gu-profile-avatar"
            :multiple="false"
            :customUpload="true"
            accept="image/*"
            invalidFileSizeMessage="El archivo es demasiado grande. Max. 1MB"
            invalidFileTypeMessage="El archivo debe ser una imagen. Ej: .jpg, .png"
            @uploader="handleUpload"
            class="absolute p-button-rounded p-button-secondary"
            style="bottom: -7px; right: -7px"
            :auto="true"
          />
        </div>
      </div>
    </div>

    <div class="col-12 grid">
      <h4>Tus beneficios:</h4>

      <div class="col-12 grid">
        <div class="col-12 md:col-6 lg:col-4">
          <Card>
            <template #title>🤑 Cashback personal </template>
            <template #content>
              <div class="w-full flex flex-column">
                <span
                  v-if="authProfile.houseAccountEnabled"
                  class="font-bold text-3xl"
                  :class="{
                    'text-green-500': authProfile.houseAccountBalance > 0,
                    'text-red-500': authProfile.houseAccountBalance < 0,
                  }"
                >
                  {{ formatCurrency(authProfile.houseAccountBalance) }}
                </span>
                <div v-else class="flex flex-column gap-2 text-orange-800">
                  <span
                    >Parece que todavia no activaste tu
                    <span class="font-bold">cashback personal</span>!</span
                  >
                  <span class="font-bold"
                    >Entra en nuestro programa de niveles y recibiras todos los
                    meses un cashback personal para que puedas disfrutar de
                    nuestros productos</span
                  >
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
          <Card>
            <template #title>🎁 Detalle de cumpleaños </template>
            <template #content>
              <div class="w-full flex flex-column align-items-start">
                <span v-if="authProfile.birthdate">
                  Tu cumple es el
                  {{ useDateFormat(authProfile.birthdate, "DD MMMM").value }}
                </span>

                <span
                  v-if="authProfile.birthdate"
                  class="text-900 font-bold mt-4"
                >
                  -{{ countdownToBirthday(authProfile.birthdate) }} dias para tu
                  sorpresa!</span
                >
                <span v-if="authProfile.birthdate"
                  >Acordate de venir con tu DNI 😉</span
                >

                <span v-else class="text-orange-800 font-bold mt-4">
                  Registra tu fecha de nacimiento para recibir tus beneficios 😉
                </span>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="col-12 grid mt-6">
      <h4>Tu información personal:</h4>

      <div class="col-12 grid">
        <div
          v-for="field in form"
          class="col-12 md:col-7 lg:col-4 lg:mr-3 grid"
        >
          <div class="col-12">
            <label :for="field.key" class="block text-900 font-medium mb-2">
              <i :class="field.icon"></i>
              <span class="ml-2">{{ field.label }}</span></label
            >
            <InputText
              v-if="field.type === 'text'"
              :id="field.key"
              type="text"
              class="w-full"
              v-model="authProfile[field.key]"
              :disabled="loading"
            />
            <InputNumber
              v-if="field.type === 'number'"
              :id="field.key"
              type="number"
              class="w-full"
              v-model="authProfile[field.key]"
              :min-fraction-digits="field.minFractionDigits || 2"
              :max-fraction-digits="field.maxFractionDigits || 2"
              :disabled="loading"
            />
            <Dropdown
              v-if="field.type === 'dropdown'"
              :id="field.key"
              v-model="authProfile[field.key]"
              :options="formOptions[field.key].options"
              optionLabel="label"
              :optionValue="field.key"
              class="w-full"
              :loading="formOptions[field.key].loading"
              :disabled="loading || formOptions[field.key].loading"
            />
            <Calendar
              v-if="field.type === 'date'"
              :id="field.key"
              v-model="authProfile[field.key]"
              class="w-full"
              :disabled="loading"
            />
          </div>
        </div>
        <div class="col-12 flex justify-content-end align-items-center mt-3">
          <Button
            @click="handleUpdateProfile"
            label="Guardar"
            icon="pi pi-save"
            class="w-auto"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>
