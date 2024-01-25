<script setup>
// console.log("env: ", import.meta.env);

// import useSupabaseClient from "@/composables/useSupabaseClient";

// const { sbAuth, sbStorage, sbDB } = useSupabaseClient();

// console.log(sbAuth, sbStorage, sbDB("base"));
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast></Toast>
  <router-view />
</template>
