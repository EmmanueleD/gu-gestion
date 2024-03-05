<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import useSupabaseAuth from "@/composables/useSupabaseAuth";
import useCustomToast from "@/composables/utils/useCustomToast";

const { supaAuthResp, updateUserPassword } = useSupabaseAuth();
const { showSuccess, showError } = useCustomToast();

const router = useRouter();

const password1 = ref("");
const password2 = ref("");
const loading = ref(false);

function isSamePassword() {
  return password1.value === password2.value;
}

function handleChangePassword() {
  loading.value = true;

  try {
    updateUserPassword(password1.value);
    if (supaAuthResp.value.error) {
      showError(
        supaAuthResp.value.event,
        supaAuthResp.value.error.message || supaAuthResp.value.error
      );
    } else {
      showSuccess(supaAuthResp.value.event, "Contraseña cambiada");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;

    router.push({ name: "access" });
  }
}
</script>

<template>
  <div
    class="surface-ground flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div>
        <div
          class="w-full surface-card py-6 px-3 sm:px-6 flex flex-column align-items-center border-round-md"
        >
          <img
            src="@/assets/img/logo-dark.svg"
            alt="logo güelcom"
            class="mb-5 w-6rem flex-shrink-0 rounded-full border-round-md"
          />

          <h1>Cambia tu contraseña</h1>

          <div
            class="w-full flex justify-content-start align-items-center my-4"
          >
            <span> Por favor escribí tu nueva contraseña </span>
          </div>

          <div class="w-full flex flex-column align-items-start">
            <Password
              id="password2"
              v-model="password1"
              placeholder="Minimo 6 caracteres"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="true"
              :disabled="loading"
            ></Password>

            <Password
              id="password2"
              v-model="password2"
              placeholder="Confirma la nueva contraseña"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="false"
              :disabled="loading"
            ></Password>
          </div>

          <div
            v-if="!isSamePassword()"
            class="w-full flex justify-content-center align-items-center mb-5"
          >
            <p class="text-red-400">Las contraseñas no coinciden</p>
          </div>

          <div class="w-full flex justify-content-center align-items-center">
            <Button
              :loading="loading"
              label="Cambia contraseña"
              icon="pi pi-key"
              class="w-full p-3 text-xl"
              :disabled="loading || !isSamePassword()"
              @click="handleChangePassword"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
