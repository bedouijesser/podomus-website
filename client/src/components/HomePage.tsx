
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Star, Users, Award, Clock } from 'lucide-react';
import type { Service } from '../../../server/src/schema';

interface HomePageProps {
  services: Service[];
  navigate: (path: string) => void;
}

export default function HomePage({ services, navigate }: HomePageProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Dr. Affes est exceptionnelle. Ses soins de pédicurie médicale ont complètement résolu mes problèmes de pieds. Je recommande vivement !",
      condition: "Pédicurie médicale"
    },
    {
      name: "Ahmed K.",
      rating: 5,
      text: "Les semelles orthopédiques sur mesure ont changé ma vie. Fini les douleurs au dos ! Un travail de précision remarquable.",
      condition: "Semelles orthopédiques"
    },
    {
      name: "Leila T.",
      rating: 5,
      text: "Cabinet moderne, équipement de pointe. Dr. Affes est très professionnelle et rassurante. Parfait pour toute la famille.",
      condition: "Suivi familial"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const stats = [
    { icon: Users, value: "2000+", label: "Patients traités" },
    { icon: Award, value: "15+", label: "Années d'expérience" },
    { icon: Star, value: "4.9/5", label: "Note moyenne" },
    { icon: Clock, value: "< 24h", label: "Délai de RDV" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-brand-warm to-brand-clinical overflow-hidden">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-brand-teal text-white px-4 py-2 text-sm font-medium">
                  Cabinet de Podologie Moderne
                </Badge>
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-brand-primary fadeInUp">
                  Soins Experts pour la
                  <span className="text-brand-teal block">Santé de vos Pieds</span>
                </h1>
                <p className="text-lg text-brand-primary/80 fadeInUp stagger-1 max-w-xl">
                  Dr. Sonda AFFES vous accueille dans son cabinet moderne pour des soins podologiques personnalisés avec les technologies les plus avancées.
                </p>
              </div>

              <div className="space-y-4 fadeInUp stagger-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate('/contact')} className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                    Prendre Rendez-vous
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/services')}
                    className="btn-outline-teal w-full sm:w-auto text-lg px-8 py-4"
                  >
                    Découvrir nos Services
                  </Button>
                </div>
                <p className="text-sm text-brand-primary/60">
                  📍 La Soukra, Ariana • ☎️ 28 451 433 • ✉️ sonda@podomus.tn
                </p>
              </div>
            </div>

            {/* 3D Wireframe Foot Hero */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <svg
                  viewBox="0 0 200 250"
                  className="w-full h-full text-brand-teal wireframe-foot"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  {/* Main foot outline */}
                  <path d="M100 20 C130 20 160 40 160 70 C160 90 150 110 130 130 C110 150 90 170 70 190 C50 210 40 230 40 245 C40 250 50 252 70 252 C90 252 120 248 150 240 C180 232 200 210 200 180" 
                    className="animate-[draw_3s_ease-in-out_infinite]" />
                  
                  {/* Toes */}
                  <circle cx="70" cy="60" r="15" className="animate-[pulse_2s_ease-in-out_infinite]" />
                  <circle cx="60" cy="35" r="8" className="animate-[pulse_2s_ease-in-out_infinite_0.2s]" />
                  <circle cx="80" cy="30" r="10" className="animate-[pulse_2s_ease-in-out_infinite_0.4s]" />
                  <circle cx="100" cy="35" r="12" className="animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
                  <circle cx="120" cy="40" r="10" className="animate-[pulse_2s_ease-in-out_infinite_0.8s]" />
                  
                  {/* Arch details */}
                  <path d="M40 150 Q80 140 120 150 Q140 160 150 180" strokeDasharray="5,5" 
                    className="animate-[dash_3s_linear_infinite]" />
                  <path d="M60 180 Q90 170 120 180" strokeDasharray="3,3" 
                    className="animate-[dash_3s_linear_infinite_1s]" />
                  
                  {/* Heel */}
                  <ellipse cx="100" cy="220" rx="30" ry="25" />
                  
                  {/* Grid overlay for 3D effect */}
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="200" height="250" fill="url(#grid)" opacity="0.2" />
                </svg>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-teal rounded-full animate-bounce opacity-70"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brand-magenta rounded-full animate-bounce opacity-70" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-brand-teal rounded-full animate-bounce opacity-50" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-brand-teal/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-brand-teal" />
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-brand-primary/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-brand-clinical">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-4 fadeInUp">
              Nos Services Spécialisés
            </h2>
            <p className="text-lg text-brand-primary/70 max-w-2xl mx-auto fadeInUp stagger-1">
              Des soins podologiques complets avec des technologies de pointe pour votre bien-être.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="group card-hover bg-white border-0 shadow-lg fadeInUp micro-interaction" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-teal transition-colors duration-300">
                      <div className="w-8 h-8 text-brand-teal group-hover:text-white transition-colors duration-300 text-2xl">
                        {service.slug === 'pedicurie-medicale' && '🦶'}
                        {service.slug === 'semelles-orthopediques' && '👟'}
                        {service.slug === 'orthoplastie-onychoplastie' && '💅'}
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-brand-primary group-hover:text-brand-teal transition-colors duration-300">
                      {service.name}
                    </h3>
                    
                    <p className="text-brand-primary/70 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-brand-primary/60">
                        {service.duration_minutes} min
                        {service.price && (
                          <span className="ml-2 font-semibold text-brand-teal">
                            {service.price}€
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => navigate(`/services/${service.slug}`)}
                        variant="ghost" 
                        size="sm"
                        className="text-brand-teal hover:bg-brand-teal hover:text-white p-2 rounded-full"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => navigate('/services')} variant="secondary" size="lg">
              Voir tous nos services
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-brand-magenta/10 text-brand-magenta px-4 py-2">
                  Dr. Sonda AFFES
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary">
                  Votre Podologue de Confiance à Ariana
                </h2>
                <p className="text-lg text-brand-primary/70 leading-relaxed">
                  Diplômée en podologie avec plus de 15 ans d'expérience, je vous accompagne dans tous vos besoins de santé podologique. Mon approche personnalisée combine expertise traditionnelle et technologies modernes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span className="text-brand-primary">Diplôme universitaire en podologie</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span className="text-brand-primary">Spécialisation en orthèses plantaires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span className="text-brand-primary">Formation continue en podologie avancée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span className="text-brand-primary">Membre de l'association tunisienne de podologie</span>
                </div>
              </div>

              <Button onClick={() => navigate('/about')} variant="secondary" size="lg">
                En savoir plus
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative fadeInUp stagger-1">
              <div className="aspect-square bg-gradient-to-br from-brand-teal/10 to-brand-magenta/10 rounded-full flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-brand-teal/5 rounded-full flex items-center justify-center">
                  <div className="text-6xl">👩‍⚕️</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-teal rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-brand-magenta rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-brand-clinical">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-4 fadeInUp">
              Ce que disent nos Patients
            </h2>
            <p className="text-lg text-brand-primary/70 fadeInUp stagger-1">
              Découvrez les témoignages de nos patients satisfaits
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-brand-magenta text-brand-magenta" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-serif text-brand-primary italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  
                  <div className="space-y-2">
                    <div className="font-semibold text-brand-primary">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-brand-teal">
                      {testimonials[currentTestimonial].condition}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-brand-teal scale-125' : 'bg-brand-teal/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-brand-teal to-soft-teal-hover text-white">
        <div className="container-max text-center">
          <div className="space-y-8 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Prenez Soin de vos Pieds Aujourd'hui
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Réservez votre consultation avec Dr. Sonda AFFES et découvrez des soins podologiques personnalisés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                className="btn-primary text-lg px-10 py-4"
              >
                Réserver Maintenant
              </Button>
              <Button 
                onClick={() => navigate('/services')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#40826D] text-lg px-8 py-4 rounded-md transition-all duration-300"
              >
                Découvrir nos Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
