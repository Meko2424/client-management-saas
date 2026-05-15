"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getClients,
  updateProjectStatus,
} from "@/lib/clientApi";
import { showError, showSuccess } from "@/lib/toastUtils";
import { ListSkeleton } from "@/components/LoadingStates";

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
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("PLANNED");
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
    } catch (error) {
      showError(error, "Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId) {
      showError(null, "Select a client");
      return;
    }

    const payload = {
      name,
      description,
      clientId,
      status,
      budget: budget ? Number(budget) : null,
    };

    try {
      if (editingProjectId) {
        const updated = await updateProject(editingProjectId, payload);

        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? updated : p)),
        );

        showSuccess("Project updated successfully!");
      } else {
        const newProject = await createProject(payload);

        setProjects((prev) => [newProject, ...prev]);

        showSuccess("Project created successfully!");
      }

      handleCancelEdit();
    } catch (error) {
      showError(error, "Unable to save project. Please try again.");
    }
  }

  function handleEdit(project: Project) {
    setEditingProjectId(project.id);
    setName(project.name || "");
    setDescription(project.description || "");
    setBudget(project.budget ? String(project.budget) : "");
    setStatus(project.status || "PLANNED");

    const matchingClient = clients.find(
      (client) => client.name === project.clientName,
    );
    setClientId(matchingClient ? matchingClient.id : "");
  }

  async function handleDeleteProject(id: number) {
    if (!confirm("Delete this project?")) return;

    try {
      await deleteProject(id);

      setProjects((prev) => prev.filter((p) => p.id !== id));

      showSuccess("Project deleted successfully!");
    } catch (error) {
      showError(error, "Failed to delete project. Please try again.");
    }
  }

  function handleCancelEdit() {
    setEditingProjectId(null);
    setName("");
    setDescription("");
    setBudget("");
    setStatus("PLANNED");
    setClientId("");
  }

  async function changeStatus(id: number, status: string) {
    try {
      const updated = await updateProjectStatus(id, status);

      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));

      showSuccess("Status updated successfully!");
    } catch (error) {
      showError(error, "Failed to update status");
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

              <form onSubmit={handleSubmitProject} className="space-y-4">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <input
                  className="w-full border p-2 rounded"
                  placeholder="Budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />

                <select
                  className="w-full border p-2 rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>

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
                  {editingProjectId ? "Update Project" : "Create"}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-slate-500 text-white py-2 rounded hover:bg-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Project List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Project List</h2>

              {loading ? (
                <ListSkeleton rows={4} />
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
                        {p.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {p.description}
                          </p>
                        )}

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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
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
