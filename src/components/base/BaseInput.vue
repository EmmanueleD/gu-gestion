<script setup>
defineProps({
  label: String,
  errorMessage: String,
  loading: Boolean,
  isHorizontal: Boolean,
});
</script>

<style scoped>
.form-group .label,
.form-group label {
  margin-top: 0 !important;
}
</style>

<template>
  <div class="mb-3">
    <div
      class="w-full flex"
      :class="{
        'flex-column': !isHorizontal,
        'align-items-center': isHorizontal,
      }"
    >
      <slot v-if="isHorizontal"></slot>
      <label :class="{ 'ml-2': isHorizontal, 'mb-2': !isHorizontal }">
        {{ label }}
      </label>
      <Skeleton v-if="loading"></Skeleton>
      <slot v-else-if="!isHorizontal"></slot>
    </div>
    <small v-if="errorMessage" class="p-error mt-2">{{ errorMessage }}</small>
  </div>
</template>
