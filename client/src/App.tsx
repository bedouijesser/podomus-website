
import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import type { Service } from '../../server/src/schema';

// Pages
import HomePage from '@/components/HomePage';
import ServicesPage from '@/components/ServicesPage';
import ServiceDetailPage from '@/components/ServiceDetailPage';
import AboutPage from '@/components/AboutPage';
import PatientInfoPage from '@/components/PatientInfoPage';
import ContactPage from '@/components/ContactPage';

// Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const activeServices = await trpc.getActiveServices.query();
        setServices(activeServices);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
  };

  const getCurrentPage = () => {
    if (currentPath === '/') return <HomePage services={services} navigate={navigate} />;
    if (currentPath === '/services') return <ServicesPage services={services} navigate={navigate} />;
    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.split('/services/')[1];
      return <ServiceDetailPage services={services} slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/about') return <AboutPage navigate={navigate} />;
    if (currentPath === '/patient-information') return <PatientInfoPage navigate={navigate} />;
    if (currentPath === '/contact') return <ContactPage navigate={navigate} />;
    
    // 404 fallback
    return <HomePage services={services} navigate={navigate} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#404040] font-serif text-2xl animate-pulse">PODOMUS</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8E4D9] to-[#F5F5F5] text-[#404040]">
      <Header navigate={navigate} currentPath={currentPath} />
      <PageTransition currentPath={currentPath}>
        {getCurrentPage()}
      </PageTransition>
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
