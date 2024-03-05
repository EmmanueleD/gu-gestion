import { ref } from "vue";
import useSupabaseClient from "./useSupabaseClient";

export default function useSupabaseAuth() {
  const supaAuthResp = ref({ data: null, error: null });

  const { sbAuth } = useSupabaseClient();

  sbAuth.onAuthStateChange(async (event, session) => {
    supaAuthResp.value = null;
    supaAuthResp.value = { data: null, error: null };

    return (supaAuthResp.value = { event, session });
  });

  async function supaSignIn({ email, password }) {
    supaAuthResp.value.error = null;
    supaAuthResp.value.data = null;

    try {
      const { data, error } = await sbAuth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        return data;
      } else {
        supaAuthResp.value.error = error;
      }
    } catch (error) {
      return error;
    }
  }

  async function supaSignUp({ email, password, name }) {
    supaAuthResp.value.error = null;
    supaAuthResp.value.data = null;

    try {
      const { data, error } = await sbAuth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (!error) {
        return data;
      } else {
        supaAuthResp.value.error = error;
      }
    } catch (error) {
      return error;
    }
  }

  async function supaSignOut() {
    try {
      const { error } = await sbAuth.signOut();
      if (!error) {
        return true;
      } else {
        supaAuthResp.value.error = error;
      }
    } catch (error) {
      return error;
    }
  }

  async function resetPasswordForEmail(email) {
    try {
      const { data, error } = await sbAuth.resetPasswordForEmail(email, {
        redirectTo: "https://gu-gestion.vercel.app/auth/password-change",
      });

      if (!error) {
        return data;
      } else {
        supaAuthResp.value.error = error;
      }
    } catch (error) {
      return error;
    }
  }

  async function updateUserPassword(newPassword) {
    try {
      const { data, error } = await sbAuth.updateUser({
        password: newPassword,
      });
      if (!error) {
        return data;
      } else {
        supaAuthResp.value.error = error;
      }
    } catch (error) {
      return error;
    }
  }

  return {
    supaAuthResp,
    supaSignIn,
    supaSignOut,
    supaSignUp,
    resetPasswordForEmail,
    updateUserPassword,
  };
}
