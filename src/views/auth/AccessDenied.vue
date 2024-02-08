<script setup>
function navigateTo(url) {
  window.open(url, "_blank");
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
          <div class="grid flex flex-column align-items-center">
            <img
              src="@/assets/img/logo-dark.svg"
              alt="Sakai logo"
              class="mb-5 w-6rem flex-shrink-0 border-round-md"
            />
            <div
              class="flex justify-content-center align-items-center bg-red-700 border-circle"
              style="width: 3.2rem; height: 3.2rem"
            >
              <i class="text-50 pi pi-fw pi-lock text-2xl"></i>
            </div>
            <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">
              Acceso denegado
            </h1>
            <span class="text-600 mb-5"
              >No tienes permisos para acceder a esta página</span
            >
            <div class="col-12 mt-5 text-center">
              <i
                class="pi pi-fw pi-arrow-left text-blue-500 mr-2"
                style="vertical-align: center"
              ></i>
              <router-link to="/" class="text-blue-500"
                >Vuelve atras</router-link
              >
            </div>
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
    <span class="mt-1 text-400 text-xs text-center">Copyright © 2024</span>
  </div>
</template>
