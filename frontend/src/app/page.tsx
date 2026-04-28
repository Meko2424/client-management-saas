"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getDashboardSummary } from "@/lib/dashboardApi";

type DashboardSummary = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  plannedProjects: number;
  completedProjects: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch {
        toast.error("Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">
              Overview of your clients and project activity.
            </p>
          </div>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : !summary ? (
            <p>No dashboard data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <MetricCard title="Total Clients" value={summary.totalClients} />
              <MetricCard
                title="Total Projects"
                value={summary.totalProjects}
              />
              <MetricCard title="Active" value={summary.activeProjects} />
              <MetricCard title="Planned" value={summary.plannedProjects} />
              <MetricCard title="Completed" value={summary.completedProjects} />
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
