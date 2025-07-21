import React from 'react'

const Hero = () => {
  return (
    <section className="section-padding py-20 lg:py-32">
      <div className="container-max">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full shadow-lg bg-white dark:bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/Louis_photo_removebg.png"
                  alt="Louis Proton"
                  className="object-cover"
                  style={{ maxWidth: '80%', height: 'auto' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400">
                  <div className="w-20 h-20 mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">LP</span>
                  </div>
                  <p className="text-sm font-medium">Louis Proton</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Développeur Web & Futur Étudiant en{' '}
              <span className="text-accent">Cybersécurité</span>
            </h1>
            
            <div className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 animate-slide-up">
              <p>
                Diplômé d'un Bachelor en Conception Développement d'Applications, 
                j'ai travaillé pendant deux ans sur des projets concrets pour Seadoo Proshop : 
                site vitrine, e-commerce, applications React.
              </p>
              
              <p>
                Je poursuis aujourd'hui ma spécialisation en cybersécurité avec une année de prépa MSc Pro chez Epitech, 
                suivie d'un mastère en cybersécurité.
              </p>
              
              <p>
                Je recherche une alternance stimulante où je pourrai mettre à profit mon expérience en développement, 
                ma rigueur et ma capacité à apprendre vite, au service de la sécurité des systèmes et des applications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <a
                href="#projects"
                className="btn-primary inline-flex items-center justify-center"
              >
                Voir mes projets
              </a>
              <a
                href="#about"
                className="btn-secondary inline-flex items-center justify-center"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
