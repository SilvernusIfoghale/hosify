"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "../lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Modal } from "../components/ui/modal";
import Link from "next/link";
import { RegisterDTO } from "../interface/auth.interface";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useAuthModals } from "../hooks/use-auth-modals";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignupModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const registerUser = useAuthStore((state) => state.registerUser);
  const { switchToOtp } = useAuthModals();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const payload: RegisterDTO = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: data.userType,
      };

      const res = await registerUser(payload);

      toast.success(
        (res !== undefined &&
        res !== null &&
        typeof res === "object" &&
        "message" in res
          ? (res as { message?: string }).message
          : undefined) || "Signup successful! Please verify your email."
      );
      setSignupEmail(data.email);
      reset();
      switchToOtp();
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(err.response?.data?.message || "Signup failed");
      } else {
        toast.error((error as Error).message || "Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Or,{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              sign into your account
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="pb-1.5">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="pb-1.5">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="pb-1.5">
              Email Address
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
          <div>
            <Label htmlFor="password" className="pb-1.5">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Message and data rates may apply. By submitting your phone number,
            you consent to being contacted by{" "}
            <Link href="#" className="text-blue-600 hover:text-blue-500">
              Housify.com
            </Link>
          </p>

          <div>
            <Label className="text-sm font-medium">I am a:</Label>
            <div className="flex space-x-6 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="tenant"
                  value="tenant"
                  {...register("userType")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="tenant" className="text-sm">
                  Tenant
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="landlord"
                  value="landlord"
                  {...register("userType")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="landlord" className="text-sm">
                  Landlord
                </Label>
              </div>
            </div>
            {errors.userType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userType.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Signup with Google  */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                Or continue with:
              </span>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => console.log("Google signup")}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div> */}

        <p className="text-xs text-gray-500 text-center mt-6">
          By registering, I accept the Apartments.com{" "}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Terms of Use
          </a>
        </p>
      </div>
    </Modal>
  );
}
