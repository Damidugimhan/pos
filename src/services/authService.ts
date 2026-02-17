import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const authService = {
  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuthStore.getState().setProfile(null);
  },
  async loadProfile() {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    const user = userData.user;
    if (!user) return null;
    const { data, error } = await supabase.from('users').select('id, full_name, role').eq('id', user.id).single();
    if (error) throw error;
    useAuthStore.getState().setProfile(data);
    return data;
  }
};
