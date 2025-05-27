"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// ----------------- Types -----------------
interface About {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface Project {
  showFullDescription: boolean;
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface Skill {
  _id: string;
  name: string;
  level: string;
  image: string;
}

// ----------------- Component -----------------
export default function Home() {
  const [about, setAbout] = useState<About[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [aboutRes, projectsRes, skillsRes] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/projects"),
          fetch("/api/skills"),
        ]);

        if (!aboutRes.ok || !projectsRes.ok || !skillsRes.ok) {
          throw new Error("One or more endpoints failed to respond.");
        }

        const [aboutDataRaw, projectsData, skillsData] = await Promise.all([
          aboutRes.json(),
          projectsRes.json(),
          skillsRes.json(),
        ]);

        if (Array.isArray(aboutDataRaw)) {
          setAbout(aboutDataRaw);
        } else if (aboutDataRaw && typeof aboutDataRaw === "object") {
          setAbout([aboutDataRaw]);
        } else {
          setAbout([]);
        }

        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again later.");
        setAbout([]);
        setProjects([]);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-red-500 mb-6"
          >
            {error}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  const firstAbout = about[0] ?? {
    title: "Your Name",
    subtitle: "Your Profession",
    description: "A brief description about yourself will appear here.",
    image: "",
    _id: "placeholder",
  };

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
        
        {firstAbout.image && (
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={firstAbout.image}
              alt="Hero Background"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
        )}

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              {firstAbout.title}
            </h1>
            <p className="text-2xl md:text-3xl font-light text-gray-300 mb-10">
              {firstAbout.subtitle}
            </p>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-block px-12 py-5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full text-xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
            >
              Discover More
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-2 h-2 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-purple-500/10 opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-black text-center mb-20 bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text"
          >
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {firstAbout.image && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[600px] rounded-3xl overflow-hidden"
              >
                <Image
                  src={firstAbout.image}
                  alt={firstAbout.title}
                  fill
                  className="object-cover object-center hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
                {firstAbout.title}
              </h3>
              <p className="text-xl leading-relaxed text-gray-300">
                {firstAbout.description}
              </p>
              <div className="flex gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/projects"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-full font-bold hover:from-red-700 hover:to-purple-700 shadow-lg hover:shadow-red-500/30 transition-all duration-300 cursor-pointer"
                  >
                    View Projects
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 border-2 border-red-500 rounded-full font-bold hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                  >
                    Contact Me
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-black text-center mb-20 bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text"
          >
            Projects
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 font-medium mb-4">
                    {project.subtitle}
                  </p>
                  <div className={`text-gray-300 leading-relaxed mb-6 ${!project.showFullDescription ? 'line-clamp-5' : ''}`}>
                    {project.description}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const updatedProjects = projects.map(p => 
                        p._id === project._id 
                          ? {...p, showFullDescription: !p.showFullDescription}
                          : p
                      );
                      setProjects(updatedProjects);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-purple-600 rounded-full text-sm font-bold hover:from-red-700 hover:to-purple-700 transition-all duration-300"
                  >
                    {project.showFullDescription ? 'Show Less' : 'Learn More'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-red-500/10 opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-black text-center mb-20 bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text"
          >
            Skills
          </motion.h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl flex flex-col items-center gap-6 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
                    {skill.name}
                  </h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-400 text-center md:text-left">
              <p>© {new Date().getFullYear()} {firstAbout.title}. All rights reserved.</p>
            </div>
            
            <div className="flex gap-6">
              <Link href="https://www.linkedin.com/in/bilisa-kumera/" passHref>
                <motion.a
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
              </Link>
              
              <Link href="https://github.com/Bilisa-Kumera" passHref>
                <motion.a
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
