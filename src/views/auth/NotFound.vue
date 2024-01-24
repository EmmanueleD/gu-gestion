<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
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
  </div>
</template>
