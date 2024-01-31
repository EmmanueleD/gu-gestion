import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _session = ref(
    JSON.parse(localStorage.getItem("gu_ge:session")) || null
  );
  const _user = ref(JSON.parse(localStorage.getItem("gu_ge:user")) || null);
  const _profile = ref(
    JSON.parse(localStorage.getItem("gu_ge:profile")) || null
  );
  const _isAuthenticated = ref(
    JSON.parse(localStorage.getItem("gu_ge:isAuthenticated")) || false
  );

  const session = computed(() => _session.value);
  const user = computed(() => _user.value);
  const profile = computed(() => _profile.value);
  const isAuthenticated = computed(() => _isAuthenticated.value);

  function setSession(session) {
    _session.value = session;
    localStorage.setItem("gu_ge:session", JSON.stringify(session));
  }

  function setUser(user) {
    _user.value = user;
    localStorage.setItem("gu_ge:user", JSON.stringify(user));
  }

  function setProfile(profile) {
    _profile.value = profile;
    localStorage.setItem("gu_ge:profile", JSON.stringify(profile));
  }

  function setIsAuthenticated(isAuthenticated) {
    _isAuthenticated.value = isAuthenticated;
    localStorage.setItem(
      "gu_ge:isAuthenticated",
      JSON.stringify(isAuthenticated)
    );
  }

  function resetStore() {
    _session.value = null;
    _user.value = null;
    _isAuthenticated.value = false;

    localStorage.removeItem("gu_ge:profile");
    localStorage.removeItem("gu_ge:isAuthenticated");
    localStorage.removeItem("gu_ge:session");
    localStorage.removeItem("gu_ge:user");
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
