
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, MapPin, Phone, FileText, AlertCircle, CheckCircle, Heart, Shield } from 'lucide-react';

interface PatientInfoPageProps {
  navigate: (path: string) => void;
}

export default function PatientInfoPage({ navigate }: PatientInfoPageProps) {
  const visitSteps = [
    {
      step: 1,
      title: "Accueil et prise en charge",
      description: "Accueil personnalisé, vérification de vos informations et présentation du cabinet",
      duration: "5 min"
    },
    {
      step: 2,
      title: "Anamnèse et examen clinique",
      description: "Discussion détaillée de vos symptômes, antécédents médicaux et examen complet",
      duration: "15 min"
    },
    {
      step: 3,
      title: "Diagnostic et plan de traitement",
      description: "Explication du diagnostic, présentation des options thérapeutiques disponibles",
      duration: "10 min"
    },
    {
      step: 4,
      title: "Traitement ou première intervention",
      description: "Début du traitement selon le plan établi (soins, prise d'empreintes, etc.)",
      duration: "20-30 min"
    },
    {
      step: 5,
      title: "Conseils et planification du suivi",
      description: "Conseils personnalisés, prescription si nécessaire, planification des rendez-vous suivants",
      duration: "5 min"
    }
  ];

  const preparations = [
    {
      category: "Documents à apporter",
      items: [
        "Carte d'identité ou passeport",
        "Carnet de soins ou ordonnances médicales",
        "Résultats d'examens récents (radiographies, bilans)",
        "Liste des médicaments actuels",
        "Carte d'assurance maladie"
      ]
    },
    {
      category: "Préparation physique",
      items: [
        "Porter des chaussettes propres et faciles à retirer",
        "Éviter les vernis à ongles avant la consultation",
        "Nettoyer soigneusement vos pieds avant la visite",
        "Porter des chaussures confortables et faciles à enlever",
        "Prévoir des vêtements permettant d'exposer facilement vos jambes"
      ]
    },
    {
      category: "Préparation mentale",
      items: [
        "Préparer une liste de vos questions et préoccupations",
        "Noter l'évolution de vos symptômes depuis leur apparition",
        "Réfléchir à votre historique de douleurs ou problèmes podologiques",
        "Identifier les activités qui aggravent ou soulagent vos symptômes",
        "Préparer des informations sur votre mode de vie et activités sportives"
      ]
    }
  ];

  const faqs = [
    {
      question: "À quelle fréquence dois-je consulter un podologue ?",
      answer: "La fréquence dépend de vos besoins spécifiques. Pour un suivi préventif, une consultation annuelle est recommandée. En cas de pathologies actives, les rendez-vous peuvent être plus fréquents (toutes les 4-8 semaines). Dr. Affes établira avec vous un calendrier personnalisé."
    },
    {
      question: "Les soins podologiques sont-ils douloureux ?",
      answer: "La plupart des soins podologiques sont indolores. Dr. Affes utilise des techniques douces et s'assure de votre confort tout au long du traitement. En cas de sensibilité particulière, des solutions adaptées peuvent être mises en place pour minimiser l'inconfort."
    },
    {
      question: "Combien de temps dure une consultation ?",
      answer: "Une première consultation dure généralement entre 45 minutes et 1 heure. Les consultations de suivi durent environ 30 minutes. Pour les traitements spécialisés comme les orthèses plantaires, plusieurs rendez-vous peuvent être nécessaires."
    },
    {
      question: "Les soins sont-ils remboursés par l'assurance maladie ?",
      answer: "En Tunisie, certains soins podologiques peuvent être pris en charge par l'assurance maladie sur prescription médicale. Il est recommandé de vérifier votre couverture avant la consultation. Dr. Affes peut vous fournir tous les documents nécessaires pour vos remboursements."
    },
    {
      question: "Puis-je venir avec des chaussures orthopédiques existantes ?",
      answer: "Absolument ! Il est même recommandé d'apporter vos chaussures habituelles et toute orthèse existante. Cela permet à Dr. Affes d'évaluer l'usure, l'adaptation et l'efficacité de vos équipements actuels."
    },
    {
      question: "Comment puis-je prendre rendez-vous ?",
      answer: "Vous pouvez prendre rendez-vous par téléphone au 28 451 433, par email à sonda@podomus.tn, ou directement via notre formulaire de contact en ligne. Nous nous efforçons de proposer des créneaux adaptés à votre agenda."
    },
    {
      question: "Que faire en cas d'urgence podologique ?",
      answer: "En cas d'urgence (douleur intense, blessure, infection), contactez immédiatement le cabinet. Nous nous efforçons de proposer des créneaux d'urgence le jour même. En dehors des heures d'ouverture, rendez-vous aux urgences médicales."
    },
    {
      question: "Le cabinet est-il accessible aux personnes à mobilité réduite ?",
      answer: "Oui, le cabinet est situé au 1er étage avec un accès facilité. Si vous avez des besoins spécifiques en matière d'accessibilité, n'hésitez pas à nous en informer lors de la prise de rendez-vous pour que nous puissions vous accompagner au mieux."
    }
  ];

  const practicalInfo = {
    address: "Bm02, 1er étage, Golf Center 2, avenue de l'environnement, Dar Fadhal, La Soukra, Ariana",
    phone: "28 451 433",
    email: "sonda@podomus.tn",
    hours: {
      "Lundi - Vendredi": "8h00 - 18h00",
      "Samedi": "8h00 - 13h00",
      "Dimanche": "Fermé"
    },
    parking: "Parking gratuit disponible",
    accessibility: "Accès facilité aux personnes à mobilité réduite"
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <div className="container-max">
          <div className="text-center space-y-8">
            <div className="space-y-4 fadeInUp">
              <Badge className="bg-[#40826D] text-white px-6 py-3 text-lg font-medium">
                Informations Patients
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#404040]">
                Préparez Votre
                <span className="text-[#40826D] block">Première Visite</span>
              </h1>
              <p className="text-lg text-[#404040]/70 max-w-3xl mx-auto">
                Toutes les informations pratiques pour préparer au mieux votre consultation 
                avec Dr. Sonda AFFES et optimiser votre prise en charge.
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Durée Consultation</h3>
                  <p className="text-[#404040]/70">45-60 min première visite</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp stagger-1">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Prise de RDV</h3>
                  <p className="text-[#404040]/70">28 451 433</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp stagger-2">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Localisation</h3>
                  <p className="text-[#404040]/70">La Soukra, Ariana</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* First Visit Process */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040] mb-4">
              Déroulement de votre Première Visite
            </h2>
            <p className="text-lg text-[#404040]/70 max-w-2xl mx-auto">
              Découvrez comment se déroule une consultation au cabinet Podomus pour vous sentir en confiance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {visitSteps.map((step, index) => (
                <Card key={index} className="bg-white border-l-4 border-l-[#40826D] shadow-lg fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-[#40826D] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-semibold text-[#404040]">
                            {step.title}
                          </h3>
                          <Badge variant="outline" className="border-[#40826D] text-[#40826D]">
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-[#404040]/70 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="text-center mb-12 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040] mb-4">
              Comment bien Préparer votre Visite
            </h2>
            <p className="text-lg text-[#404040]/70">
              Suivez ces recommandations pour optimiser votre consultation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {preparations.map((category, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-[#404040] flex items-center">
                    <div className="w-8 h-8 bg-[#40826D]/10 rounded-full flex items-center justify-center mr-3">
                      {index === 0 && <FileText className="w-4 h-4 text-[#40826D]" />}
                      {index === 1 && <Heart className="w-4 h-4 text-[#40826D]" />}
                      {index === 2 && <Shield className="w-4 h-4 text-[#40826D]" />}
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-[#40826D] mt-1 flex-shrink-0" />
                        <span className="text-[#404040] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12 fadeInUp">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040] mb-4">
              Questions Fréquemment Posées
            </h2>
            <p className="text-lg text-[#404040]/70">
              Trouvez rapidement les réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="max-w-4xl mx-auto fadeInUp stagger-1">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-[#40826D]/20 rounded-lg px-6">
                  <AccordionTrigger className="font-serif font-semibold text-[#404040] hover:text-[#40826D] py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#404040]/70 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Practical Information */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                  Informations Pratiques
                </h2>
                <p className="text-lg text-[#404040]/70">
                  Toutes les informations utiles pour planifier votre visite au cabinet
                </p>
              </div>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-[#40826D] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[#404040] mb-2">Adresse</h3>
                      <p className="text-[#404040]/70 text-sm leading-relaxed">
                        {practicalInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 text-[#40826D] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[#404040] mb-2">Contact</h3>
                      <p className="text-[#404040]/70 text-sm">{practicalInfo.phone}</p>
                      <p className="text-[#404040]/70 text-sm">{practicalInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-[#40826D] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[#404040] mb-2">Horaires</h3>
                      <div className="space-y-1">
                        {Object.entries(practicalInfo.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="text-[#404040]/70">{day}:</span>
                            <span className="text-[#404040]/70">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#40826D]/10">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-[#40826D]" />
                      <span className="text-[#404040] text-sm">{practicalInfo.parking}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-[#40826D]" />
                      <span className="text-[#404040] text-sm">{practicalInfo.accessibility}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8 fadeInUp stagger-1">
              <Card className="bg-gradient-to-br from-[#40826D] to-[#335A4F] text-white border-0 shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">
                    Conseils Importants
                  </h3>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm opacity-90">
                        Arrivez 10 minutes avant votre rendez-vous pour l'accueil administratif
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm opacity-90">
                        En cas d'empêchement, prévenez au moins 24h à l'avance
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm opacity-90">
                        Apportez tous vos documents médicaux pertinents
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm opacity-90">
                        N'hésitez pas à poser toutes vos questions pendant la consultation
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <h3 className="font-serif text-xl font-semibold text-[#404040]">
                    Urgences Podologiques
                  </h3>
                  <p className="text-[#404040]/70 text-sm">
                    En cas de douleur intense, blessure ou infection, contactez-nous immédiatement. 
                    Nous nous efforçons de proposer des créneaux d'urgence le jour même.
                  </p>
                  <a href="tel:28451433">
                    <Button className="btn-primary w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Appeler en Urgence
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#40826D] to-[#335A4F] text-white">
        <div className="container-max text-center">
          <div className="space-y-8 fadeInUp max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Prêt pour votre Consultation ?
            </h2>
            <p className="text-xl opacity-90">
              Maintenant que vous êtes bien informé, prenez rendez-vous avec Dr. Sonda AFFES 
              pour commencer votre parcours vers des pieds en parfaite santé.
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
