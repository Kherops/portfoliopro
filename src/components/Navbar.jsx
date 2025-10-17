import React from 'react'
import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@louisproton.com'
  }

  const handleCVOpen = () => {
    // Open CV in new window
<<<<<<< HEAD
<<<<<<< HEAD
    window.open('/CV_LOUIS_PROTON.pdf', '_blank')
=======
    window.open('public/CV LOUIS PROTON 16.09.2025.pdf', '_blank')
>>>>>>> 12fbb07 (Clean: stop tracking node_modules + maj contenu)
=======
    window.open('public/CV LOUIS PROTON 19.09.2025.pdf', '_blank')
>>>>>>> e242fd6 ( changes on everything)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Louis Proton
            </h1>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex items-center space-x-4">
            {/* Social Links */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href="https://github.com/Kherops"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/louis-proton/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <button
                onClick={handleEmailClick}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Email"
              >
                <Mail size={20} />
              </button>
            </div>

            {/* ✅ CV Download Button (fix centré mobile + desktop) */}
            <button
              onClick={handleCVOpen}
              className="btn-primary inline-flex items-center justify-center h-10 px-4 rounded-md"
            >
              {/* Desktop */}
              <span className="hidden sm:inline-block font-semibold text-sm">Voir le CV</span>

              {/* Mobile */}
              <span className="sm:hidden inline-block font-semibold text-sm leading-none h-full flex items-center justify-center">
                CV
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="theme-toggle-glow text-yellow-500" />
              ) : (
                <Moon size={20} className="theme-toggle-glow text-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Social Links */}
        <div className="sm:hidden flex items-center justify-center space-x-6 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
          <a
            href="https://github.com/Kherops"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/louis-proton/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <button
            onClick={handleEmailClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
