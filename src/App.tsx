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
import { InquiryModal } from './components/InquiryModal';
import { ToastMessage, DbStatus } from './types';

export const App: React.FC = () => {
  const [isSkeleton, setIsSkeleton] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  const showToast = useCallback((message: string, icon = '✨') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Fetch real-time database connectivity status and inquiry count
  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status/db');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch DB status:', err);
    }
  }, []);

  useEffect(() => {
    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 10000);

    const handleDbUpdate = () => fetchDbStatus();
    window.addEventListener('database-updated', handleDbUpdate);
    window.addEventListener('focus', handleDbUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('database-updated', handleDbUpdate);
      window.removeEventListener('focus', handleDbUpdate);
    };
  }, [fetchDbStatus]);

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

  // Hash / URL & Keyboard shortcut listener
  useEffect(() => {
    const handleUrlTrigger = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes('database') ||
        hash.includes('supabase') ||
        search.includes('supabase') ||
        search.includes('db')
      ) {
        setIsInquiryModalOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K or Alt+D opens Supabase inquiry reviewer
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'd')) {
        e.preventDefault();
        setIsInquiryModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleUrlTrigger);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleUrlTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      <Header 
        isSkeleton={isSkeleton} 
        onToggleSkeleton={handleToggleSkeleton}
        onOpenInquiries={() => setIsInquiryModalOpen(true)}
        dbStatus={dbStatus}
      />

      <main>
        <Hero isSkeleton={isSkeleton} />
        <Services />
        <Projects onShowToast={showToast} />
        <About />
        <Credentials />
        <Contact 
          onShowToast={showToast} 
          onOpenInquiries={() => setIsInquiryModalOpen(true)}
        />
      </main>

      <Footer onOpenInquiries={() => setIsInquiryModalOpen(true)} />

      {/* Claymorphic RAG Chatbot */}
      <Chatbot onShowToast={showToast} />

      {/* Supabase Database Records & Telemetry Viewer */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          fetchDbStatus();
        }}
        onShowToast={showToast}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </>
  );
};

export default App;
