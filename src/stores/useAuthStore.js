import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _session = ref(null);
  const _user = ref(null);
  const _profile = ref(null);
  const _isAuthenticated = ref(false);

  const session = computed(() => _session.value);
  const user = computed(() => _user.value);
  const profile = computed(() => _profile.value);
  const isAuthenticated = computed(() => _isAuthenticated.value);

  function setSession(session) {
    _session.value = session;
  }
  function setUser(user) {
    _user.value = user;
  }

  function setProfile(profile) {
    _profile.value = profile;
  }

  function setIsAuthenticated(isAuthenticated) {
    _isAuthenticated.value = isAuthenticated;
  }

  function resetStore() {
    _session.value = null;
    _user.value = null;
    _isAuthenticated.value = false;
  }

  return {
    session,
    user,
    profile,
    isAuthenticated,
    setSession,
    setUser,
    setProfile,
    setIsAuthenticated,
    resetStore,
  };
});
