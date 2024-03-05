<script setup>
import { ref } from "vue";

import useGeneric from "@/composables/utils/useGeneric";
import useSupabaseAuth from "@/composables/useSupabaseAuth";
import useCustomToast from "@/composables/utils/useCustomToast";

const { supaAuthResp, resetPasswordForEmail } = useSupabaseAuth();
const { showSuccess, showError } = useCustomToast();

const email = ref("");
const loading = ref(false);

const { isValidEmail } = useGeneric();

async function resetPassword() {
  loading.value = true;

  try {
    await resetPasswordForEmail(email.value);

    if (supaAuthResp.value.error) {
      showError(
        supaAuthResp.value.event,
        supaAuthResp.value.error.message || supaAuthResp.value.error
      );
    } else {
      showSuccess(supaAuthResp.value.event, "Enlace enviado");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
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

          <h1>Restablece tu contraseña</h1>

          <div
            class="w-full flex justify-content-start align-items-center my-4"
          >
            <span>
              Recibiras a tu correo un enlace para restablecer tu contraseña
            </span>
          </div>

          <div class="w-full flex flex-column align-items-start">
            <label class="mb-2"> Email </label>
            <InputText
              v-model="email"
              placeholder="Email"
              class="w-full mb-4"
              :class="!isValidEmail(email) ? 'p-invalid' : ''"
            ></InputText>
          </div>

          <div class="w-full flex justify-content-center align-items-center">
            <Button
              :loading="loading"
              label="Restablecer"
              icon="pi pi-key"
              class="w-full p-3 text-xl"
              :disabled="!isValidEmail(email) || loading"
              @click="resetPassword"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
