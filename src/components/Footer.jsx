import React from 'react'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:louisproton2077@gmail.com'
  }

  const handleCVOpen = () => {
    window.open('/CV_LOUIS_PROTON.pdf', '_blank')
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="section-padding py-12">
        <div className="container-max">
          <div className="flex flex-col items-center space-y-8">
            {/* Contact Info */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Restons en contact
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                N'hésitez pas à me contacter pour discuter d'opportunités ou simplement échanger !
              </p>
              
              {/* Contact Links */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a
                  href="https://github.com/Kherops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:text-accent dark:hover:text-accent transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/louis-proton-73917b341/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:text-accent dark:hover:text-accent transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
                
                <button
                  onClick={handleEmailClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:text-accent dark:hover:text-accent transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </button>
                
                <button
                  onClick={handleCVOpen}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <span>Voir CV</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Copyright & Credits */}
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-center gap-1 text-sm">
                © 2025 Louis PROTON
              </p>
              <p className="text-xs mt-2">
                Développeur Web & Futur Étudiant en Cybersécurité
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
