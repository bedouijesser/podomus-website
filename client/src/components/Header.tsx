
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  navigate: (path: string) => void;
  currentPath: string;
}

export default function Header({ navigate, currentPath }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'À Propos', href: '/about' },
    { name: 'Informations Patient', href: '/patient-information' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return currentPath === href;
    return currentPath.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-brand-teal text-white py-2 px-4 text-sm">
        <div className="container-max flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hover:text-white/90 transition-colors duration-200">
              <Phone size={14} />
              <a href="tel:28451433" className="hover:underline">28 451 433</a>
            </div>
            <div className="flex items-center gap-2 hover:text-white/90 transition-colors duration-200">
              <Mail size={14} />
              <a href="mailto:sonda@podomus.tn" className="hover:underline">sonda@podomus.tn</a>
            </div>
          </div>
          <div className="hidden md:block text-xs opacity-90">
            Bm02, 1er étage, Golf Center 2, La Soukra, Ariana
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <button onClick={() => handleNavClick('/')} className="flex items-center space-x-3">
              <div className="relative">
                {/* Wireframe Foot Icon */}
                <div className="w-10 h-10 relative">
                  <svg
                    viewBox="0 0 40 40"
                    className="w-full h-full text-[#40826D] wireframe-foot"
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
              </div>
              <div className="font-serif text-2xl font-bold text-brand-primary">
                POD<span className="text-brand-teal">O</span>MUS
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-brand-teal border-b-2 border-brand-teal'
                      : 'text-brand-primary hover:text-brand-teal'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button onClick={() => handleNavClick('/contact')} className="btn-primary">
                Prendre Rendez-vous
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className={`text-lg font-medium transition-colors duration-200 text-left ${
                        isActive(item.href)
                          ? 'text-brand-teal'
                          : 'text-brand-primary hover:text-brand-teal'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                  <Button
                    onClick={() => handleNavClick('/contact')}
                    className="btn-primary w-full mt-4"
                  >
                    Prendre Rendez-vous
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
