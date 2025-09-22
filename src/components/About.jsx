import React from 'react'
import { Code, Database, Settings, Globe, Shield } from 'lucide-react'

const About = () => {
  const languages = [
    { name: 'Français', level: 'C2 - Natif' },
    { name: 'Anglais', level: 'C1 - Avancé' },
    { name: 'Portugais', level: 'B1 - Intermédiaire' }
  ]

  // ---- Stacks mises à jour ----
  const skills = {
    pentest: [
      'Kali Linux', 'Nmap', 'Wireshark', 'Burp Suite',
      'Metasploit', 'Nessus', 'Hydra', 'sqlmap',
      'Gobuster/FFUF', 'enum4linux', 'smbclient/smbmap',
      'Impacket', 'BloodHound/SharpHound', 'Wordlists & fuzzing'
    ],
    frontend: [
      'React', 'JavaScript ES6+', 'HTML5', 'CSS3',
      'Tailwind CSS', 'Vite', 'Responsive UI'
    ],
    backend: [
      'Node.js', 'Express.js', 'Python', 'FastAPI',
      'MySQL', 'MongoDB', 'REST API', 'JWT Auth'
    ],
    tools: [
      'Git & GitHub', 'Linux (Debian/Ubuntu/Kali)', 'Docker',
      'VirtualBox/VMware', 'VS Code', 'Postman',
      'Nginx/Apache', 'GitHub Pages/Netlify'
    ]
  }

  const interests = [
    'Cybersécurité (TryHackMe, HackTheBox, CTF)',
    'Homelab & hardware (montage, virtualisation, tests sécu)',
    'Jiu-Jitsu Brésilien',
    'Cyclisme, running, crossfit, force & musculation'
  ]

  return (
    <section id="about" className="section-padding py-20">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            À propos
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez mon parcours, mes compétences et ce qui me passionne dans le développement et la cybersécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Bio & Languages */}
          <div className="space-y-8">
            {/* Bio */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Mon parcours
              </h3>
              <div className="prose prose-lg text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  Passionné de cybersécurité offensive, je prépare un MSc Pro en Cybersécurité à Epitech Nice
                  (eJPT obtenu, préparation OSCP – passage prévu 2026).
                  Issu du développement web (Bachelor Concepteur Développeur d’Applications),
                  j’ai appliqué ces bases sur des projets concrets pour Seadoo Proshop.
                </p>
                <p>
                  Aujourd’hui, je combine <strong>développement + sécurité</strong> pour analyser et tester
                  les systèmes avec rigueur. Objectif : renforcer la sécurité des organisations
                  par une approche pratique et exigeante.
                </p>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Langues
              </h3>
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">{lang.name}</span>
                    <span className="text-accent font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-8">
            {/* Technical Skills */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Compétences techniques
              </h3>

              <div className="space-y-6">
                {/* Pentest & Security */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="text-accent" size={20} />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Pentest & sécurité</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.pentest.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frontend */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="text-accent" size={20} />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Frontend</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.frontend.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="text-accent" size={20} />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Backend</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.backend.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="text-accent" size={20} />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Outils & environnements</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.tools.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="text-accent" size={20} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Centres d’intérêt
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-center hover:bg-accent/5 hover:text-accent transition-colors duration-200"
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
