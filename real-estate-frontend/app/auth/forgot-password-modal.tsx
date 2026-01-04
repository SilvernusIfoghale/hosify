"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../lib/auth-schemas";
import { Modal } from "../components/ui/modal";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReset: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onNavigateToReset,
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const sendResetOtp = useAuthStore((state) => state.sendResetOtp);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await sendResetOtp(data?.email);
      toast.success(
        (res !== undefined &&
        res !== null &&
        typeof res === "object" &&
        "message" in res
          ? (res as { message?: string }).message
          : undefined) || "successful!"
      );
      onNavigateToReset();
      reset();
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(err.response?.data?.message || "Failed to reset password");
      } else {
        toast.error((error as Error).message || "Failed to reset password");
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
            Forgot your password?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Please enter your email address, and we&apos;ll send you a link to
            change your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="pb-1.5">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
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
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
