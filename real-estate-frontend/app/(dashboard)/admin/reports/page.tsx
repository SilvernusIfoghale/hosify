"use client";
import React, { useEffect, useState } from "react";
import { adminAPI, type Report } from "@/app/api/admin-client";

const Page: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await adminAPI.getReports();
        if (response.success) {
          setReports(response.reports);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (err) {
        setError("Error fetching reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Reports</h1>
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center text-gray-500">No reports found</div>
        ) : (
          reports.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 md:p-6 rounded shadow border"
            >
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-lg text-gray-900">
                  {r.property.title}
                </div>
                <div className="text-sm text-gray-600">
                  Reported by:{" "}
                  <span className="font-medium">{r.reporter.name}</span> (
                  {r.reporter.email})
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Reason:</span> {r.reason}
                </div>
                <div className="text-sm text-gray-500">
                  Reported on: {new Date(r.createdAt).toLocaleDateString()}
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
