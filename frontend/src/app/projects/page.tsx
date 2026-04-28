"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getProjects,
  createProject,
  getClients,
  updateProjectStatus,
} from "@/lib/clientApi";

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
  useEffect(() => {
    loadData();
  }, []);

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

      // Instant UI update
      setProjects((prev) => [newProject, ...prev]);

      toast.success("Project created");

      setName("");
      setClientId("");
    } catch {
      toast.error("Failed to create project");
    }
  }

  async function changeStatus(id: number, status: string) {
    try {
      const updated = await updateProjectStatus(id, status);

      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
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
                      className="border p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.clientName}</p>

                        {/* Colored Status Badge */}
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getStatusBadge(
                            p.status,
                          )}`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Dropdown */}
                        <select
                          value={p.status}
                          onChange={(e) => changeStatus(p.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="PLANNED">Planned</option>
                          <option value="ACTIVE">Active</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="ON_HOLD">On Hold</option>
                        </select>

                        {/* Budget */}
                        {p.budget && (
                          <p className="text-sm font-medium">${p.budget}</p>
                        )}
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
