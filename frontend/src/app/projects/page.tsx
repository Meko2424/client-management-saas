"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getProjects, createProject, getClients } from "@/lib/clientApi";

type Project = {
  id: number;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  clientName: string;
};

type Client = {
  id: number;
  name: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState<number | "">("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [projectsData, clientsData] = await Promise.all([
        getProjects(),
        getClients(),
      ]);

      setProjects(projectsData);
      setClients(clientsData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: any) {
    e.preventDefault();

    if (!clientId) {
      toast.error("Select a client");
      return;
    }

    try {
      const newProject = await createProject({
        name,
        clientId,
      });

      setProjects((prev) => [newProject, ...prev]);

      toast.success("Project created");
      setName("");
      setClientId("");
      await loadData();
    } catch {
      toast.error("Failed to create project");
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Projects</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Project */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Create Project</h2>

              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                  Create
                </button>
              </form>
            </div>

            {/* Project List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Project List</h2>

              {loading ? (
                <p>Loading...</p>
              ) : projects.length === 0 ? (
                <p>No projects yet.</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="border p-4 rounded flex justify-between"
                    >
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.clientName}</p>
                        <p className="text-xs text-gray-400">{p.status}</p>
                      </div>

                      {p.budget && (
                        <p className="text-sm font-medium">${p.budget}</p>
                      )}
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
