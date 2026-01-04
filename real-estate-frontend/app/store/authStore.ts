import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../api/api-client";
import type { AuthState } from "../interface/auth.interface";
import { refreshClient } from "../api/refresh-client";

export type UserRole = "Admin" | "Landlord" | "Tenant";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  name: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      pendingEmail: null,
      loading: false,
      error: null,
      refreshToken: null,
      isInitialized: false,

      registerUser: async (data) => {
        try {
          set({ loading: true, error: null });
          const res = await apiClient.post("/auth/register", data);
          set({
            pendingEmail: data.email,
          });
          return res.data;
        } catch (err: unknown) {
          let errorMessage = "Registration failed";

          if (err && typeof err === "object" && "response" in err) {
            const error = err as {
              response?: { data?: { message?: string } };
              message?: string;
              code?: string;
              request?: { status?: number };
            };

            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (
              error.code === "ECONNABORTED" ||
              error.message?.includes("timeout")
            ) {
              errorMessage =
                "Request timeout - the server is not responding. Please try again.";
            } else if (error.request) {
              errorMessage =
                "Network error - unable to reach the server. Please check your connection.";
            }

            console.error(
              "Register error:",
              error.response?.data || error.message
            );
          } else {
            console.error("Register error:", err);
          }

          set({ error: errorMessage });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      verifyEmail: async (otp: string, email?: string) => {
        const emailToUse = email || get().pendingEmail;
        const res = await apiClient.post("/auth/verify-email", {
          otp,
          email: emailToUse,
        });
        return res?.data;
      },

      resendOtp: async (email: string) => {
        const emailToUse = email || get().pendingEmail;
        const res = await apiClient.post("/auth/resend-otp", {
          email: emailToUse,
        });
        return res?.data;
      },

      login: async (data) => {
        try {
          set({ loading: true, error: null });
          const res = await apiClient.post("/auth/login", data);

          const userRole = res.data.user.role;

          set({
            user: res.data.user,
            token: res.data.accessToken ?? null,
            refreshToken: res.data.refreshToken ?? null,
          });

          if (typeof document !== "undefined") {
            document.cookie = `user_role=${userRole}; path=/`;
          }
        } catch (err: unknown) {
          const error = err as {
            response?: { data?: { message?: string } };
            message?: string;
            code?: string;
            request?: { status?: number };
          };

          let errorMessage = "Login failed";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (
            error.code === "ECONNABORTED" ||
            error.message?.includes("timeout")
          ) {
            errorMessage =
              "Request timeout - the server is not responding. Please try again.";
          } else if (error.request) {
            errorMessage =
              "Network error - unable to reach the server. Please check your connection.";
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({ error: errorMessage });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout", {});
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({
            user: null,
            token: null,
            pendingEmail: null,
            refreshToken: null,
            isInitialized: true,
          });
          if (typeof document !== "undefined") {
            document.cookie =
              "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          }
        }
      },

      logoutAndRedirect: async (redirectTo: string = "/") => {
        try {
          await apiClient.post("/auth/logout", {});
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({
            user: null,
            token: null,
            pendingEmail: null,
            refreshToken: null,
            isInitialized: true,
          });
          if (typeof document !== "undefined") {
            document.cookie =
              "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            // Redirect to home page after logout
            window.location.href = redirectTo;
          }
        }
      },

      sendResetOtp: async (email) => {
        const res = await apiClient.post("/auth/forgot-password", { email });
        set({
          pendingEmail: email,
        });
        return res.data;
      },

      resetPassword: async (data) => {
        const res = await apiClient.post("/auth/reset-password", data);
        return res.data;
      },

      refreshTok: async () => {
        try {
          // Check if we have a user before attempting refresh
          const state = get();
          if (!state.user) {
            console.warn("No user found, skipping token refresh");
            return false;
          }

          // The refresh token is sent via HTTP-only cookie with withCredentials: true
          const res = (await Promise.race([
            refreshClient.post("/auth/refresh-token", {}),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Refresh timeout")), 5000)
            ),
          ])) as {
            data: { user?: User; accessToken?: string; refreshToken?: string };
          };

          set({
            user: res.data.user ?? get().user,
            token: res.data.accessToken ?? null,
            refreshToken: res.data.refreshToken ?? null,
          });
          console.log("Token refresh successful");
          return true;
        } catch (error: unknown) {
          const err = error as {
            response?: { status?: number; data?: { message?: string } };
            message?: string;
          };
          console.error("Token refresh failed:", error);

          // Check if it's a 401 or 403 error (invalid/expired refresh token)
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            console.warn(
              "Refresh token expired or invalid, logging out and redirecting to homepage"
            );
            await get().logoutAndRedirect("/");
          } else {
            console.warn(
              "Token refresh error but user will remain logged in:",
              err?.response?.data?.message || err.message
            );
            // Don't logout for other errors - keep user logged in with current token
          }
          return false;
        }
      },

      initializeAuth: async () => {
        try {
          // If user data exists in storage, try to refresh the token
          const state = get();
          if (state.user && state.token) {
            await state.refreshTok();
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          // Clear invalid tokens
          set({ user: null, token: null, refreshToken: null });
        } finally {
          set({ isInitialized: true });
        }
      },

      setUser: (user: User) => {
        set({ user, error: null });
        if (typeof document !== "undefined") {
          document.cookie = `user_role=${user.role}; path=/`;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        pendingEmail: state.pendingEmail,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
