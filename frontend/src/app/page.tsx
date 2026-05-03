"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getDashboardSummary } from "@/lib/dashboardApi";

type DashboardSummary = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  plannedProjects: number;
  completedProjects: number;
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  paidInvoices: number;
  paidRevenue: number;
  outstandingRevenue: number;
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

  const projectStatusData = summary
    ? [
        { name: "Planned", value: summary.plannedProjects },
        { name: "Active", value: summary.activeProjects },
        { name: "Completed", value: summary.completedProjects },
      ]
    : [];

  const invoiceStatusData = summary
    ? [
        { name: "Draft", value: summary.draftInvoices },
        { name: "Sent", value: summary.sentInvoices },
        { name: "Paid", value: summary.paidInvoices },
      ]
    : [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">
              Track your clients, projects, invoices, and revenue.
            </p>
          </div>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : !summary ? (
            <p>No dashboard data available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Total Clients"
                  value={summary.totalClients}
                />
                <MetricCard
                  title="Total Projects"
                  value={summary.totalProjects}
                />
                <MetricCard
                  title="Total Invoices"
                  value={summary.totalInvoices}
                />
                <MetricCard
                  title="Paid Revenue"
                  value={`$${summary.paidRevenue.toFixed(2)}`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <MetricCard
                  title="Outstanding Revenue"
                  value={`$${summary.outstandingRevenue.toFixed(2)}`}
                />
                <MetricCard
                  title="Active Projects"
                  value={summary.activeProjects}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard title="Project Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {projectStatusData.map((_, index) => (
                          <Cell key={`project-cell-${index}`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Invoice Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {invoiceStatusData.map((_, index) => (
                          <Cell key={`invoice-cell-${index}`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
