"use client";

import { create } from "zustand";

interface AuthModalState {
  loginOpen: boolean;
  signupOpen: boolean;
  forgotPasswordOpen: boolean;
  resetPasswordOpen: boolean;
  otpOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  openForgotPassword: () => void;
  openResetPassword: () => void;
  openOtp: () => void;
  closeAll: () => void;
  switchToLogin: () => void;
  switchToSignup: () => void;
  switchToForgotPassword: () => void;
  switchToResetPassword: () => void;
  switchToOtp: () => void;
}

export const useAuthModals = create<AuthModalState>((set) => ({
  loginOpen: false,
  signupOpen: false,
  forgotPasswordOpen: false,
  resetPasswordOpen: false,
  otpOpen: false,
  openLogin: () =>
    set({
      loginOpen: true,
      signupOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  openSignup: () =>
    set({
      signupOpen: true,
      loginOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  openForgotPassword: () =>
    set({
      forgotPasswordOpen: true,
      loginOpen: false,
      signupOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  openResetPassword: () =>
    set({
      resetPasswordOpen: true,
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      otpOpen: false,
    }),
  openOtp: () =>
    set({
      otpOpen: true,
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
    }),
  closeAll: () =>
    set({
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  switchToLogin: () =>
    set({
      loginOpen: true,
      signupOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  switchToSignup: () =>
    set({
      signupOpen: true,
      loginOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  switchToForgotPassword: () =>
    set({
      forgotPasswordOpen: true,
      loginOpen: false,
      signupOpen: false,
      resetPasswordOpen: false,
      otpOpen: false,
    }),
  switchToResetPassword: () =>
    set({
      resetPasswordOpen: true,
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      otpOpen: false,
    }),
  switchToOtp: () =>
    set({
      otpOpen: true,
      loginOpen: false,
      signupOpen: false,
      forgotPasswordOpen: false,
      resetPasswordOpen: false,
    }),
}));
