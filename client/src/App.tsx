
import React, { useEffect, useState, useRef } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Phone, Mail, Star, Check, ArrowRight, Menu, X } from 'lucide-react';
import type { Service, CreateContactMessageInput } from '../../server/src/schema';

// Enhanced 3D-style Foot Icon Component with CSS transforms
function Enhanced3DFootIcon({ className = "", size = "w-12 h-12", scrollProgress = 0 }: { className?: string; size?: string; scrollProgress?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const transform = `
    translateY(${Math.sin(Date.now() * 0.001) * 5}px)
    rotateY(${20 + scrollProgress * 30}deg)
    rotateX(${10 + scrollProgress * 20}deg)
    scale(${1 + scrollProgress * 0.1})
  `;

  return (
    <div className={`${size} ${className} relative flex items-center justify-center perspective-1000`}>
      <div 
        className={`foot-3d-container transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform }}
      >
        {/* Main foot structure with 3D appearance */}
        <div className="relative w-full h-full">
          {/* Base foot shape with gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-300 via-teal-500 to-teal-700 rounded-lg transform rotate-3 shadow-lg"></div>
          <div className="absolute inset-1 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg transform -rotate-1 shadow-inner"></div>
          
          {/* Wireframe overlay */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full text-white opacity-80"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            {/* Foot outline */}
            <path d="M30 85 C25 85, 20 80, 20 75 L20 45 C20 35, 25 25, 35 20 C45 15, 55 15, 65 20 C75 25, 80 35, 80 45 L80 65 C80 70, 75 75, 70 75 L65 75 C60 75, 55 70, 55 65 L55 55 C55 50, 60 45, 65 45 C70 45, 75 50, 75 55" 
                  className="foot-wireframe-pulse" />
            
            {/* Grid lines for 3D effect */}
            <line x1="20" y1="30" x2="80" y2="30" className="opacity-40" />
            <line x1="20" y1="50" x2="80" y2="50" className="opacity-40" />
            <line x1="20" y1="70" x2="80" y2="70" className="opacity-40" />
            <line x1="35" y1="20" x2="35" y2="85" className="opacity-40" />
            <line x1="50" y1="15" x2="50" y2="85" className="opacity-40" />
            <line x1="65" y1="20" x2="65" y2="75" className="opacity-40" />
          </svg>
          
          {/* Toes with enhanced 3D effect */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 bg-gradient-to-br from-teal-300 to-teal-600 rounded-full shadow-sm toe-bounce`}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  transform: `scale(${1 - i * 0.1})` 
                }}
              />
            ))}
          </div>
          
          {/* Floating particles for medical/tech effect */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        </div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void }) {
  const [currentSection, setCurrentSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const navItems = [
      { id: 'home', label: 'Accueil', href: '#home' },
      { id: 'services', label: 'Services', href: '#services' },
      { id: 'about', label: 'À Propos', href: '#about' },
      { id: 'contact', label: 'Contact', href: '#contact' }
    ];

    const updateCurrentSection = () => {
      const sections = navItems.map(item => item.id);
      const currentScroll = window.scrollY + 100;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element && currentScroll >= element.offsetTop && currentScroll < element.offsetTop + element.offsetHeight) {
          setCurrentSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', updateCurrentSection);
    return () => window.removeEventListener('scroll', updateCurrentSection);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil', href: '#home' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'about', label: 'À Propos', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Enhanced3DFootIcon size="w-10 h-10" />
            <span className="text-2xl font-serif font-bold text-gray-800">PODOMUS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-200 text-sans ${
                  currentSection === item.id 
                    ? 'text-teal-600 border-b-2 border-teal-600 pb-1' 
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-200 text-sans"
            >
              Prendre RDV
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 px-4 text-gray-600 hover:text-teal-600 hover:bg-gray-50 transition-colors duration-200 text-sans"
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sans"
            >
              Prendre RDV
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section Component with Enhanced Animations
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setIsVisible(true);

    // Animate headline words with stagger effect using CSS animations
    if (titleRef.current) {
      const titleElement = titleRef.current;
      const words = titleElement.textContent?.split(' ') || [];
      titleElement.innerHTML = words.map((word, index) => 
        `<span class="inline-block title-word-animate" style="animation-delay: ${index * 0.15}s">${word}</span>`
      ).join(' ');
    }

    // Scroll progress tracking for 3D model interaction
    const updateScrollProgress = () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const servicesTop = servicesSection.offsetTop;
        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const scrollDistance = servicesTop - viewportHeight;
        const progress = Math.min(Math.max(currentScroll / scrollDistance, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-white to-teal-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 
            ref={titleRef}
            className="text-5xl lg:text-7xl font-serif font-bold text-gray-800 leading-tight mb-6"
          >
            Soins Experts pour vos Pieds
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed text-sans slide-up-delayed">
            Cabinet de podologie moderne avec Dr. Sonda AFFES. 
            Pédicurie médicale, orthèses plantaires sur mesure, et soins spécialisés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start slide-up-delayed-2">
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sans hero-button-primary"
              onClick={() => {
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Prendre Rendez-vous
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-4 rounded-full text-lg transform hover:scale-105 transition-all duration-200 text-sans hero-button-secondary"
              onClick={() => {
                const servicesElement = document.getElementById('services');
                if (servicesElement) {
                  servicesElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Nos Services
            </Button>
          </div>
        </div>

        <div className={`flex justify-center lg:justify-end transition-all duration-1200 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="relative">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center shadow-2xl floating-animation hero-3d-container">
              <Enhanced3DFootIcon 
                className="text-teal-600" 
                size="w-32 h-32 lg:w-40 lg:h-40" 
                scrollProgress={scrollProgress}
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center pulse-animation">
              <span className="text-2xl">🩺</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center pulse-animation" style={{ animationDelay: '0.5s' }}>
              <span className="text-xl">✨</span>
            </div>
            {/* Additional floating elements for depth */}
            <div className="absolute top-1/4 -left-8 w-16 h-16 bg-gradient-to-br from-teal-200 to-teal-300 rounded-full opacity-60 floating-animation" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 -right-8 w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-50 floating-animation" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Section Component
function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const serviceIcons = {
    'pedicurie_medicale': '🦶',
    'semelles_orthopediques': '👟',
    'orthoplastie_onychoplastie': '💅'
  };

  const loadServices = async () => {
    try {
      const result = await trpc.getActiveServices.query();
      setServices(result);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-6">
            Nos Services Spécialisés
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-sans">
            Des soins podologiques de haute qualité avec des techniques modernes 
            et un équipement de pointe pour votre bien-être.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: Service, index: number) => (
            <Card 
              key={service.id}
              className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 transform service-card-enhanced ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms' 
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 service-icon-bounce">
                  {serviceIcons[service.slug as keyof typeof serviceIcons] || '🔬'}
                </div>
                <CardTitle className="text-xl font-serif text-gray-800">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center mb-4 leading-relaxed text-sans">
                  {service.description}
                </CardDescription>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 text-sans">
                    <Clock size={14} className="mr-1" />
                    {service.duration_minutes} min
                  </Badge>
                  {service.price && (
                    <span className="text-lg font-semibold text-gray-800 text-sans">
                      {service.price.toFixed(0)} DT
                    </span>
                  )}
                </div>
                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full group-hover:bg-pink-600 group-hover:hover:bg-pink-700 transition-colors duration-300 transform hover:scale-105 text-sans service-button"
                  onClick={() => {
                    const contactElement = document.getElementById('contact');
                    if (contactElement) {
                      contactElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Réserver
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced service showcase for semelles orthopédiques */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-pink-50 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-serif font-bold text-gray-800 mb-6">
                Semelles Orthopédiques Sur Mesure
              </h3>
              <div className="space-y-4 mb-8">
                {[
                  { stage: "Analyse 3D", desc: "Scan complet de vos pieds", icon: "🔍" },
                  { stage: "Mesure Précise", desc: "Technologie de pointe", icon: "📐" },
                  { stage: "Fabrication", desc: "Création sur mesure", icon: "🔧" },
                  { stage: "Ajustement", desc: "Confort optimal", icon: "✨" }
                ].map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm transform transition-all duration-500 hover:scale-105 process-step-card ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${600 + index * 150}ms` }}
                  >
                    <div className="text-3xl">{step.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 font-serif">{step.stage}</h4>
                      <p className="text-gray-600 text-sans">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-teal-200 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-8xl orthotic-icon-float">👟</div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center pulse-animation">
                  <span className="text-2xl">📏</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const credentials = [
    "Diplômée en Podologie",
    "Spécialiste en Orthèses Plantaires",
    "Formation Continue en Techniques Modernes",
    "Membre de l'Association Tunisienne de Podologie"
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gradient-to-br from-teal-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-6">
              Dr. Sonda AFFES
            </h2>
            <h3 className="text-2xl text-teal-600 font-medium mb-6 font-serif">
              Podologue Experte
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 text-sans">
              Avec plus de 10 ans d'expérience dans le domaine de la podologie, 
              Dr. Sonda AFFES apporte une expertise technique de pointe combinée 
              à une approche humaine et personnalisée. Notre cabinet PODOMUS 
              représente l'excellence en matière de soins podologiques en Tunisie.
            </p>
            
            <div className="space-y-4 mb-8">
              {credentials.map((credential, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-3 transition-all duration-500 credential-item ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700 text-sans">{credential}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sans doctor-consult-button"
              onClick={() => {
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Consulter Dr. AFFES
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>

          <div className={`relative transition-all duration-1200 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:rotate-0 transition-transform duration-500 doctor-card-float">
              <div className="h-80 bg-gradient-to-br from-teal-100 to-stone-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 doctor-emoji-animation">👩‍⚕️</div>
                  <p className="text-gray-600 font-medium text-lg font-serif">Dr. Sonda AFFES</p>
                  <p className="text-sm text-gray-500 text-sans">Podologue Certifiée</p>
                  <div className="mt-4 flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current star-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Enhanced Contact Section Component with improved microinteractions
function ContactSection() {
  const [formData, setFormData] = useState<CreateContactMessageInput>({
    name: '',
    email: '',
    phone: null,
    subject: '',
    message: '',
    is_appointment_request: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await trpc.createContactMessage.mutate(formData);
      setSubmitStatus('success');
      
      // Trigger success animation
      if (submitButtonRef.current) {
        submitButtonRef.current.classList.add('submit-success-animation');
        setTimeout(() => {
          if (submitButtonRef.current) {
            submitButtonRef.current.classList.remove('submit-success-animation');
          }
        }, 600);
      }
      
      setFormData({
        name: '',
        email: '',
        phone: null,
        subject: '',
        message: '',
        is_appointment_request: true
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="text-t

eal-600" size={24} />,
      title: "Adresse",
      content: "Bm02, 1er étage, Golf Center 2\navenue de l'environnement\nDar Fadhal, La Soukra, Ariana"
    },
    {
      icon: <Phone className="text-teal-600" size={24} />,
      title: "Téléphone",
      content: "28 451 433"
    },
    {
      icon: <Mail className="text-teal-600" size={24} />,
      title: "Email",
      content: "sonda@podomus.tn"
    },
    {
      icon: <Clock className="text-teal-600" size={24} />,
      title: "Horaires",
      content: "Lun-Ven: 9h-18h\nSam: 9h-14h\nDim: Fermé"
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-6">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-sans">
            Prenez rendez-vous dès aujourd'hui pour des soins podologiques 
            professionnels et personnalisés.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className={`p-6 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 contact-info-card ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-teal-100 rounded-full contact-icon-pulse">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 font-serif">{info.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line text-sans">{info.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Enhanced Contact Form */}
          <Card className={`p-8 shadow-xl transition-all duration-1200 delay-300 contact-form-enhanced ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-serif text-gray-800">
                Demande de Rendez-vous
              </CardTitle>
              <CardDescription className="text-sans">
                Remplissez ce formulaire et nous vous contacterons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-sans">
                      Nom Complet *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactMessageInput) => ({ ...prev, name: e.target.value }))
                      }
                      onFocus={() => handleInputFocus('name')}
                      onBlur={handleInputBlur}
                      placeholder="Votre nom complet"
                      required
                      className={`transition-all duration-300 text-sans enhanced-input ${
                        focusedField === 'name' ? 'input-focused' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-sans">
                      Téléphone
                    </label>
                    <Input
                      value={formData.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactMessageInput) => ({ 
                          ...prev, 
                          phone: e.target.value || null 
                        }))
                      }
                      onFocus={() => handleInputFocus('phone')}
                      onBlur={handleInputBlur}
                      placeholder="Votre numéro de téléphone"
                      className={`transition-all duration-300 text-sans enhanced-input ${
                        focusedField === 'phone' ? 'input-focused' : ''
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-sans">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, email: e.target.value }))
                    }
                    onFocus={() => handleInputFocus('email')}
                    onBlur={handleInputBlur}
                    placeholder="votre@email.com"
                    required
                    className={`transition-all duration-300 text-sans enhanced-input ${
                      focusedField === 'email' ? 'input-focused' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-sans">
                    Sujet *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, subject: e.target.value }))
                    }
                    onFocus={() => handleInputFocus('subject')}
                    onBlur={handleInputBlur}
                    placeholder="Objet de votre demande"
                    required
                    className={`transition-all duration-300 text-sans enhanced-input ${
                      focusedField === 'subject' ? 'input-focused' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-sans">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, message: e.target.value }))
                    }
                    onFocus={() => handleInputFocus('message')}
                    onBlur={handleInputBlur}
                    placeholder="Décrivez votre demande ou vos symptômes..."
                    rows={4}
                    required
                    className={`transition-all duration-300 text-sans enhanced-input ${
                      focusedField === 'message' ? 'input-focused' : ''
                    }`}
                  />
                </div>

                <Button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sans enhanced-submit-button"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <>
                      Envoyer la Demande
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in success-message">
                    <Check className="mx-auto text-green-600 mb-2" size={24} />
                    <p className="text-green-800 font-medium text-sans">
                      Votre demande a été envoyée avec succès!
                    </p>
                    <p className="text-green-600 text-sm text-sans">
                      Nous vous contacterons rapidement.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                    <p className="text-red-800 font-medium text-sans">
                      Erreur lors de l'envoi. Veuillez réessayer.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Enhanced3DFootIcon className="text-teal-400" size="w-8 h-8" />
              <span className="text-2xl font-serif font-bold">PODOMUS</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sans">
              Cabinet de podologie moderne avec Dr. Sonda AFFES. 
              Soins experts pour la santé de vos pieds.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 font-serif">Contact</h3>
            <div className="space-y-2 text-gray-300 text-sans">
              <p>📍 Dar Fadhal, La Soukra, Ariana</p>
              <p>📞 28 451 433</p>
              <p>✉️ sonda@podomus.tn</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 font-serif">Services</h3>
            <ul className="space-y-2 text-gray-300 text-sans">
              <li>• Pédicurie Médicale</li>
              <li>• Orthèses Plantaires</li>
              <li>• Orthoplastie</li>
              <li>• Onychoplastie</li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="text-center text-gray-400 text-sans">
          <p>&copy; 2024 PODOMUS - Dr. Sonda AFFES. Tous droits réservés.</p>
          <p className="text-sm mt-2">Soins podologiques professionnels en Tunisie</p>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Smooth scrolling setup for browsers that don't support it natively
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
