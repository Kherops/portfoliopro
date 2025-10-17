import React from 'react'
import { ExternalLink, Globe, ArrowUpRight } from 'lucide-react'

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Site vitrine Seadoo Proshop",
      type: "Site Vitrine",
      description: "Site professionnel moderne présentant les produits et services de l'entreprise avec design responsive et optimisation SEO.",
      role: "Développement complet, intégration contenus, mise en production",
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "PHP"],
      url: "https://seadoo.fr",
      image: "/seadooproshop.png",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      id: 2,
      name: "Portfolio 2.0 Cyberpunk",
      type: "Portfolio Personnel",
      description: "Portfolio avec thème cyberpunk futuriste, mettant en avant les compétences en développement web et design interactif.",
      role: "Conception UI/UX, développement React, animations CSS",
      technologies: ["React", "CSS3", "JavaScript", "Vite", "GitHub Pages"],
      url: "https://kherops.github.io/portfolio",
      image: "/portfolio2.png",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      textColor: "text-white"
    },
    {
      id: 3,
      name: "Shop Seadoo E-commerce",
      type: "E-commerce",
      description: "Plateforme e-commerce complète avec gestion des commandes, paiements sécurisés et interface d'administration.",
      role: "Développement full-stack, intégration API, gestion BDD",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
      url: "https://shop-seadoo.fr",
      image: "/shopseadoo.png",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-500",
      textColor: "text-white"
    },
    {
      id: 4,
      name: "CV Numérique Interactif",
      type: "Digital Resume",
      description: "CV interactif avec terminal bash permettant de naviguer dans les sections via des commandes Linux (ls, cd, cat).",
      role: "Conception UI/UX, développement JavaScript, simulation terminal, simulation Capture the Flag simple",
      technologies: ["HTML5", "CSS3", "JavaScript", "Bash", "CTF"],
      url: "https://kherops.github.io/digital-resume/",
      image: "public/digital_resume.png",
      bgColor: "bg-gradient-to-br from-slate-800 to-slate-900",
      textColor: "text-white"
    }
  ]

  return (
    <section id="projects" className="section-padding py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mes Projets
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une sélection de mes réalisations web, du site vitrine à l'e-commerce.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Card Background */}
              <div className={`${project.bgColor} h-full flex flex-col`}>
                
                {/* Image Section */}
                <div className={`relative h-48 overflow-hidden ${project.id === 1 ? 'bg-white' : ''}`}>
                  <img
                    src={project.image}
                    alt={project.name}
                    className={`w-full h-full ${project.id === 1 ? 'object-contain p-4' : 'object-cover'} transition-transform duration-500 group-hover:scale-110`}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Project Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                      {project.type}
                    </span>
                  </div>
                  
                  {/* Link Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                    >
                      <ArrowUpRight size={18} className="text-gray-900" />
                    </a>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className={`text-xl font-bold ${project.textColor} mb-3 group-hover:text-accent transition-colors duration-200`}>
                    {project.name}
                  </h3>
                  
                  {/* Description */}
                  <p className={`${project.textColor} opacity-80 text-sm leading-relaxed mb-4 flex-1`}>
                    {project.description}
                  </p>
                  
                  {/* Role */}
                  <div className="mb-4">
                    <p className={`${project.textColor} opacity-70 text-xs font-medium mb-1`}>
                      MON RÔLE
                    </p>
                    <p className={`${project.textColor} opacity-90 text-sm`}>
                      {project.role}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  <div className="mb-6">
                    <p className={`${project.textColor} opacity-70 text-xs font-medium mb-2`}>
                      TECHNOLOGIES
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 ${project.id === 1 ? 'bg-gray-100 text-gray-700' : 'bg-white/20 text-white'} rounded text-xs font-medium`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 ${project.id === 1 ? 'bg-accent text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'} rounded-lg transition-all duration-200 font-medium text-sm group-hover:scale-105 transform`}
                  >
                    <Globe size={16} />
                    Voir le projet
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
