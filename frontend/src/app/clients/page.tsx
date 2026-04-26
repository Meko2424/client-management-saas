"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient, deleteClient, getClients } from "@/lib/clientApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClientFormData) {
    try {
      await createClient(data);
      toast.success("Client created");
      reset();
      loadClients();
    } catch {
      toast.error("Failed to create client");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this client?")) return;

    try {
      await deleteClient(id);
      toast.success("Client deleted");
      loadClients();
    } catch {
      toast.error("Failed to delete client");
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-500">
              Manage your freelance clients in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create client form */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Add Client</h2>

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
                  {isSubmitting ? "Saving..." : "Create Client"}
                </button>
              </form>
            </div>

            {/* Client list */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Client List</h2>

              {loading ? (
                <p>Loading clients...</p>
              ) : clients.length === 0 ? (
                <p className="text-slate-500">No clients yet.</p>
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
                      </div>

                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
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
