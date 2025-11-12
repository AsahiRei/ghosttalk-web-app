import { createClient } from "./client";

export class Auth {
  static async signInWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  }
  static async signUpWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { data, error: insertError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (insertError) {
      throw insertError;
    }
    const { error: userError } = await supabase.from("users").insert({
      id: data?.user?.id,
      email,
    });
    if (userError) {
      throw userError;
    }
  }
  static async signOutFromAccount() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
}
