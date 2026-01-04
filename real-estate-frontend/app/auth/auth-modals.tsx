"use client";

import { LoginModal } from "./login-modal";
import { SignupModal } from "./signup-modal";
import { ForgotPasswordModal } from "./forgot-password-modal";
import { ResetPasswordModal } from "./reset-password-modal";
import { useAuthModals } from "../hooks/use-auth-modals";
import { OtpModal } from "./otp-modal";
import React from "react";

export function AuthModals() {
  const {
    loginOpen,
    signupOpen,
    forgotPasswordOpen,
    resetPasswordOpen,
    otpOpen,
    closeAll,
    switchToLogin,
    switchToSignup,
    switchToForgotPassword,
    switchToResetPassword,
  } = useAuthModals();

  const [userEmail, setUserEmail] = React.useState<string>("");

  const handleOtpVerificationComplete = () => {
    console.log("Account verification completed for:", userEmail);
    setUserEmail("");
    switchToLogin();
  };

  return (
    <>
      <LoginModal
        isOpen={loginOpen}
        onClose={closeAll}
        onSwitchToSignup={switchToSignup}
        onSwitchToForgotPassword={switchToForgotPassword}
      />
      <SignupModal
        isOpen={signupOpen}
        onClose={closeAll}
        onSwitchToLogin={switchToLogin}
      />
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={closeAll}
        onNavigateToReset={switchToResetPassword}
      />
      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        onClose={closeAll}
        onSwitchToLogin={switchToLogin}
        onNavigateToLogin={switchToLogin}
      />
      <OtpModal
        isOpen={otpOpen}
        onClose={closeAll}
        onNavigateToLogin={handleOtpVerificationComplete}
        email={userEmail}
      />
    </>
  );
}
