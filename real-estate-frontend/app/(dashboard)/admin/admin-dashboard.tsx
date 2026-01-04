"use client";

import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { adminAPI, type Analytics } from "@/app/api/admin-client";

const AdminDashboard = () => {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && (!user || user.role?.toLowerCase() !== "admin")) {
      // router.push("/");
    }
  }, [user, isInitialized, router]);

  useEffect(() => {
    // Only fetch if user is authenticated and is an admin
    if (!isInitialized || !user || user.role?.toLowerCase() !== "admin") {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAnalytics();

        if (response.success && response.data) {
          setAnalytics(response.data);
        } else {
          setError("Failed to fetch analytics");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Error fetching analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <div className="text-xl font-bold">Access Denied</div>
        <p>You must be an admin to view this page.</p>
        <p className="text-sm text-gray-500 mt-2">
          Current Role: {user?.role || "None"}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const stats = analytics
    ? [
        { title: "Total Users", value: analytics.totalUsers ?? 0 },
        { title: "Total Listings", value: analytics.totalListings ?? 0 },
        { title: "Approved Listings", value: analytics.approvedListings ?? 0 },
        { title: "Pending Listings", value: analytics.pendingListings ?? 0 },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome, {user?.name || user?.email}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.length > 0 ? (
          stats.map((s) => (
            <div
              key={s.title}
              className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300"
            >
              <div className="text-sm text-gray-500">{s.title}</div>
              <div className="text-3xl font-bold text-gray-800">{s.value}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No analytics data available</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
