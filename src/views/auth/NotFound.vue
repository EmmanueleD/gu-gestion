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
          class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center border-round-md"
        >
          <img
            src="@/assets/img/logo-dark.svg"
            alt="Sakai logo"
            class="mb-5 w-6rem flex-shrink-0 border-round-md"
          />
          <span class="text-blue-500 font-bold text-3xl">404</span>
          <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
            Pagina no encontrada
          </h1>
          <div class="text-600 mb-5">
            Ops! Parece que la pagina que estas buscando no existe, o está en
            construcción...
          </div>
          <Button
            label="Volver atras"
            icon="pi pi-arrow-left"
            class="w-auto"
            @click="$router.go(-1)"
          />
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
