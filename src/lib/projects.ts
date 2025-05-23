export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and Tailwind CSS, featuring responsive design and smooth animations.",
    imageUrl: "/projects/portfolio.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.com"
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform with user authentication, product management, and payment integration.",
    imageUrl: "/projects/ecommerce.png",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://your-ecommerce.com"
  },
  {
    id: "3",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team features.",
    imageUrl: "/projects/taskmanager.png",
    technologies: ["React", "Firebase", "Material-UI"],
    githubUrl: "https://github.com/yourusername/task-manager",
    liveUrl: "https://your-taskmanager.com"
  }
]; 