import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import useSupabaseClient from "./useSupabaseClient";
import useSupabaseDB from "./useSupabaseDB";

const authResp = ref(null);

export default function useSupabaseAuth() {
  const authStore = useAuthStore();
  const { sbAuth } = useSupabaseClient();
  const { get, dbResp } = useSupabaseDB();

  sbAuth.onAuthStateChange((event, session) => {
    authResp.value = session;
    if (!authResp.value) {
      authStore.resetStore();
    } else {
      authStore.setIsAuthenticated(true);
      authStore.setSession(session);
      authStore.setUser(session.user);
    }
  });

  async function login({ email, password }) {
    let loginResp;
    try {
      loginResp = await sbAuth.signInWithPassword({ email, password });
      if (!loginResp.error) {
        authStore.setIsAuthenticated(true);
        authStore.setSession(loginResp.data.session);
        authStore.setUser(loginResp.data.user);

        getProfile(loginResp.data.user.id);
      }
      return loginResp;
    } catch (error) {
      return error;
    }
  }

  const register = async ({ email, password, name }) => {
    const registerResp = await sbAuth.signUp({ email, password });
    if (registerResp.error) {
      return registerResp;
    }
    const updateResp = await sbAuth.updateUser({ data: { name } });

    return updateResp;
  };

  const logout = () => {
    return sbAuth.signOut();
  };

  const getProfile = async (id) => {
    try {
      await get({ table: "profiles", id });

      if (dbResp.value) {
        authStore.setProfile(dbResp.value);
      } else {
        return {
          error: "Profile not found",
          status: 404,
        };
      }
    } catch (error) {
      return error;
    }
  };

  return {
    authResp,
    login,
    logout,
    register,
  };
}
