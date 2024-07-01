import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";

export function useSignUp() {
  return useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      const result = await supabase.auth.signUp(variables);

      if (result.error !== null) {
        throw new Error("Error signing up.");
      }

      return result.data;
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      const result = await supabase.auth.signInWithPassword(variables);

      if (result.error !== null) {
        throw new Error("Error signing in.");
      }

      return result.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (variables: { email: string }) => {
      const result = await supabase.auth.resetPasswordForEmail(variables.email);

      if (result.error !== null) {
        throw new Error("Error resetting password.");
      }

      return result.data;
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (variables: { password: string }) => {
      const result = await supabase.auth.updateUser(variables);

      if (result.error !== null) {
        throw new Error("Error updating password.");
      }

      return result.data;
    },
  });
}
