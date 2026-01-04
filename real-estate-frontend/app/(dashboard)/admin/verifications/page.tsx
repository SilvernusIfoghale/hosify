"use client";
import React, { useEffect, useState } from "react";
import { adminAPI, type Verification } from "@/app/api/admin-client";
import { showToast } from "@/app/utils/toast";

const Page = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await adminAPI.listVerifications("pending");
      if (response.success) {
        setVerifications(response.items);
      } else {
        showToast.error("Failed to fetch verifications");
      }
    } catch {
      showToast.error("Error fetching verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewVerification = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    setActionLoading(id);
    try {
      const response = await adminAPI.reviewVerification(id, action);
      if (response.success) {
        showToast.success(
          `Verification ${action}ed successfully. Users page will show the updated status.`
        );
        await fetchVerifications();
      } else {
        showToast.error(`Failed to ${action} verification`);
      }
    } catch {
      showToast.error(`Error ${action}ing verification`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading verifications...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Verifications</h1>
      <div className="space-y-3">
        {verifications.length === 0 ? (
          <div className="text-center text-gray-500">
            No pending verifications
          </div>
        ) : (
          verifications.map((v) => (
            <div key={v._id} className="bg-white p-4 md:p-6 rounded shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="font-semibold text-lg mb-2">
                    {v.user.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Email: {v.user.email}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Role: {v.roleAtSubmission}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Submitted: {new Date(v.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    ID Type: {v.idType}
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col md:space-y-2 md:space-x-0 md:ml-4">
                  <button
                    onClick={() => handleReviewVerification(v._id, "approve")}
                    disabled={actionLoading === v._id}
                    className="flex-1 md:flex-none px-4 py-2 rounded bg-green-100 hover:bg-green-200 disabled:opacity-50 font-medium"
                  >
                    {actionLoading === v._id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReviewVerification(v._id, "reject")}
                    disabled={actionLoading === v._id}
                    className="flex-1 md:flex-none px-4 py-2 rounded bg-red-100 hover:bg-red-200 disabled:opacity-50 font-medium"
                  >
                    {actionLoading === v._id ? "..." : "Reject"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">ID Documents:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {v.idDocuments.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {doc.label}
                    </a>
                  ))}
                </div>
              </div>

              {v.proofOfOwnership && v.proofOfOwnership.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Proof of Ownership:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {v.proofOfOwnership.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {doc.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
