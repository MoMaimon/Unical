"use client";
import { useState } from "react";

export default function SyncCoursesButton() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleSmartSync = async () => {
    setLoading(true);
    setProgress("Fetching college list...");

    try {
      const collegesRes = await fetch("/api/scrape/colleges");
      const result = await collegesRes.json();
      
      // Ensure we are grabbing the array (adjust based on your API structure)
      const collegeList = Array.isArray(result) ? result : result.data;

      if (!collegeList || !Array.isArray(collegeList)) {
        throw new Error("Could not find a valid list of colleges.");
      }

      for (let i = 0; i < collegeList.length; i++) {
        const college = collegeList[i];
        setProgress(`Syncing ${college.name || 'College'} (${i + 1} of ${collegeList.length})...`);

        const syncRes = await fetch(
          `/api/scrape/courses?college=${college._id}`,
          { method: "POST" }
        );

        if (!syncRes.ok) {
          const errorData = await syncRes.json();
          console.error(`Failed to sync ${college._id}:`, errorData.error);
        setProgress(`⚠️ Failed at ${college.name}`);
        }
      }

      setProgress("✅ All courses synced successfully!");
    } catch (err) {
      console.error("Sync error:", err);
      setProgress("❌ A critical error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <button
        onClick={handleSmartSync}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? "Syncing in progress..." : "Smart Sync All Courses"}
      </button>

      {progress && (
        <span className="text-sm text-gray-700 font-mono bg-gray-100 p-1 rounded">
          {progress}
        </span>
      )}
    </div>
  );
}