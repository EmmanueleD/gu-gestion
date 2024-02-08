import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFudoStore = defineStore("fudo", () => {
  const _profile = ref(
    JSON.parse(localStorage.getItem("gu_ge:fudo-profile")) || null
  );

  const profile = computed(() => _profile.value);

  function setProfile(profile) {
    _profile.value = profile;
    localStorage.setItem("gu_ge:fudo-profile", JSON.stringify(profile));
  }

  function resetStore() {
    localStorage.removeItem("gu_ge:fudo-profile");
    _profile.value = null;
  }

  return {
    profile,
    setProfile,
    resetStore,
  };
});
