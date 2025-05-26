"use client";

import React, { useState, useEffect } from "react";

const TABS = ["Projects", "Skills", "About Me", "Testimonials"];

// Project type
interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string; // base64 string
}

// Skill type
interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
  image: string;
}

// About type
interface About {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Projects");

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }>({
    title: "",
    subtitle: "",
    description: "",
    image: "",
  });
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  // Skill state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillForm, setSkillForm] = useState({
    name: "",
    level: "",
    category: "",
    image: ""
  });
  const [editSkillId, setEditSkillId] = useState<string | null>(null);

  // About state
  const [aboutEntries, setAboutEntries] = useState<About[]>([]);
  const [aboutForm, setAboutForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }>({
    title: "",
    subtitle: "",
    description: "",
    image: "",
  });
  const [editAboutId, setEditAboutId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Whenever you switch tabs, fetch the appropriate data
  useEffect(() => {
    if (activeTab === "Projects") {
      fetchProjects();
    } else if (activeTab === "Skills") {
      fetchSkills();
    } else if (activeTab === "About Me") {
      fetchAbout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ---------------------- Projects ----------------------
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of projects");
      }
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects.");
      setProjects([]); // reset to empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm({ ...projectForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editProjectId !== null) {
        // Update existing
        const res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editProjectId, ...projectForm }),
        });
        if (!res.ok) throw new Error("Failed to update project.");
      } else {
        // Add new
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        });
        if (!res.ok) throw new Error("Failed to add project.");
      }
      setProjectForm({ title: "", subtitle: "", description: "", image: "" });
      setEditProjectId(null);
      fetchProjects();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setProjectForm({
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      image: project.image,
    });
    setEditProjectId(project._id);
  };

  const handleProjectDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      if (editProjectId === id) {
        setEditProjectId(null);
        setProjectForm({ title: "", subtitle: "", description: "", image: "" });
      }
      fetchProjects();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Skills ----------------------
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/skills");
      if (!res.ok) {
        throw new Error(`Failed to fetch skills: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of skills");
      }
      setSkills(data);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch skills.");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSkillForm({ ...skillForm, [e.target.name]: e.target.value });
  };

  const handleSkillImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSkillForm({ ...skillForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert level to number
      const skillData = {
        ...skillForm,
        level: Number(skillForm.level)
      };

      if (editSkillId !== null) {
        // Update
        const res = await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editSkillId, ...skillData }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update skill.");
        }
      } else {
        // Add
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skillData),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to add skill.");
        }
      }
      setSkillForm({ name: "", level: "", category: "", image: "" });
      setEditSkillId(null);
      fetchSkills();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillEdit = (skill: Skill) => {
    setSkillForm({
      name: skill.name,
      level: skill.level.toString(),
      category: skill.category,
      image: skill.image
    });
    setEditSkillId(skill._id);
  };

  const handleSkillDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete skill.");
      if (editSkillId === id) {
        setEditSkillId(null);
        setSkillForm({ name: "", level: "", category: "", image: "" });
      }
      fetchSkills();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- About ----------------------
  const fetchAbout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/about");
      if (!res.ok) {
        throw new Error(`Failed to fetch about entries: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // If the response is already an array, use it directly:
      if (Array.isArray(data)) {
        setAboutEntries(data);
      }
      // If it's an object (single entry), wrap it in an array
      else if (data && typeof data === "object") {
        setAboutEntries([data]);
      }
      // If it's something else (e.g. null, string), treat as "no valid entries"
      else {
        throw new Error("Invalid response format: expected an array or object of about entries");
      }
    } catch (err) {
      console.error("Error fetching about entries:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch about entries.");
      setAboutEntries([]); // always reset to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAboutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutForm({ ...aboutForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editAboutId !== null) {
        // Update
        const res = await fetch("/api/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editAboutId, ...aboutForm }),
        });
        if (!res.ok) throw new Error("Failed to update about entry.");
      } else {
        // Add
        const res = await fetch("/api/about", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aboutForm),
        });
        if (!res.ok) throw new Error("Failed to add about entry.");
      }
      setAboutForm({ title: "", subtitle: "", description: "", image: "" });
      setEditAboutId(null);
      fetchAbout();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAboutEdit = (about: About) => {
    setAboutForm({
      title: about.title,
      subtitle: about.subtitle,
      description: about.description,
      image: about.image,
    });
    setEditAboutId(about._id);
  };

  const handleAboutDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/about", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete about entry.");
      if (editAboutId === id) {
        setEditAboutId(null);
        setAboutForm({ title: "", subtitle: "", description: "", image: "" });
      }
      fetchAbout();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Admin Dashboard</h1>

      {/* Tab Buttons */}
      <div className="flex gap-6 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 border-2 border-red-600 focus:outline-none ${
              activeTab === tab
                ? "bg-red-600 text-white"
                : "bg-black text-red-400 hover:bg-red-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl p-8 shadow-lg">
        {/* ==================== Projects Pane ==================== */}
        {activeTab === "Projects" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Manage Projects</h2>
            {error && <div className="mb-4 text-red-400">{error}</div>}
            {loading && <div className="mb-4 text-gray-400">Loading...</div>}

            <form onSubmit={handleProjectSubmit} className="mb-8 space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={handleProjectChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Project Subtitle"
                value={projectForm.subtitle}
                onChange={handleProjectChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={projectForm.description}
                onChange={handleProjectChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProjectImageUpload}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required
              />
              {projectForm.image && (
                <div className="mt-2">
                  <img
                    src={projectForm.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded shadow border-2 border-red-400"
                  />
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  disabled={loading}
                >
                  {editProjectId !== null ? "Update Project" : "Add Project"}
                </button>
                {editProjectId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditProjectId(null);
                      setProjectForm({
                        title: "",
                        subtitle: "",
                        description: "",
                        image: "",
                      });
                    }}
                    className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <ul className="space-y-4">
              {!loading && projects.length === 0 && (
                <li className="text-gray-500">No projects added yet.</li>
              )}
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="bg-gray-800 rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded shadow border-2 border-red-400"
                    />
                    <div>
                      <div className="font-bold text-lg text-red-300">
                        {project.title}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {project.subtitle}
                      </div>
                      <div className="text-gray-300 mt-1">
                        {project.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleProjectEdit(project)}
                      className="px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleProjectDelete(project._id)}
                      className="px-4 py-1 rounded bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ==================== Skills Pane ==================== */}
        {activeTab === "Skills" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Manage Skills</h2>
            {error && <div className="mb-4 text-red-400">{error}</div>}
            {loading && <div className="mb-4 text-gray-400">Loading...</div>}

            <div className="w-full max-w-2xl">
              <form onSubmit={handleSkillSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={skillForm.name}
                    onChange={handleSkillChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Level (0-100)</label>
                  <input
                    type="number"
                    name="level"
                    value={skillForm.level}
                    onChange={handleSkillChange}
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={skillForm.category}
                    onChange={handleSkillChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Skill Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSkillImageUpload}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                    required={!skillForm.image}
                  />
                  {skillForm.image && (
                    <div className="mt-2">
                      <img
                        src={skillForm.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded shadow border-2 border-red-400"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {loading ? "Saving..." : editSkillId ? "Update Skill" : "Add Skill"}
                </button>
              </form>

              <ul className="mt-8 space-y-4">
                {skills.map((skill) => (
                  <li
                    key={skill._id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="w-16 h-16 object-cover rounded shadow border-2 border-red-400"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-red-400">{skill.name}</h3>
                        <p className="text-gray-400">Level: {skill.level}%</p>
                        <p className="text-gray-400">Category: {skill.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSkillEdit(skill)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSkillDelete(skill._id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================== About Me Pane ==================== */}
        {activeTab === "About Me" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Manage About Me</h2>
            {error && <div className="mb-4 text-red-400">{error}</div>}
            {loading && <div className="mb-4 text-gray-400">Loading...</div>}

            <form onSubmit={handleAboutSubmit} className="mb-8 space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={aboutForm.title}
                onChange={handleAboutChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={aboutForm.subtitle}
                onChange={handleAboutChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={aboutForm.description}
                onChange={handleAboutChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                rows={5}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAboutImageUpload}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-500 outline-none"
                required={!aboutForm.image}
              />
              {aboutForm.image && (
                <div className="mt-2">
                  <img
                    src={aboutForm.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded shadow border-2 border-red-400"
                  />
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  disabled={loading}
                >
                  {editAboutId !== null ? "Update About Entry" : "Add About Entry"}
                </button>
                {editAboutId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditAboutId(null);
                      setAboutForm({
                        title: "",
                        subtitle: "",
                        description: "",
                        image: "",
                      });
                    }}
                    className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <ul className="space-y-4">
              {!loading && aboutEntries.length === 0 && (
                <li className="text-gray-500">No about entries added yet.</li>
              )}
              {aboutEntries.map((about) => (
                <li
                  key={about._id}
                  className="bg-gray-800 rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={about.image}
                      alt={about.title}
                      className="w-16 h-16 object-cover rounded shadow border-2 border-red-400"
                    />
                    <div>
                      <div className="font-bold text-lg text-red-300">
                        {about.title}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {about.subtitle}
                      </div>
                      <div className="text-gray-300 mt-1">
                        {about.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleAboutEdit(about)}
                      className="px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAboutDelete(about._id)}
                      className="px-4 py-1 rounded bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ==================== Testimonials Pane (placeholder) ==================== */}
        {activeTab === "Testimonials" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Manage Testimonials</h2>
            <p className="text-gray-400">Add, edit, or delete testimonials here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
