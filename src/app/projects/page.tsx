"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects. Please try again later.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-4xl font-bold text-red-500 animate-pulse">
          <span className="animate-bounce inline-block">L</span>
          <span className="animate-bounce inline-block delay-75">o</span>
          <span className="animate-bounce inline-block delay-100">a</span>
          <span className="animate-bounce inline-block delay-150">d</span>
          <span className="animate-bounce inline-block delay-200">i</span>
          <span className="animate-bounce inline-block delay-300">n</span>
          <span className="animate-bounce inline-block delay-400">g</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-red-500">
          My Projects
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-red-500">
                  {project.title}
                </h2>
                <p className="text-gray-300 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.subtitle && (
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                      {project.subtitle}
                    </span>
                  )}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-gradient-to-r from-red-600 to-purple-600 rounded-full text-sm font-bold hover:from-red-700 hover:to-purple-700 transition-all duration-300"
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 