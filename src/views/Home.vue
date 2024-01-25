<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
</script>

<template>
  <h1>Home</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <div class="flex flex-column align-items-center justify-content-center">
      <div class="flex align-items-center justify-content-center mb-5">
        <img
          src="@/assets/img/logo-dark.svg"
          alt="Sakai logo"
          class="w-6rem flex-shrink-0 border-round-md mr-4"
        />
        <span class="text-900 font-bold text-7xl">gestión</span>
      </div>

      <!-- <h1>BENVENUTO DC</h1> -->

      <div class="flex flex-column align-items-stretch">
        <div
          v-if="authStore.profile"
          class="w-full py-6 px-3 sm:px-6 flex flex-column align-items-center border-round-md"
        >
          <span>
            Hola {{ authStore.profile?.username }}
            <i class="pi pi-user ml-2"></i
          ></span>
        </div>

        <div v-else class="flex flex-column align-items-center gap-3">
          <span class="block text-red-400 font-medium">
            Parece que expiró tu sesión
          </span>
          <span class="block text-red-400 font-medium">
            Por favor, cierra la sesión y vuelve a iniciar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
