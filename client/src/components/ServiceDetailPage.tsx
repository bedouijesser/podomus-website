
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Euro, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import type { Service } from '../../../server/src/schema';

interface ServiceDetailPageProps {
  services: Service[];
  slug: string;
  navigate: (path: string) => void;
}

export default function ServiceDetailPage({ services, slug, navigate }: ServiceDetailPageProps) {
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-3xl text-[#404040]">Service non trouvé</h1>
          <Button onClick={() => navigate('/services')} className="btn-secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux services
          </Button>
        </div>
      </div>
    );
  }

  const getServiceDetails = (serviceSlug: string) => {
    switch (serviceSlug) {
      case 'pedicurie-medicale':
        return {
          icon: '🦶',
          title: 'Pédicurie Médicale',
          subtitle: 'Soins professionnels des pieds',
          description: 'Traitement spécialisé des affections podologiques avec des techniques médicales avancées pour la santé et le bien-être de vos pieds.',
          detailedDescription: `La pédicurie médicale est une spécialité qui traite les affections des pieds de manière thérapeutique. Contrairement à la pédicurie esthétique, elle s'adresse aux problématiques médicales et pathologiques du pied.

Dr. Sonda AFFES utilise des techniques et outils médicaux spécialisés pour traiter efficacement vos problèmes podologiques dans le respect des normes d'hygiène et de sécurité les plus strictes.`,
          benefits: [
            'Traitement des cors et durillons',
            'Soins des ongles incarnés',
            'Traitement des mycoses',
            'Élimination des callosités',
            'Prévention des complications diabétiques',
            'Conseils d\'hygiène podologique'
          ],
          process: [
            'Examen clinique approfondi',
            'Diagnostic podologique',
            'Traitement personnalisé',
            'Conseils de prévention',
            'Suivi thérapeutique'
          ],
          indications: [
            'Douleurs aux pieds',
            'Cors et durillons',
            'Ongles incarnés',
            'Mycoses des pieds',
            'Hyperkératose',
            'Suivi diabétique'
          ]
        };
      case 'semelles-orthopediques':
        return {
          icon: '👟',
          title: 'Semelles Orthopédiques',
          subtitle: 'Orthèses plantaires sur mesure',
          description: 'Conception et fabrication de semelles orthopédiques personnalisées pour corriger les déséquilibres posturaux et soulager les douleurs.',
          detailedDescription: `Les semelles orthopédiques sur mesure sont des dispositifs médicaux conçus spécifiquement pour vos pieds. Elles corrigent les déséquilibres biomécaniques, soulagent les douleurs et améliorent la fonction du pied.

Grâce à une analyse biomécanique précise et aux technologies de pointe, Dr. Sonda AFFES crée des orthèses plantaires parfaitement adaptées à votre morphologie et à vos besoins spécifiques.`,
          benefits: [
            'Correction des déséquilibres posturaux',
            'Soulagement des douleurs plantaires',
            'Amélioration de la démarche',
            'Prévention des déformations',
            'Support de voûte plantaire',
            'Répartition optimale des pressions'
          ],
          process: [
            'Examen biomécanique complet',
            'Analyse de la démarche',
            'Prise d\'empreintes précises',
            'Conception sur mesure',
            'Fabrication personnalisée',
            'Ajustements et suivi'
          ],
          indications: [
            'Pieds plats ou creux',
            'Fasciite plantaire',
            'Épine calcanéenne',
            'Métatarsalgies',
            'Douleurs lombaires',
            'Déséquilibres posturaux'
          ]
        };
      case 'orthoplastie-onychoplastie':
        return {
          icon: '💅',
          title: 'Orthoplastie & Onychoplastie',
          subtitle: 'Correction des déformations des orteils et ongles',
          description: 'Techniques spécialisées pour corriger les déformations des orteils et des ongles, améliorant fonction et esthétique.',
          detailedDescription: `L'orthoplastie et l'onychoplastie sont des techniques de correction non-chirurgicales qui permettent de traiter les déformations des orteils et des ongles. Ces méthodes utilisent des matériaux biocompatibles pour restaurer la forme et la fonction normales.

Dr. Sonda AFFES maîtrise ces techniques avancées pour vous offrir des solutions efficaces et durables, évitant souvent le recours à la chirurgie.`,
          benefits: [
            'Correction des déformations',
            'Amélioration esthétique',
            'Soulagement des douleurs',
            'Prévention des complications',
            'Alternative non-chirurgicale',
            'Résultats durables'
          ],
          process: [
            'Évaluation de la déformation',
            'Choix de la technique adaptée',
            'Réalisation de l\'orthèse',
            'Pose et ajustement',
            'Contrôles réguliers',
            'Maintenance et suivi'
          ],
          indications: [
            'Ongles incarnés récidivants',
            'Déformations des orteils',
            'Chevauchement des orteils',
            'Orteils en marteau',
            'Correctiion de la courbure unguéale',
            'Prévention des récidives'
          ]
        };
      default:
        return {
          icon: '🦶',
          title: service.name,
          subtitle: 'Service spécialisé',
          description: service.description,
          detailedDescription: service.description,
          benefits: [],
          process: [],
          indications: []
        };
    }
  };

  const serviceDetails = getServiceDetails(service.slug);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-[#F5F5F5] py-8">
        <div className="container-max">
          <div className="flex items-center space-x-2 text-sm text-[#404040]/60">
            <button onClick={() => navigate('/')} className="hover:text-[#40826D]">Accueil</button>
            <span>/</span>
            <button onClick={() => navigate('/services')} className="hover:text-[#40826D]">Services</button>
            <span>/</span>
            <span className="text-[#404040]">{serviceDetails.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <div className="container-max">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fadeInUp">
              <button 
                onClick={() => navigate('/services')}
                className="inline-flex items-center text-[#40826D] hover:text-[#335A4F] transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux services
              </button>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#40826D]/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">{serviceDetails.icon}</span>
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                      {serviceDetails.title}
                    </h1>
                    <p className="text-[#40826D] font-medium">{serviceDetails.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-lg text-[#404040]/70 leading-relaxed">
                  {serviceDetails.description}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#40826D]" />
                  <span className="text-[#404040]">{service.duration_minutes} minutes</span>
                </div>
                {service.price && (
                  <div className="flex items-center space-x-2">
                    <Euro className="w-5 h-5 text-[#40826D]" />
                    <span className="text-[#404040] font-semibold">{service.price}€</span>
                  </div>
                )}
                <Badge className="bg-[#40826D] text-white">
                  {service.is_active ? 'Disponible' : 'Indisponible'}
                </Badge>
              </div>

              <Button onClick={() => navigate('/contact')} className="btn-primary">
                <Phone className="mr-2 h-4 w-4" />
                Prendre Rendez-vous
              </Button>
            </div>

            {/* Interactive Service Visualization */}
            <div className="relative fadeInUp stagger-1">
              <div className="aspect-square bg-gradient-to-br from-[#40826D]/10 to-[#C71585]/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="w-4/5 h-4/5 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-8xl mb-4 animate-pulse">{serviceDetails.icon}</div>
                    <div className="text-[#404040] font-serif text-2xl font-semibold">
                      {serviceDetails.title}
                    </div>
                  </div>
                </div>
                
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-3 h-3 bg-[#40826D] rounded-full animate-bounce"></div>
                  <div className="absolute top-8 right-8 w-2 h-2 bg-[#C71585] rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-[#40826D] rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#C71585] rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-[#404040] leading-relaxed space-y-4">
                {serviceDetails.detailedDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Process */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits */}
            {serviceDetails.benefits.length > 0 && (
              <Card className="bg-white border-0 shadow-lg fadeInUp">
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-[#404040] mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 text-[#40826D] mr-3" />
                    Bénéfices
                  </h3>
                  <ul className="space-y-3">
                    {serviceDetails.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#40826D] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-[#404040]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Process */}
            {serviceDetails.process.length > 0 && (
              <Card className="bg-white border-0 shadow-lg fadeInUp stagger-1">
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-[#404040] mb-6 flex items-center">
                    <Clock className="w-6 h-6 text-[#40826D] mr-3" />
                    Processus
                  </h3>
                  <ol className="space-y-3">
                    {serviceDetails.process.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-[#40826D] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-[#404040]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Indications */}
            {serviceDetails.indications.length > 0 && (
              <Card className="bg-white border-0 shadow-lg fadeInUp stagger-2">
                <CardContent className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-[#404040] mb-6 flex items-center">
                    <AlertCircle className="w-6 h-6 text-[#40826D] mr-3" />
                    Indications
                  </h3>
                  <ul className="space-y-3">
                    {serviceDetails.indications.map((indication, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#C71585] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-[#404040]">{indication}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#40826D] to-[#335A4F] text-white">
        <div className="container-max text-center">
          <div className="space-y-8 fadeInUp max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Prêt à Bénéficier de ce Service ?
            </h2>
            <p className="text-xl opacity-90">
              Consultez Dr. Sonda AFFES pour une évaluation personnalisée et découvrez comment ce service peut améliorer votre bien-être.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#C71585] hover:bg-[#A0125F] text-white font-medium px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="mr-2 h-4 w-4" />
                Réserver Maintenant
              </Button>
              <Button 
                onClick={() => navigate('/patient-information')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#40826D]"
              >
                Informations Pratiques
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
