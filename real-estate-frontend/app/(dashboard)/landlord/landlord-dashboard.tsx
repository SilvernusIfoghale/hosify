"use client";

import React from "react";
import { VerificationStatus } from "./components/verification-status";
import { StatsCards } from "./components/stats-cards";
import { useAuthStore } from "@/app/store/authStore";

const LandlordDashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;
  return (
    <main>
      <div className="min-h-screen ">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-gray-600 text-lg font-semibold">
                Manage your properties, track activity, and monitor performance
              </p>
              <p className=" mt-2 italic  ">
                Welcome,{" "}
                <span className="text-green-600 font-bold"> {user.role}</span>
              </p>
            </div>
            <VerificationStatus />
          </div>

          {/* Stats Overview */}
          <StatsCards />

          {/* Main Content Grid */}
          {/* <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <PropertiesOverview />
              <RecentActivity />
            </div>
            <div className="space-y-8">
              <ReviewsSection />
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default LandlordDashboard;
