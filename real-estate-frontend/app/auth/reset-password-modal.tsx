"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../lib/auth-schemas";
import { Modal } from "../components/ui/modal";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onNavigateToLogin?: () => void;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onNavigateToLogin,
}: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: pendingEmail || "",
    },
  });

  React.useEffect(() => {
    reset({ email: pendingEmail || "" });
  }, [pendingEmail, reset]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await resetPassword(data);
      toast.success(
        (res !== undefined &&
        res !== null &&
        typeof res === "object" &&
        "message" in res
          ? (res as { message?: string }).message
          : undefined) || "successful!"
      );
      onClose();
      reset();
      onNavigateToLogin?.();
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(err.response?.data?.message || "Reset password failed");
      } else {
        toast.error((error as Error).message || "Reset password failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="pb-1.5">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className={errors.newPassword ? "border-red-500" : ""}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* <div>
            <Label htmlFor="email" className="pb-1.5">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div> */}

          <div>
            <Label htmlFor="otp" className="pb-1.5">
              OTP
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
              className={errors.otp ? "border-red-500" : ""}
            />
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </Modal>
  );
}
