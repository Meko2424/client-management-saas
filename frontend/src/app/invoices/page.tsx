"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  getClients,
  getProjects,
} from "@/lib/clientApi";

type Invoice = {
  id: number;
  amount: number;
  status: string;
  clientName: string;
  projectName?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [clientId, setClientId] = useState<number | "">("");
  const [projectId, setProjectId] = useState<number | "">("");

  async function loadData() {
    try {
      const [inv, cli, proj] = await Promise.all([
        getInvoices(),
        getClients(),
        getProjects(),
      ]);

      setInvoices(inv);
      setClients(cli);
      setProjects(proj);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: any) {
    e.preventDefault();

    if (!clientId || !amount) {
      toast.error("Client and amount required");
      return;
    }

    try {
      const newInvoice = await createInvoice({
        clientId,
        projectId: projectId || null,
        amount: Number(amount),
      });

      setInvoices((prev) => [newInvoice, ...prev]);

      toast.success("Invoice created");

      setAmount("");
      setClientId("");
      setProjectId("");
    } catch {
      toast.error("Failed to create invoice");
    }
  }

  async function changeStatus(id: number, status: string) {
    try {
      const updated = await updateInvoiceStatus(id, status);

      setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "SENT":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const totalRevenue = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Invoices</h1>

          {/* Revenue */}
          <div className="mb-6 bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Create Invoice</h2>

              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <select
                  className="w-full border p-2 rounded"
                  value={clientId}
                  onChange={(e) => setClientId(Number(e.target.value))}
                >
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full border p-2 rounded"
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                >
                  <option value="">Optional project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                  Create
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Invoice List</h2>

              {loading ? (
                <p>Loading...</p>
              ) : invoices.length === 0 ? (
                <p>No invoices yet.</p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((i) => (
                    <div
                      key={i.id}
                      className="border p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">${i.amount}</p>
                        <p className="text-sm text-gray-500">{i.clientName}</p>
                        {i.projectName && (
                          <p className="text-xs text-gray-400">
                            {i.projectName}
                          </p>
                        )}

                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            i.status,
                          )}`}
                        >
                          {i.status}
                        </span>
                      </div>

                      <select
                        value={i.status}
                        onChange={(e) => changeStatus(i.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
