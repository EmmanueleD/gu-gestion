<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useSupabaseAuth from "@/composables/useSupabaseAuth";
import useGestLog from "@/composables/supabase-tables/useGestLog";
import useCustomToast from "@/composables/utils/useCustomToast";

const router = useRouter();

const { createLog } = useGestLog();
const { login } = useSupabaseAuth();
const { showSuccess, showError } = useCustomToast();

const email = ref("");
const password1 = ref("");
const loading = ref(false);

async function handleAccess() {
  loading.value = true;

  let response = null;
  try {
    response = await login({ email: email.value, password: password1.value });
    if (response.error) {
      showError(response.error);
    } else {
      showSuccess("Login exitoso");
      const logResponse = await createLog(
        "Access.vue - handleAccess - email: " + email.value
      );
      console.log("Access.vue - handleAccess - logResponse: ", logResponse);
      router.push({ name: "home" });
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
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div>
        <div
          class="w-full surface-card py-6 px-3 sm:px-6 flex flex-column align-items-center"
        >
          <img
            src="@/assets/img/logo-dark.svg"
            alt="logo güelcom"
            class="mb-5 w-6rem flex-shrink-0 rounded-full border-round-md"
          />
          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >Email</label
            >
            <InputText
              id="email1"
              type="text"
              placeholder="Correo electronico"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="email"
              :disabled="loading"
            />

            <label
              for="password1"
              class="block text-900 font-medium text-xl mb-2"
              >Password</label
            >
            <Password
              id="password1"
              v-model="password1"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="false"
              :disabled="loading"
            ></Password>

            <Button
              :disabled="password1?.length < 6"
              :loading="loading"
              @click="handleAccess"
              label="Login"
              class="w-full p-3 text-xl"
              icon="pi pi-sign-in"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
@/composables/utils/useCustomToast
