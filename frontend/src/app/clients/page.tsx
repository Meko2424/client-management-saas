"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "@/lib/clientApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError, showSuccess } from "@/lib/toastUtils";
import { ListSkeleton } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      showError(error, "Unable to load clients. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClientFormData) {
    try {
      if (editingClientId) {
        await updateClient(editingClientId, data);
        showSuccess("Client updated successfully!");
      } else {
        await createClient(data);
        showSuccess("Client created successfully!");
      }

      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      });

      setEditingClientId(null);

      await loadClients();
    } catch (error) {
      showError(error, "Unable to save client. Please try again.");
    }
  }

  function handleEdit(client: Client) {
    setEditingClientId(client.id);

    reset({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
      notes: client.notes || "",
    });
  }

  function handleCancelEdit() {
    setEditingClientId(null);

    reset({
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this client?")) return;

    try {
      await deleteClient(id);
      showSuccess("Client deleted successfully");
      loadClients();
    } catch (error) {
      showError(error, "Unable to delete client");
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingClientId ? "Edit Client" : "Add Client"}
            </h2>
            <p className="text-slate-500">
              Manage your freelance clients in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create client form */}
            <div ref={formRef} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingClientId ? "Edit Client" : "Add Client"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    className="w-full border rounded-lg p-2"
                    placeholder="Client name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    className="w-full border rounded-lg p-2"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <input
                  className="w-full border rounded-lg p-2"
                  placeholder="Phone"
                  {...register("phone")}
                />

                <input
                  className="w-full border rounded-lg p-2"
                  placeholder="Company"
                  {...register("company")}
                />

                <textarea
                  className="w-full border rounded-lg p-2"
                  placeholder="Notes"
                  rows={4}
                  {...register("notes")}
                />

                <button
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingClientId
                      ? "Update Client"
                      : "Create Client"}
                </button>
                {editingClientId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-lg bg-slate-500 text-white py-2 hover:bg-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Client list */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Client List</h2>

              {loading ? (
                <ListSkeleton rows={4} />
              ) : clients.length === 0 ? (
                // <p className="text-slate-500">No clients yet.</p>
                <EmptyState
                  title="No clients yet"
                  description="Create your first client to start managing projects and invoices."
                  buttonText="Create Client"
                  onAction={() => {
                    formRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          {client.name}
                        </Link>

                        <p className="text-sm text-slate-500">
                          {client.email || "No email"}
                        </p>

                        {client.company && (
                          <p className="text-sm text-slate-500">
                            {client.company}
                          </p>
                        )}

                        {client.notes && (
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="font-medium">Notes:</span>{" "}
                            {client.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
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
