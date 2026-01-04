export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: "tenant" | "landlord" | "admin";
}
export interface AuthState {
  user: User | null;
  token: string | null; // stored if backend provides it
  refreshToken: string | null; // stored if backend provides it
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
  pendingEmail: string | null;
  registerUser: (data: RegisterDTO) => Promise<void>;
  verifyEmail: (otp: string, email?: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAndRedirect: (redirectTo: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshTok: () => Promise<boolean>;
  sendResetOtp: (email: string) => Promise<void>;
  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => Promise<void>;
}
