<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// import useSupabaseAuth from "@/composables/useSupabaseAuth";
import useAuth from "@/composables/useAuth";
import useCustomToast from "@/composables/utils/useCustomToast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFudoStore } from "@/stores/useFudoStore";

const router = useRouter();

const authStore = useAuthStore();
const fudoStore = useFudoStore();

// const { login, register, authResp } = useSupabaseAuth();
const { guAuthResponse, guLogin, guRegister } = useAuth();
const { showSuccess, showError } = useCustomToast();

const name = ref("");
const email = ref("");
const password1 = ref("");
const password2 = ref("");
const loading = ref(false);
const mode = ref("login");
const needEmailConfirmation = ref(false);

async function handleLogin() {
  loading.value = true;
  needEmailConfirmation.value = false;
  try {
    await guLogin({ email: email.value, password: password1.value });

    console.log("GUAUTHRESPONSE", guAuthResponse.value);

    if (guAuthResponse.value.error) {
      showError(
        guAuthResponse.value.event,
        guAuthResponse.value.error.message || guAuthResponse.value.error
      );
    } else {
      showSuccess(guAuthResponse.value.event, "Login exitoso");
    }
  } catch (error) {
    console.error("GU-ERR :", error);
    if (error.message.includes("Invalid login credentials")) {
      showError("Credenciales inválidas");
    }
  } finally {
    loading.value = false;
    router.push("/profile");
  }
}

async function handleRegister() {
  loading.value = true;
  try {
    await guRegister({
      email: email.value,
      password: password1.value,
      name: name.value,
    });
    if (guAuthResponse.value.error) {
      showError(
        guAuthResponse.value.event,
        guAuthResponse.value.error.message || guAuthResponse.value.error
      );
    } else {
      mode.value = "login";
      needEmailConfirmation.value = true;
      showSuccess(guAuthResponse.value.event, "Registro exitoso");
    }
  } catch (error) {
    showError("GU-ERR REGISTER", error);
  } finally {
    loading.value = false;
  }
}

function navigateTo(url) {
  window.open(url, "_blank");
}

onMounted(() => {
  authStore.resetStore();
  fudoStore.resetStore();
});
</script>

<template>
  <div
    class="surface-ground flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
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
            <label
              v-if="mode === 'register'"
              for="name"
              class="block text-900 text-xl font-medium mb-2"
              >Nombre completo</label
            >
            <InputText
              v-if="mode === 'register'"
              id="name"
              placeholder="Minimo 3 caracteres"
              type="text"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="name"
              :disabled="loading"
            />

            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >Email</label
            >
            <InputText
              id="email1"
              type="text"
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
              :placeholder="mode === 'register' ? 'Minimo 6 caracteres' : ''"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="mode === 'register' ? true : false"
              :disabled="loading"
            ></Password>

            <label
              v-if="mode === 'register'"
              for="password2"
              class="block text-900 font-medium text-xl mb-2"
              >Confirmar password</label
            >

            <Password
              v-if="mode === 'register'"
              id="password2"
              v-model="password2"
              placeholder="Minimo 6 caracteres"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="false"
              :disabled="loading"
            ></Password>

            <Button
              v-if="mode === 'login' && !needEmailConfirmation"
              :disabled="password1?.length < 6"
              :loading="loading"
              @click="handleLogin"
              label="Login"
              class="w-full p-3 text-xl"
              icon="pi pi-sign-in"
            ></Button>

            <Button
              v-else-if="mode === 'register'"
              :disabled="
                password1?.length < 6 ||
                password1 !== password2 ||
                name?.length < 3
              "
              :loading="loading"
              @click="handleRegister"
              label="Registrar"
              class="w-full p-3 text-xl"
              icon="pi pi-user-plus"
            ></Button>
          </div>
          <Divider class="w-full my-4"></Divider>
          <InlineMessage v-if="needEmailConfirmation" severity="info">
            <div class="w-full flex flex-column">
              <span>Mandamos un email de confirmación.</span>
              <span>Por favor revisa tu correo para acceder a tu cuenta.</span>
            </div>
          </InlineMessage>
          <Divider v-if="needEmailConfirmation" class="w-full my-4"></Divider>

          <div
            class="mt-3 flex align-items-center justify-content-start w-full"
          >
            <p v-if="mode === 'login'" class="text-600 m-0">
              No tenes una cuenta?
            </p>
            <p v-else-if="mode === 'register'" class="text-600 m-0">
              Ya tenes una cuenta?
            </p>
            <Button
              v-if="mode === 'login'"
              label="Registrate"
              class="p-button-text"
              @click="mode = 'register'"
              :disabled="loading"
              icon="pi pi-user-plus"
            ></Button>
            <Button
              v-else-if="mode === 'register'"
              label="Login"
              class="p-button-text"
              @click="mode = 'login'"
              :disabled="loading"
              icon="pi pi-sign-in"
            ></Button>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-footer mt-8">
      <span class="text-900 font-medium">gü-gestión by</span>
      <div
        @click="navigateTo('https://www.emmanueledurante.com')"
        class="flex align-items-center ml-2 w-4rem h-1rem cursor-pointer"
      >
        <img
          src="/layout/images/emmd-logo.png"
          class="w-full h-auto"
          alt="PrimeVue"
        />
      </div>
    </div>
    <span class="mt-1 text-400 text-xs">Copyright © 2024</span>
  </div>
</template>
