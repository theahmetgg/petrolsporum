import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "petrolspor_auth_token";
const REFRESH_TOKEN_KEY = "petrolspor_refresh_token";
const USER_KEY = "petrolspor_auth_user";

export const storage = {
  saveToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Token kaydedilemedi:", error);
    }
  },

  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Token okunamadı:", error);
      return null;
    }
  },

  saveRefreshToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Refresh token kaydedilemedi:", error);
    }
  },

  getRefreshToken: async () => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Refresh token okunamadı:", error);
      return null;
    }
  },

  saveUser: async (user: any) => {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Kullanıcı kaydedilemedi:", error);
    }
  },

  getUser: async () => {
    try {
      const raw = await SecureStore.getItemAsync(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Kullanıcı okunamadı:", error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
    }
  },

  removeTokens: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error("Tokenlar silinemedi:", error);
    }
  },
  
  removeToken: async () => { // Backward compatibility
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  setItem: async (key: string, value: string) => {
    try {
      const validKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
      await SecureStore.setItemAsync(validKey, value);
    } catch (error) {
      console.error("Storage setItem error:", error);
    }
  },

  getItem: async (key: string) => {
    try {
      const validKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
      return await SecureStore.getItemAsync(validKey);
    } catch {
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      const validKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
      await SecureStore.deleteItemAsync(validKey);
    } catch (error) {
      console.error("Storage removeItem error:", error);
    }
  },
};
