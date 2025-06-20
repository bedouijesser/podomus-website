
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full text-brand-teal wireframe-foot"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20 5 C25 5 30 10 30 15 C30 18 28 20 25 22 C22 24 18 26 15 28 C12 30 10 32 10 35 C10 37 12 38 15 38 C18 38 22 37 25 35 C28 33 30 30 30 27" />
                  <path d="M15 15 C17 15 19 17 19 19 C19 21 17 23 15 23 C13 23 11 21 11 19 C11 17 13 15 15 15" />
                  <path d="M12 8 C13 8 14 9 14 10 C14 11 13 12 12 12 C11 12 10 11 10 10 C10 9 11 8 12 8" />
                  <path d="M16 7 C17 7 18 8 18 9 C18 10 17 11 16 11 C15 11 14 10 14 9 C14 8 15 7 16 7" />
                  <path d="M20 8 C21 8 22 9 22 10 C22 11 21 12 20 12 C19 12 18 11 18 10 C18 9 19 8 20 8" />
                  <path d="M24 9 C25 9 26 10 26 11 C26 12 25 13 24 13 C23 13 22 12 22 11 C22 10 23 9 24 9" />
                </svg>
              </div>
              <div className="font-serif text-2xl font-bold">
                POD<span className="text-brand-teal">O</span>MUS
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Cabinet de podologie moderne offrant des soins spécialisés pour la santé de vos pieds.
            </p>
            <p className="text-xs text-gray-400">
              Dr. Sonda AFFES - Podologue
            </p>
          </div>

          {/* Services rapides */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/services/pedicurie-medicale')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  Pédicurie Médicale
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/semelles-orthopediques')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  Semelles Orthopédiques
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/orthoplastie-onychoplastie')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  Orthoplastie & Onychoplastie
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  À Propos
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/patient-information')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  Info Patients
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-brand-teal transition-colors duration-200">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-brand-teal mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Bm02, 1er étage, Golf Center 2<br />
                  avenue de l'environnement<br />
                  Dar Fadhal, La Soukra, Ariana
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-teal" />
                <a href="tel:28451433" className="text-gray-300 hover:text-white transition-colors duration-200">
                  28 451 433
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-teal" />
                <a href="mailto:sonda@podomus.tn" className="text-gray-300 hover:text-white transition-colors duration-200">
                  sonda@podomus.tn
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-brand-teal mt-1" />
                <div className="text-gray-300">
                  <div>Lun-Ven: 8h00-18h00</div>
                  <div>Sam: 8h00-13h00</div>
                  <div>Dim: Fermé</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Podomus. Tous droits réservés. | Cabinet Dr. Sonda AFFES
          </p>
        </div>
      </div>
    </footer>
  );
}
