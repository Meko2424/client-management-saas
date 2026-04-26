"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getClientById } from "@/lib/clientApi";

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClient() {
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch {
        toast.error("Failed to load client");
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [clientId]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {loading ? (
          <p>Loading client...</p>
        ) : !client ? (
          <p>Client not found.</p>
        ) : (
          <div className="max-w-3xl bg-white rounded-xl shadow p-6">
            <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>

            <div className="mt-6 space-y-3 text-slate-700">
              <p>
                <strong>Email:</strong> {client.email || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong> {client.phone || "N/A"}
              </p>

              <p>
                <strong>Company:</strong> {client.company || "N/A"}
              </p>

              <p>
                <strong>Notes:</strong> {client.notes || "N/A"}
              </p>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
