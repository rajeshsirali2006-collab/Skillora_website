import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Credentials } from './components/Credentials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { Toast } from './components/Toast';
import { ToastMessage } from './types';

export const App: React.FC = () => {
  const [isSkeleton, setIsSkeleton] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, icon = '✨') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Quick initial shimmer reveal for native app feel (400ms)
  useEffect(() => {
    setIsSkeleton(true);
    document.body.classList.add('skeleton-active');
    const timer = setTimeout(() => {
      setIsSkeleton(false);
      document.body.classList.remove('skeleton-active');
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleSkeleton = () => {
    setIsSkeleton((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('skeleton-active');
        showToast('✨ Skeleton loading preview enabled');
      } else {
        document.body.classList.remove('skeleton-active');
        showToast('🌿 Switched to live view');
      }
      return next;
    });
  };

  return (
    <>
      {/* Analog tactile grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient Clay Floating Shapes in Background */}
      <div className="clay-ambient-blob blob-1" aria-hidden="true" />
      <div className="clay-ambient-blob blob-2" aria-hidden="true" />
      <div className="clay-ambient-blob blob-3" aria-hidden="true" />

      {/* Site Header */}
      <Header isSkeleton={isSkeleton} onToggleSkeleton={handleToggleSkeleton} />

      <main>
        <Hero />
        <Services />
        <Projects onShowToast={showToast} />
        <About />
        <Credentials />
        <Contact onShowToast={showToast} />
      </main>

      <Footer />

      {/* Claymorphic RAG Chatbot */}
      <Chatbot onShowToast={showToast} />

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </>
  );
};

export default App;
