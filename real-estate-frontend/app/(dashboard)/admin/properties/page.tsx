"use client";
import React, { useEffect, useState } from "react";
import { adminAPI, type Property } from "@/app/api/admin-client";

const Page: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const response = await adminAPI.getPendingListings();
      if (response.success) {
        setProperties(response.properties);
      } else {
        setError("Failed to fetch pending properties");
      }
    } catch (err) {
      setError("Error fetching pending properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId: string) => {
    setActionLoading(propertyId);
    try {
      const response = await adminAPI.approveListing(propertyId);
      if (response.success) {
        // Refresh the properties list
        await fetchPendingProperties();
      } else {
        alert("Failed to approve property");
      }
    } catch (err) {
      alert("Error approving property");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProperty = async (propertyId: string) => {
    setActionLoading(propertyId);
    try {
      const response = await adminAPI.rejectListing(propertyId);
      if (response.success) {
        // Refresh the properties list
        await fetchPendingProperties();
      } else {
        alert("Failed to reject property");
      }
    } catch (err) {
      alert("Error rejecting property");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading pending properties...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Pending Properties</h1>
      <div className="grid gap-4">
        {properties.length === 0 ? (
          <div className="text-center text-gray-500">No pending properties</div>
        ) : (
          properties.map((p) => (
            <div key={p._id} className="bg-white p-4 md:p-6 rounded shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="font-semibold text-lg mb-2">{p.title}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {p.description}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Landlord: {p.landlord?.name} ({p.landlord?.email})
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted:{" "}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end space-y-2 md:ml-4">
                  <div className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800 mb-2">
                    {p.status}
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleApproveProperty(p._id)}
                      disabled={actionLoading === p._id}
                      className="flex-1 md:flex-none px-3 py-2 rounded bg-green-100 hover:bg-green-200 disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === p._id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleRejectProperty(p._id)}
                      disabled={actionLoading === p._id}
                      className="flex-1 md:flex-none px-3 py-2 rounded bg-red-100 hover:bg-red-200 disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === p._id ? "..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
