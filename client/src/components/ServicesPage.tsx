
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Euro, CheckCircle } from 'lucide-react';
import type { Service } from '../../../server/src/schema';

interface ServicesPageProps {
  services: Service[];
  navigate: (path: string) => void;
}

export default function ServicesPage({ services, navigate }: ServicesPageProps) {
  const benefits = [
    "Équipement médical de dernière génération",
    "Consultations personnalisées selon vos besoins",
    "Suivi thérapeutique complet",
    "Environnement stérilisé et sécurisé",
    "Approche holistique de la santé podologique",
    "Conseils préventifs et éducation thérapeutique"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <div className="container-max">
          <div className="text-center space-y-8">
            <div className="space-y-4 fadeInUp">
              <Badge className="bg-[#40826D] text-white px-6 py-3 text-lg font-medium">
                Nos Services Spécialisés
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#404040]">
                Soins Podologiques
                <span className="text-[#40826D] block">Personnalisés</span>
              </h1>
              <p className="text-lg text-[#404040]/70 max-w-3xl mx-auto">
                Dr. Sonda AFFES vous propose une gamme complète de soins podologiques 
                adaptés à vos besoins spécifiques, dans un environnement moderne et sécurisé.
              </p>
            </div>

            {/* 3D Animated Services Illustration */}
            <div className="relative w-full max-w-md mx-auto h-64 fadeInUp stagger-1">
              <svg
                viewBox="0 0 300 200"
                className="w-full h-full text-[#40826D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Service icons floating around central foot */}
                <g className="animate-[spin_20s_linear_infinite]">
                  {/* Pedicure tool */}
                  <circle cx="50" cy="50" r="15" className="fill-[#40826D]/10" />
                  <path d="M50 40 L50 60 M45 50 L55 50" strokeWidth="2" />
                  
                  {/* Orthotic */}
                  <ellipse cx="250" cy="50" rx="20" ry="8" className="fill-[#C71585]/10" />
                  <path d="M230 50 Q250 45 270 50" strokeWidth="2" />
                  
                  {/* Nail care */}
                  <rect x="50" y="140" width="15" height="20" rx="3" className="fill-[#40826D]/10" />
                  <path d="M50 150 L65 150" strokeWidth="2" />
                  
                  {/* Foot scanner */}
                  <rect x="230" y="130" width="25" height="15" rx="3" className="fill-[#C71585]/10" />
                  <path d="M235 137.5 L250 137.5 M235 142.5 L250 142.5" strokeWidth="1" />
                </g>
                
                {/* Central foot */}
                <g transform="translate(150, 100)">
                  <path d="M0 -30 C15 -30 30 -20 30 -10 C30 0 25 10 15 20 C5 30 -5 40 -15 50 C-25 60 -30 70 -30 75 C-30 80 -25 82 -15 82 C-5 82 10 80 25 75 C40 70 50 60 50 45" 
                    className="fill-[#40826D]/5 animate-pulse" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="group card-hover bg-white border-0 shadow-lg overflow-hidden fadeInUp"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-[#40826D]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#40826D] transition-colors duration-300">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {service.slug === 'pedicurie-medicale' && '🦶'}
                        {service.slug === 'semelles-orthopediques' && '👟'}
                        {service.slug === 'orthoplastie-onychoplastie' && '💅'}
                      </div>
                    </div>
                    {service.price && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#40826D] flex items-center">
                          <Euro className="w-5 h-5 mr-1" />
                          {service.price}
                        </div>
                      </div>
                    )}
                  </div>
                  <CardTitle className="font-serif text-xl text-[#404040] group-hover:text-[#40826D] transition-colors duration-300">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-[#404040]/70 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-[#404040]/60">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#40826D]" />
                        {service.duration_minutes} min
                      </div>
                      <Badge variant="outline" className="border-[#40826D] text-[#40826D]">
                        {service.is_active ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/services/${service.slug}`)}
                      className="w-full btn-secondary group-hover:bg-[#40826D] group-hover:text-white"
                    >
                      En savoir plus
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                  Pourquoi Choisir Podomus ?
                </h2>
                <p className="text-lg text-[#404040]/70">
                  Notre cabinet combine expertise professionnelle, technologies modernes et approche personnalisée pour vous offrir les meilleurs soins podologiques.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#40826D] mt-1 flex-shrink-0" />
                    <span className="text-[#404040]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative fadeInUp stagger-1">
              <div className="aspect-square bg-gradient-to-br from-[#40826D]/10 to-[#C71585]/10 rounded-3xl flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🏥</div>
                    <div className="text-[#404040] font-serif text-xl font-semibold">
                      Cabinet Moderne
                    </div>
                    <div className="text-[#404040]/60 text-sm">
                      Équipements de pointe
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#40826D] rounded-full flex items-center justify-center text-white animate-bounce">
                ⚕️
              </div>
              <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-[#C71585] rounded-full flex items-center justify-center text-white animate-bounce" style={{animationDelay: '1s'}}>
                ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#40826D] to-[#335A4F] text-white">
        <div className="container-max text-center">
          <div className="space-y-8 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Prêt à Prendre Soin de vos Pieds ?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Consultez Dr. Sonda AFFES pour une évaluation personnalisée et découvrez le service qui vous convient le mieux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#C71585] hover:bg-[#A0125F] text-white font-medium px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Prendre Rendez-vous
              </Button>
              <Button 
                onClick={() => navigate('/patient-information')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#40826D]"
              >
                Informations Patients
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
