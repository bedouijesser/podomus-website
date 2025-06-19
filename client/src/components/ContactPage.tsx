
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, Navigation } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateContactMessageInput } from '../../../server/src/schema';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export default function ContactPage({ navigate }: ContactPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<CreateContactMessageInput>({
    name: '',
    email: '',
    phone: null,
    subject: '',
    message: '',
    is_appointment_request: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await trpc.createContactMessage.mutate(formData);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: null,
        subject: '',
        message: '',
        is_appointment_request: false
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = {
    address: {
      line1: "Bm02, 1er étage, Golf Center 2",
      line2: "avenue de l'environnement",
      line3: "Dar Fadhal, La Soukra, Ariana",
      full: "Bm02, 1er étage, Golf Center 2, avenue de l'environnement, Dar Fadhal, La Soukra, Ariana"
    },
    phone: "28 451 433",
    email: "sonda@podomus.tn",
    hours: {
      "Lundi - Vendredi": "8h00 - 18h00",
      "Samedi": "8h00 - 13h00",
      "Dimanche": "Fermé"
    }
  };

  const commonSubjects = [
    "Demande de rendez-vous",
    "Renseignements sur les tarifs",
    "Question sur un traitement",
    "Suivi de consultation",
    "Informations sur les orthèses",
    "Urgence podologique",
    "Autre"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <Card className="max-w-md mx-auto bg-white border-0 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#40826D]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-[#40826D]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#404040]">
                Message Envoyé !
              </h2>
              <p className="text-[#404040]/70">
                Votre message a bien été envoyé. Dr. Sonda AFFES vous répondra dans les plus brefs délais.
              </p>
            </div>
            <div className="space-y-2 text-sm text-[#404040]/60">
              <p>Délai de réponse habituel : 24h</p>
              <p>Pour les urgences : 28 451 433</p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="btn-secondary"
            >
              Envoyer un autre message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5]">
        <div className="container-max">
          <div className="text-center space-y-8">
            <div className="space-y-4 fadeInUp">
              <Badge className="bg-[#40826D] text-white px-6 py-3 text-lg font-medium">
                Contactez-nous
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#404040]">
                Prenons Soin de vos Pieds
                <span className="text-[#40826D] block">Ensemble</span>
              </h1>
              <p className="text-lg text-[#404040]/70 max-w-3xl mx-auto">
                Contactez Dr. Sonda AFFES pour prendre rendez-vous ou poser vos questions. 
                Nous sommes là pour vous accompagner dans votre parcours de santé podologique.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp card-hover">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Téléphone</h3>
                  <p className="text-[#404040]/70 font-medium">{contactInfo.phone}</p>
                  <p className="text-xs text-[#404040]/50 mt-1">Appel direct</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp stagger-1 card-hover">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Email</h3>
                  <p className="text-[#404040]/70 font-medium">{contactInfo.email}</p>
                  <p className="text-xs text-[#404040]/50 mt-1">Réponse sous 24h</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg fadeInUp stagger-2 card-hover">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#40826D] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#404040] mb-2">Adresse</h3>
                  <p className="text-[#404040]/70 text-sm">La Soukra, Ariana</p>
                  <p className="text-xs text-[#404040]/50 mt-1">Parking disponible</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8 fadeInUp">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#404040]">
                  Envoyez-nous un Message
                </h2>
                <p className="text-lg text-[#404040]/70">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#404040]">
                      Nom complet *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactMessageInput) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Votre nom et prénom"
                      className="border-[#40826D]/20 focus:border-[#40826D] focus:ring-[#40826D]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#404040]">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactMessageInput) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="votre@email.com"
                      className="border-[#40826D]/20 focus:border-[#40826D] focus:ring-[#40826D]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#404040]">
                    Téléphone (optionnel)
                  </label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, phone: e.target.value || null }))
                    }
                    placeholder="Votre numéro de téléphone"
                    className="border-[#40826D]/20 focus:border-[#40826D] focus:ring-[#40826D]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#404040]">
                    Sujet *
                  </label>
                  <Select 
                    value={formData.subject || ''} 
                    onValueChange={(value: string) => 
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, subject: value }))
                    }
                  >
                    <SelectTrigger className="border-[#40826D]/20 focus:border-[#40826D] focus:ring-[#40826D]">
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#404040]">
                    Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Décrivez votre demande, vos symptômes ou vos questions..."
                    className="border-[#40826D]/20 focus:border-[#40826D] focus:ring-[#40826D] min-h-[120px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="appointment"
                    checked={formData.is_appointment_request}
                    onCheckedChange={(checked: boolean) =>
                      setFormData((prev: CreateContactMessageInput) => ({ ...prev, is_appointment_request: checked }))
                    }
                    className="border-[#40826D] data-[state=checked]:bg-[#40826D]"
                  />
                  <label htmlFor="appointment" className="text-sm text-[#404040] cursor-pointer">
                    Il s'agit d'une demande de rendez-vous
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le Message
                    </div>
                  )}
                </Button>

                <p className="text-xs text-[#404040]/60">
                  En envoyant ce formulaire, vous acceptez que vos données soient utilisées 
                  pour vous recontacter concernant votre demande.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 fadeInUp stagger-1">
              <Card className="bg-gradient-to-br from-[#40826D] to-[#335A4F] text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Informations de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Adresse du Cabinet</h3>
                      <div className="text-sm opacity-90 leading-relaxed">
                        <div>{contactInfo.address.line1}</div>
                        <div>{contactInfo.address.line2}</div>
                        <div>{contactInfo.address.line3}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Téléphone</h3>
                      <div className="text-sm opacity-90">
                        <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                           className="hover:underline">
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <div className="text-sm opacity-90">
                        <a href={`mailto:${contactInfo.email}`} 
                           className="hover:underline">
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Horaires d'Ouverture</h3>
                      <div className="space-y-1 text-sm opacity-90">
                        {Object.entries(contactInfo.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span>{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-[#40826D]/10 to-[#C71585]/10 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Navigation className="w-12 h-12 text-[#40826D] mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-semibold text-[#404040]">
                          Nous Localiser
                        </h3>
                        <p className="text-[#404040]/70 text-sm">
                          Golf Center 2, La Soukra, Ariana
                        </p>
                        <p className="text-xs text-[#404040]/50">
                          Parking gratuit disponible
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-[#C71585]/5 border border-[#C71585]/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#C71585]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#C71585]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#404040]">
                        Urgences Podologiques
                      </h3>
                      <p className="text-sm text-[#404040]/70">
                        En cas d'urgence (douleur intense, blessure, infection), 
                        contactez-nous immédiatement au {contactInfo.phone}. 
                        Nous nous efforçons de proposer des créneaux d'urgence le jour même.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center space-y-8 fadeInUp">
            <h2 className="font-serif text-3xl font-bold text-[#404040]">
              Autres Moyens de nous Contacter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#40826D]/10 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6 text-[#40826D]" />
                  </div>
                  <h3 className="font-semibold text-[#404040]">Appel Direct</h3>
                  <p className="text-sm text-[#404040]/70">
                    Pour une prise de rendez-vous immédiate ou des questions urgentes
                  </p>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                    <Button className="btn-secondary text-sm">Appeler</Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#40826D]/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-[#40826D]" />
                  </div>
                  <h3 className="font-semibold text-[#404040]">Email Direct</h3>
                  <p className="text-sm text-[#404040]/70">
                    Pour des questions détaillées ou l'envoi de documents
                  </p>
                  <a href={`mailto:${contactInfo.email}`}>
                    <Button className="btn-secondary text-sm">Écrire</Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#40826D]/10 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6 text-[#40826D]" />
                  </div>
                  <h3 className="font-semibold text-[#404040]">Visite Directe</h3>
                  <p className="text-sm text-[#404040]/70">
                    Rendez-vous directement au cabinet (sur rendez-vous uniquement)
                  </p>
                  <Button 
                    onClick={() => navigate('/patient-information')}
                    className="btn-secondary text-sm"
                  >
                    Localiser
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
