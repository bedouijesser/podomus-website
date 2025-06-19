
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, GraduationCap, Users, Calendar, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export default function AboutPage({ navigate }: AboutPageProps) {
  const qualifications = [
    {
      title: "Diplôme Universitaire en Podologie",
      institution: "Université de Médecine",
      year: "2008",
      description: "Formation complète en soins podologiques et biomécanique du pied"
    },
    {
      title: "Spécialisation en Orthèses Plantaires",
      institution: "Institut Spécialisé",
      year: "2012",
      description: "Expertise avancée en conception et fabrication d'orthèses sur mesure"
    },
    {
      title: "Formation Continue en Podologie Moderne",
      institution: "Congrès Internationaux",
      year: "2020-2024",
      description: "Mise à jour constante des techniques et technologies de pointe"
    }
  ];

  const achievements = [
    { icon: Users, value: "2000+", label: "Patients traités avec succès" },
    { icon: Calendar, value: "15+", label: "Années d'expérience professionnelle" },
    { icon: Award, value: "12", label: "Formations spécialisées certifiées" },
    { icon: GraduationCap, value: "3", label: "Diplômes universitaires" }
  ];

  const philosophy = [
    {
      title: "Approche Holistique",
      description: "Prise en charge globale du patient en tenant compte de tous les aspects de sa santé podologique",
      icon: "🔍"
    },
    {
      title: "Technologies Avancées",
      description: "Utilisation d'équipements modernes pour des diagnostics précis et des traitements efficaces",
      icon: "⚡"
    },
    {
      title: "Personnalisation",
      description: "Chaque traitement est adapté aux besoins spécifiques et au mode de vie du patient",
      icon: "🎯"
    },
    {
      title: "Prévention",
      description: "Éducation et conseils pour prévenir les problèmes podologiques futurs",
      icon: "🛡️"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <Badge className="bg-[#C71585] text-white px-6 py-3 text-lg font-medium">
                  Dr. Sonda AFFES
                </Badge>
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#404040]">
                  Votre Podologue
                  <span className="text-[#40826D] block">de Confiance</span>
                </h1>
                <p className="text-lg text-[#404040]/70 leading-relaxed">
                  Avec plus de 15 ans d'expérience en podologie, je m'engage à offrir à mes patients 
                  des soins personnalisés et de haute qualité dans un environnement moderne et sécurisé.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#40826D]" />
                  <span className="text-[#404040]">Cabinet moderne à La Soukra, Ariana</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#40826D]" />
                  <span className="text-[#404040]">28 451 433</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#40826D]" />
                  <span className="text-[#404040]">sonda@podomus.tn</span>
                </div>
              </div>

              <Button onClick={() => navigate('/contact')} className="btn-primary">
                Prendre Rendez-vous
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Professional Portrait Area */}
            <div className="relative fadeInUp stagger-1">
              <div className="aspect-square bg-gradient-to-br from-[#40826D]/10 to-[#C71585]/10 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="w-4/5 h-4/5 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-8xl mb-4">👩‍⚕️</div>
                    <div className="text-[#404040] font-serif text-xl font-semibold">
                      Dr. Sonda AFFES
                    </div>
                    <div className="text-[#40826D] text-sm font-medium">
                      Podologue Certifiée
                    </div>
                  </div>
                </div>
                
                {/* Professional badges */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#40826D] rounded-full flex items-center justify-center text-white animate-pulse">
                  <Award className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#C71585] rounded-full flex items-center justify-center text-white animate-pulse" style={{animationDelay: '1s'}}>
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#40826D]/10 rounded-full flex items-center justify-center">
                    <achievement.icon className="w-8 h-8 text-[#40826D]" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#404040] mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-[#404040]/60 leading-tight">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 fadeInUp">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                Mon Parcours Professionnel
              </h2>
              <p className="text-lg text-[#404040]/70">
                Une passion pour la podologie et un engagement constant envers l'excellence des soins
              </p>
            </div>

            <div className="prose prose-lg max-w-none fadeInUp stagger-1">
              <div className="text-[#404040] leading-relaxed space-y-6">
                <p>
                  Depuis le début de ma carrière en podologie, j'ai eu la passion de comprendre et de traiter 
                  les pathologies du pied sous tous leurs aspects. Diplômée de l'université avec une spécialisation 
                  en podologie médicale, j'ai rapidement développé une expertise particulière dans le domaine 
                  des orthèses plantaires sur mesure.
                </p>
                
                <p>
                  Mon approche se base sur une écoute attentive de mes patients et une analyse précise de leurs 
                  besoins. Chaque consultation est l'occasion d'établir un diagnostic complet et de proposer 
                  un plan de traitement personnalisé, adapté au mode de vie et aux objectifs de chaque patient.
                </p>
                
                <p>
                  L'évolution constante des technologies médicales m'amène à me former régulièrement aux 
                  nouvelles techniques et équipements. Cette démarche de formation continue me permet d'offrir 
                  à mes patients les soins les plus avancés et efficaces disponibles en podologie moderne.
                </p>
                
                <p>
                  Au-delà de l'aspect technique, je crois fermement en l'importance de la prévention et de 
                  l'éducation thérapeutique. Mon rôle ne se limite pas au traitement des pathologies existantes, 
                  mais s'étend également à l'accompagnement de mes patients dans l'adoption de bonnes pratiques 
                  pour la santé de leurs pieds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040] mb-4">
              Formations & Certifications
            </h2>
            <p className="text-lg text-[#404040]/70">
              Un parcours académique solide et une formation continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualifications.map((qualification, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg card-hover fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#40826D]/10 rounded-full flex items-center justify-center mb-6">
                      <GraduationCap className="w-6 h-6 text-[#40826D]" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-semibold text-[#404040]">
                        {qualification.title}
                      </h3>
                      <div className="text-[#40826D] font-medium">
                        {qualification.institution}
                      </div>
                      <div className="text-sm text-[#404040]/60">
                        {qualification.year}
                      </div>
                    </div>
                    
                    <p className="text-[#404040]/70 leading-relaxed">
                      {qualification.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="text-center mb-12 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040] mb-4">
              Ma Philosophie de Soins
            </h2>
            <p className="text-lg text-[#404040]/70 max-w-2xl mx-auto">
              Une approche centrée sur le patient avec des valeurs fortes qui guident ma pratique quotidienne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophy.map((principle, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{principle.icon}</div>
                      <h3 className="font-serif text-xl font-semibold text-[#404040]">
                        {principle.title}
                      </h3>
                    </div>
                    <p className="text-[#404040]/70 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cabinet Info Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                  Un Cabinet Moderne et Équipé
                </h2>
                <p className="text-lg text-[#404040]/70 leading-relaxed">
                  Situé au cœur de La Soukra à Ariana, le cabinet Podomus vous accueille dans un 
                  environnement moderne, hygiénique et confortable, équipé des dernières technologies 
                  en podologie.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#40826D] rounded-full mt-2"></div>
                  <span className="text-[#404040]">Équipements médicaux de dernière génération</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#40826D] rounded-full mt-2"></div>
                  <span className="text-[#404040]">Environnement stérilisé selon les normes médicales</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#40826D] rounded-full mt-2"></div>
                  <span className="text-[#404040]">Accès facile avec parking disponible</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#40826D] rounded-full mt-2"></div>
                  <span className="text-[#404040]">Horaires flexibles pour s'adapter à vos besoins</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-[#404040]/60">Adresse complète :</div>
                <div className="text-[#404040] font-medium">
                  Bm02, 1er étage, Golf Center 2<br />
                  avenue de l'environnement<br />
                  Dar Fadhal, La Soukra, Ariana
                </div>
              </div>

              <Button onClick={() => navigate('/contact')} className="btn-primary">
                Nous Localiser
                <MapPin className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative fadeInUp stagger-1">
              <div className="aspect-square bg-gradient-to-br from-[#40826D]/10 to-[#C71585]/10 rounded-3xl flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🏥</div>
                    <div className="text-[#404040] font-serif text-xl font-semibold">
                      Cabinet Podomus
                    </div>
                    <div className="text-[#40826D] text-sm">
                      Moderne • Sécurisé • Accueillant
                    </div>
                  </div>
                </div>
              </div>
              
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
          <div className="space-y-8 fadeInUp max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Prêt à Prendre Soin de vos Pieds ?
            </h2>
            <p className="text-xl opacity-90">
              Faites confiance à l'expérience et à l'expertise du Dr. Sonda AFFES pour tous vos besoins podologiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#C71585] hover:bg-[#A0125F] text-white font-medium px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Prendre Rendez-vous
              </Button>
              <Button 
                onClick={() => navigate('/services')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#40826D]"
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
