import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  const fetchProfile = async () => {
    if (!token.value) return;
    try {
      const res = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token.value}` }
      });
      if (res.ok) {
        user.value = await res.json();
      } else {
        // Token might be invalid
        if (res.status === 401 || res.status === 403) {
          token.value = null;
          localStorage.removeItem('token');
          user.value = null;
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải profile:", err);
    }
  };

  const login = (newToken, username) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    fetchProfile();
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem('token');
    user.value = null;
  };

  return { user, token, fetchProfile, login, logout };
});
