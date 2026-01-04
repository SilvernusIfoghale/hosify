"use client";
import React, { useEffect, useState } from "react";
import { adminAPI, type User } from "@/app/api/admin-client";
import { showToast } from "@/app/utils/toast";
import { useAuthStore } from "@/app/store/authStore";

interface UserWithVerification extends User {
  verification: {
    _id: string;
    status: string;
    idType: string;
    roleAtSubmission: string;
    submittedAt: Date;
    reviewedAt?: Date;
    notes?: string;
  } | null;
}

const Page: React.FC = () => {
  const { user, isInitialized } = useAuthStore();
  const [users, setUsers] = useState<UserWithVerification[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && user && user.role?.toLowerCase() === "admin") {
      fetchUsers();
    } else if (isInitialized) {
      setLoading(false);
    }
  }, [isInitialized, user]);

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await adminAPI.getUsersWithVerificationStatus();
      if (response.success) {
        setUsers(response.users);
        setTotalUsers(response.totalUsers);
        setVerifiedUsers(response.verifiedUsers);
      } else {
        showToast.error("Failed to fetch users");
      }
    } catch {
      showToast.error("Error fetching users");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await adminAPI.suspendUser(userId);
      if (response.success) {
        showToast.success("User suspended successfully");
        await fetchUsers(true);
      } else {
        showToast.error("Failed to suspend user");
      }
    } catch {
      showToast.error("Error suspending user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(userId);
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        showToast.success("User deleted successfully");
        await fetchUsers(true);
      } else {
        showToast.error("Failed to delete user");
      }
    } catch {
      showToast.error("Error deleting user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <div className="text-xl font-bold">Access Denied</div>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Users Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage and monitor all registered users
          </p>
        </div>
        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {refreshing && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 md:p-5 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="text-gray-600 text-xs md:text-sm font-medium">
            Total Users
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {totalUsers}
          </div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-lg shadow border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="text-gray-600 text-xs md:text-sm font-medium">
            Verified Users
          </div>
          <div className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
            {verifiedUsers}
          </div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-lg shadow border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <div className="text-gray-600 text-xs md:text-sm font-medium">
            Verification Rate
          </div>
          <div className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">
            {totalUsers > 0
              ? Math.round((verifiedUsers / totalUsers) * 100)
              : 0}
            %
          </div>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-lg shadow border-l-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="text-gray-600 text-xs md:text-sm font-medium">
            Not Verified
          </div>
          <div className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
            {totalUsers - verifiedUsers}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden xl:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {u.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{u.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.accountStatus === "suspended"
                          ? "bg-red-100 text-red-800"
                          : u.verification &&
                            u.verification.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : u.verification &&
                            u.verification.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : u.verification &&
                            u.verification.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.accountStatus === "suspended"
                        ? "Suspended"
                        : u.verification && u.verification.status === "approved"
                        ? "Verified"
                        : u.verification && u.verification.status === "pending"
                        ? "Verification Pending"
                        : u.verification && u.verification.status === "rejected"
                        ? "Verification Rejected"
                        : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.verification ? (
                      <div className="text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.verification.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : u.verification.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.verification.status.charAt(0).toUpperCase() +
                            u.verification.status.slice(1)}
                        </span>
                        <p className="text-gray-500 text-xs mt-1">
                          {u.verification.idType}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No submission
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSuspendUser(u._id)}
                        disabled={actionLoading === u._id}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === u._id ? "..." : "Suspend"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={actionLoading === u._id}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === u._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet and Mobile Card View */}
      <div className="xl:hidden space-y-3 md:space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 md:p-5 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg text-gray-900">
                    {u.name}
                  </h3>
                  <p className="text-gray-600 text-sm break-all">{u.email}</p>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.accountStatus === "suspended"
                      ? "bg-red-100 text-red-800"
                      : u.verification && u.verification.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : u.verification && u.verification.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : u.verification && u.verification.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {u.accountStatus === "suspended"
                    ? "Suspended"
                    : u.verification && u.verification.status === "approved"
                    ? "Verified"
                    : u.verification && u.verification.status === "pending"
                    ? "Verification Pending"
                    : u.verification && u.verification.status === "rejected"
                    ? "Verification Rejected"
                    : "Not Verified"}
                </span>
              </div>

              {/* Verification Details */}
              {u.verification && (
                <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Verification Details
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.verification.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : u.verification.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.verification.status.charAt(0).toUpperCase() +
                          u.verification.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ID Type:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {u.verification.idType}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSuspendUser(u._id)}
                disabled={actionLoading === u._id}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 transition-colors"
              >
                {actionLoading === u._id ? "..." : "Suspend"}
              </button>
              <button
                onClick={() => handleDeleteUser(u._id)}
                disabled={actionLoading === u._id}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 transition-colors"
              >
                {actionLoading === u._id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default Page;
