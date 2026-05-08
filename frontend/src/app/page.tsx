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
import { getBillingStatus } from "@/lib/billingApi";

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

type BillingStatus = {
  subscriptionPlan: string;
  subscriptionStatus: string;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(
    null,
  );

  useEffect(() => {
    async function loadSummary() {
      try {
        const [summaryData, billingData] = await Promise.all([
          getDashboardSummary(),
          getBillingStatus(),
        ]);

        setSummary(summaryData);
        setBillingStatus(billingData);
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
  const isPro =
    billingStatus?.subscriptionPlan === "PRO" &&
    billingStatus?.subscriptionStatus === "ACTIVE";

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
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {isPro ? (
                    <>
                      <ChartCard title="Revenue Performance">
                        <div className="space-y-4">
                          <div className="rounded-lg bg-green-50 p-4">
                            <p className="text-sm text-green-700">
                              Paid Revenue
                            </p>
                            <p className="text-3xl font-bold text-green-800">
                              ${summary.paidRevenue.toFixed(2)}
                            </p>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-4">
                            <p className="text-sm text-blue-700">
                              Outstanding Revenue
                            </p>
                            <p className="text-3xl font-bold text-blue-800">
                              ${summary.outstandingRevenue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </ChartCard>

                      <ChartCard title="Business Health">
                        <div className="space-y-4">
                          <PremiumMetric
                            label="Invoice Collection Rate"
                            value={
                              summary.totalInvoices === 0
                                ? "0%"
                                : `${Math.round(
                                    (summary.paidInvoices /
                                      summary.totalInvoices) *
                                      100,
                                  )}%`
                            }
                          />

                          <PremiumMetric
                            label="Project Completion Rate"
                            value={
                              summary.totalProjects === 0
                                ? "0%"
                                : `${Math.round(
                                    (summary.completedProjects /
                                      summary.totalProjects) *
                                      100,
                                  )}%`
                            }
                          />

                          <PremiumMetric
                            label="Open Revenue"
                            value={`$${summary.outstandingRevenue.toFixed(2)}`}
                          />
                        </div>
                      </ChartCard>
                    </>
                  ) : (
                    <>
                      <LockedPremiumCard title="Revenue Performance" />
                      <LockedPremiumCard title="Business Health" />
                    </>
                  )}
                </div>
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

function PremiumMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function LockedPremiumCard({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          PRO FEATURE
        </div>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <p className="mt-3 text-sm text-slate-500">
          Upgrade to PRO to unlock advanced analytics and business insights.
        </p>

        <a
          href="/upgrade"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Upgrade to PRO
        </a>
      </div>
    </div>
  );
}
