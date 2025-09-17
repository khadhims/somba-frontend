import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  first_name?: string;
  last_name?: string;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  api_token?: string;
  access_token?: string;
  refresh_token?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref<any>({});
  const user = ref<User>({} as User);
  const refreshToken = ref<string | null>(null);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: any) {
    console.debug("[auth] setAuth called with:", authUser);
    isAuthenticated.value = true;

    // backend may return { access_token, refresh_token, user? }
    user.value = authUser.user ?? (authUser as User);
    errors.value = {};

    const token = authUser.access_token ?? authUser.api_token ?? null;
    if (token) {
      JwtService.saveToken(token);
      // ensure axios header is set for subsequent requests
      ApiService.setHeader();
    }

    if (authUser.refresh_token) {
      refreshToken.value = authUser.refresh_token;
      JwtService.saveRefreshToken(authUser.refresh_token);
    }
  }

  function setError(error: any) {
    // Normalize different error shapes from API
    if (!error) {
      errors.value = {};
      return;
    }

    // If API returns a top-level error string
    if (typeof error === "string") {
      errors.value = { error };
      return;
    }

    // If API returns { error: 'message' }
    if (error.error && typeof error.error === "string") {
      errors.value = { error: error.error };
      return;
    }

    // If API returns validation errors object or other structure
    errors.value = error || {};
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = {};
    refreshToken.value = null;
    JwtService.destroyToken();
    JwtService.destroyRefreshToken();
  }

  function login(credentials: { username: string; password: string }) {
    // API expects 'username' and 'password' — use email as username
    const payload = {
      username: credentials.username,
      password: credentials.password,
    };

    return ApiService.post("auth/login", payload)
      .then((response: any) => {
        console.debug("[auth] login raw response:", response);
        const data = response.data ?? response;
        console.debug("[auth] login data:", data);

        // Normalize nested response shapes (e.g., { data: { access_token: ... } })
        let resolved = data;
        // Unwrap a single nesting level if tokens are inside
        if (
          resolved &&
          resolved.data &&
          typeof resolved.data === "object" &&
          (resolved.data.access_token ||
            resolved.data.refresh_token ||
            resolved.data.api_token ||
            resolved.data.user)
        ) {
          resolved = resolved.data;
        }
        // Another safe unwrap if necessary
        if (
          resolved &&
          resolved.data &&
          typeof resolved.data === "object" &&
          (resolved.data.access_token ||
            resolved.data.refresh_token ||
            resolved.data.api_token ||
            resolved.data.user)
        ) {
          resolved = resolved.data;
        }

        console.debug("[auth] login resolved payload:", resolved);
        setAuth(resolved);
        return resolved;
      })
      .catch(({ response }) => {
        const payload = response?.data ?? { error: "Login failed" };
        setError(payload.errors ?? payload.error ?? payload);
        throw response;
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("auth/signup", credentials)
      .then(({ data }) => {
        setAuth(data);
        return data;
      })
      .catch(({ response }) => {
        const payload = response?.data ?? { error: "Registration failed" };
        setError(
          payload.errors ?? (payload.error ? { error: payload.error } : payload)
        );
        throw response;
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        const payload = response?.data ?? { error: "Request failed" };
        setError(payload.errors ?? payload.error ?? payload);
        throw response;
      });
  }

  // New: refresh tokens using refresh_token endpoint
  function refresh() {
    const rToken = JwtService.getRefreshToken();
    if (!rToken) return Promise.reject(new Error("No refresh token"));

    return ApiService.post("auth/refresh", { refresh_token: rToken })
      .then(({ data }: any) => {
        // normalize nested responses
        let resolved = data;
        if (resolved && resolved.data && typeof resolved.data === "object")
          resolved = resolved.data;
        console.debug("[auth] refresh resolved payload:", resolved);
        setAuth(resolved);
        return resolved;
      })
      .catch((err) => {
        purgeAuth();
        throw err;
      });
  }

  function verifyAuth() {
    const token = JwtService.getToken();
    if (!token) {
      purgeAuth();
      return Promise.reject(new Error("No token"));
    }

    // set header with stored token
    ApiService.setHeader();

    // Try a lightweight local JWT expiry check. If token is valid, keep session.
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp || payload.exp * 1000 > Date.now()) {
          // token still valid
          isAuthenticated.value = true;
          return Promise.resolve({ access_token: token });
        }
      }
    } catch (e) {
      // ignore parse errors and fall through to refresh attempt
    }

    // token expired or unknown — attempt refresh if we have a refresh token
    const r = JwtService.getRefreshToken();
    if (r) {
      return refresh();
    }

    // no refresh token available
    purgeAuth();
    return Promise.reject(new Error("Token expired and no refresh token"));
  }

  return {
    errors,
    user,
    isAuthenticated,
    refreshToken,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    refresh,
  };
});
