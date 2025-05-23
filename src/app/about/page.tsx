"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface About {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/about");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAbout(data);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-red-500/20 rounded mb-4"></div>
          <div className="h-4 w-48 bg-red-500/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl text-red-500 animate-bounce">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
        <div className="absolute inset-0">
          {about?.image && (
            <Image
              src={about.image}
              alt="About Background"
              fill
              className="object-cover animate-[ken-burns_20s_ease-in-out_infinite]"
              priority
            />
          )}
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent"
          >
            About Me
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-red-400 mb-12 font-light animate-pulse"
          >
            {about?.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {about?.image && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-500"
              >
                <Image
                  src={about.image}
                  alt={about.title}
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 backdrop-blur-sm bg-black/20 p-8 rounded-2xl"
            >
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">{about?.title}</h2>
                <p className="text-2xl text-gray-400 mb-8 animate-pulse">{about?.subtitle}</p>
              </div>
              <div className="prose prose-lg prose-invert">
                <p className="text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
                  {about?.description}
                </p>
              </div>
              <div className="pt-8">
                <Link
                  href="/"
                  className="group inline-block px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <span className="group-hover:animate-pulse">Back to Home</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}