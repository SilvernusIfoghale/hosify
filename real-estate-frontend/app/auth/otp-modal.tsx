"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Modal } from "../components/ui/modal";
import { type OtpFormData, otpSchema } from "../lib/auth-schemas";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLogin?: () => void;
  email?: string;
}

export function OtpModal({
  isOpen,
  onClose,
  onNavigateToLogin,
  email,
}: OtpModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [otpValues, setOtpValues] = React.useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const emailToUse = email || pendingEmail;

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  React.useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    const otpString = newValues.join("");
    setValue("otp", otpString);
    trigger("otp");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newValues = pastedData
      .split("")
      .concat(Array(6).fill(""))
      .slice(0, 6);
    setOtpValues(newValues);
    setValue("otp", pastedData);
    trigger("otp");

    const nextEmptyIndex = newValues.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      const res = await verifyEmail(data.otp, emailToUse ?? undefined);
      toast.success(
        (res !== undefined &&
        res !== null &&
        typeof res === "object" &&
        "message" in res
          ? (res as { message?: string }).message
          : undefined) || "Email verification successful."
      );
      reset();
      onClose();
      onNavigateToLogin?.();
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(err.response?.data?.message || "Failed to verify email");
      } else {
        toast.error((error as Error).message || "Failed to verify email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const res = await resendOtp(emailToUse || "");

      toast.success(
        (res !== undefined &&
        res !== null &&
        typeof res === "object" &&
        "message" in res
          ? (res as { message?: string }).message
          : undefined) || "Verification code sent successfully!."
      );
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          err.response?.data?.message || "Failed to resend validation OTP"
        );
      } else {
        toast.error(
          (error as Error).message || "Failed to resend validation OTP"
        );
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {emailToUse || "your email address"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Verification Code</Label>
            <div
              className="flex gap-2 justify-center mt-2"
              onPaste={handlePaste}
            >
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-lg font-semibold ${
                    errors.otp ? "border-red-500" : ""
                  }`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
