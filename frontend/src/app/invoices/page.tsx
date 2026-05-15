"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getClients,
  getProjects,
} from "@/lib/clientApi";
import { showError, showSuccess } from "@/lib/toastUtils";
import { ListSkeleton } from "@/components/LoadingStates";

type Invoice = {
  id: number;
  amount: number;
  status: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  clientName: string;
  projectName?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [status, setStatus] = useState("DRAFT");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

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
    } catch (error) {
      showError(error, "Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEditInvoice(invoice: Invoice) {
    setEditingInvoiceId(invoice.id);
    setAmount(String(invoice.amount || ""));
    setStatus(invoice.status || "DRAFT");
    setIssueDate(invoice.issueDate || "");
    setDueDate(invoice.dueDate || "");
    setNotes(invoice.notes || "");

    const matchingClient = clients.find(
      (client) => client.name === invoice.clientName,
    );

    const matchingProject = projects.find(
      (project) => project.name === invoice.projectName,
    );

    setClientId(matchingClient ? matchingClient.id : "");
    setProjectId(matchingProject ? matchingProject.id : "");
  }

  function handleCancelEdit() {
    setEditingInvoiceId(null);
    setAmount("");
    setStatus("DRAFT");
    setIssueDate("");
    setDueDate("");
    setNotes("");
    setClientId("");
    setProjectId("");
  }

  async function handleSaveInvoice(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId || !amount) {
      showError(null, "Client and amount required");
      return;
    }

    const payload = {
      clientId,
      projectId: projectId || null,
      amount: Number(amount),
      status,
      issueDate: issueDate || null,
      dueDate: dueDate || null,
      notes,
    };

    try {
      if (editingInvoiceId) {
        const updated = await updateInvoice(editingInvoiceId, payload);

        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === editingInvoiceId ? updated : invoice,
          ),
        );

        showSuccess("Invoice updated successfully!");
      } else {
        const newInvoice = await createInvoice(payload);

        setInvoices((prev) => [newInvoice, ...prev]);

        showSuccess("Invoice created successfully!");
      }

      handleCancelEdit();
    } catch (error) {
      showError(error, "Unable to save invoice. Please try again.");
    }
  }

  async function handleDeleteInvoice(id: number) {
    if (!confirm("Delete this invoice?")) return;

    try {
      await deleteInvoice(id);

      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));

      showSuccess("Invoice deleted successfully!");
    } catch (error) {
      showError(error, "Failed to delete invoice. Please try again.");
    }
  }

  async function changeStatus(id: number, status: string) {
    try {
      const updated = await updateInvoiceStatus(id, status);

      setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));

      showSuccess("Status updated successfully!");
    } catch (error) {
      showError(error, "Failed to update status. Please try again.");
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
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-3xl font-bold">Invoices</h1>

          <div className="mb-6 rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 font-semibold">
                {editingInvoiceId ? "Edit Invoice" : "Create Invoice"}
              </h2>

              <form onSubmit={handleSaveInvoice} className="space-y-4">
                <input
                  className="w-full rounded border p-2"
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <select
                  className="w-full rounded border p-2"
                  value={clientId}
                  onChange={(e) =>
                    setClientId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded border p-2"
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Optional project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded border p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="PAID">Paid</option>
                </select>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Issue Date
                  </label>
                  <input
                    className="w-full rounded border p-2"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Due Date
                  </label>
                  <input
                    className="w-full rounded border p-2"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <textarea
                  className="w-full rounded border p-2"
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <button className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
                  {editingInvoiceId ? "Update Invoice" : "Create Invoice"}
                </button>

                {editingInvoiceId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded bg-slate-500 py-2 text-white hover:bg-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
              <h2 className="mb-4 font-semibold">Invoice List</h2>

              {loading ? (
                <ListSkeleton rows={4} />
              ) : invoices.length === 0 ? (
                <p>No invoices yet.</p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((i) => (
                    <div key={i.id} className="rounded border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold">
                            ${Number(i.amount).toFixed(2)}
                          </p>

                          <p className="text-sm text-gray-500">
                            {i.clientName}
                          </p>

                          {i.projectName && (
                            <p className="text-xs text-gray-400">
                              Project: {i.projectName}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                            {i.issueDate && (
                              <span className="rounded bg-gray-100 px-2 py-1">
                                Issued: {i.issueDate}
                              </span>
                            )}

                            {i.dueDate && (
                              <span className="rounded bg-gray-100 px-2 py-1">
                                Due: {i.dueDate}
                              </span>
                            )}
                          </div>

                          {i.notes && (
                            <p className="mt-2 text-xs text-gray-500">
                              Notes: {i.notes}
                            </p>
                          )}

                          <span
                            className={`mt-2 inline-block rounded px-2 py-1 text-xs ${getStatusColor(
                              i.status,
                            )}`}
                          >
                            {i.status}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <select
                            value={i.status}
                            onChange={(e) => changeStatus(i.id, e.target.value)}
                            className="rounded border px-2 py-1 text-sm"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="SENT">Sent</option>
                            <option value="PAID">Paid</option>
                          </select>

                          <button
                            onClick={() => handleEditInvoice(i)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteInvoice(i.id)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
