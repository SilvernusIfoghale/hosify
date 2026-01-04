"use client";

import React, { useEffect } from "react";
import { TenantStatsCards } from "./components/tenant-stats-cards";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

const TenantDashboard = () => {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && (!user || user.role?.toLowerCase() !== "tenant")) {
      router.push("/");
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return null;
  }

  return (
    <main>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:space-y-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-gray-600 text-base sm:text-lg font-semibold">
                Manage your rentals, track activity, and stay verified
              </p>
              <p className="text-sm sm:text-base italic">
                Welcome,{" "}
                <span className="text-primary font-bold">
                  {user.name || user.email}
                </span>
              </p>
            </div>
          </div>

          <TenantStatsCards />
        </div>
      </div>
    </main>
  );
};

export default TenantDashboard;
