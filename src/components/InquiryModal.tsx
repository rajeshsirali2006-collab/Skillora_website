import React, { useState, useEffect } from 'react';
import { ClientInquiry, ChatLogEntry, DbStatus } from '../types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'sql' | 'chats' | 'config'>('inquiries');
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogEntry[]>([]);
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterScope, setFilterScope] = useState<string>('all');
  const [anonKeyInput, setAnonKeyInput] = useState<string>('');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [inqRes, statusRes, chatRes] = await Promise.all([
        fetch('/api/inquiries'),
        fetch('/api/status/db'),
        fetch('/api/chat/logs')
      ]);

      if (inqRes.ok) {
        const data = await inqRes.json();
        setInquiries(data.inquiries || []);
      }
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData);
      }
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setChatLogs(chatData.logs || []);
      }
    } catch (err) {
      console.warn('Error fetching data from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonKeyInput.trim()) return;

    setIsUpdatingKey(true);
    try {
      const res = await fetch('/api/config/supabase-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: anonKeyInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Connected to Supabase with Anon Key!', '⚡');
        setAnonKeyInput('');
        fetchData();
      } else {
        onShowToast(data.message || 'Key update failed', '⚠️');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update key', '⚠️');
    } finally {
      setIsUpdatingKey(false);
    }
  };

  if (!isOpen) return null;

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterScope === 'all') return true;
    return inq.selectedScope.toLowerCase().includes(filterScope.toLowerCase());
  });

  const exportToJson = () => {
    const dataToExport = activeTab === 'chats' ? chatLogs : inquiries;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rajesh-supabase-${activeTab}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported ${activeTab} to JSON`, '💾');
  };

  const sqlSnippet = `-- 1. Create client inquiries table in Supabase
-- Includes fields for name, email, service interest, and signature path
CREATE TABLE IF NOT EXISTS inquiries (
  id text PRIMARY KEY,
  client_name text NOT NULL,
  client_email text NOT NULL,
  service_interest text,
  selected_scope text,
  project_details text,
  signature text,
  signature_path text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- 2. Create chatbot logs table (for RAG assistant history)
CREATE TABLE IF NOT EXISTS chat_logs (
  id text PRIMARY KEY,
  session_id text,
  user_message text,
  assistant_reply text,
  timestamp timestamptz DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert" ON inquiries;
DROP POLICY IF EXISTS "Allow public select" ON inquiries;
CREATE POLICY "Allow public insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON inquiries FOR SELECT USING (true);`;

  return (
    <div 
      className="inquiry-modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(42, 37, 33, 0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 10005,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div 
        className="clay-card inquiry-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 32px',
          backgroundColor: '#FCFAF6',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px -12px rgba(75, 55, 42, 0.25)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="clay-badge-olive" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                {status?.apiKeyConfigured
                  ? '🟢 Supabase Cloud Connected'
                  : status?.isConnected
                  ? '🟢 Supabase Project Active'
                  : '⚡ Supabase Ready (rwjsepktqzgmbsslpusq)'}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                Project: <strong>rwjsepktqzgmbsslpusq</strong>
              </span>
            </div>
            <h2 id="inquiry-modal-title" style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Supabase Database &amp; Records Viewer
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Client inquiries and assistant conversations synchronized with your Supabase database.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="chat-close-btn"
            style={{
              background: 'var(--sand-200)',
              color: 'var(--text-main)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Telemetry Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
          padding: '14px 18px',
          background: 'var(--sand-100)',
          borderRadius: '16px',
          border: '1px solid var(--sand-200)'
        }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Database Host
            </span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--terracotta)', wordBreak: 'break-all' }}>
              rwjsepktqzgmbsslpusq.supabase.co
            </strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Inquiries Table
            </span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
              {status?.totalInquiries ?? inquiries.length} records
            </strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Chat Logs Table
            </span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
              {status?.totalChatLogs ?? chatLogs.length} sessions
            </strong>
          </div>
        </div>

        {/* Notice Banner */}
        {status?.connectionError && (
          <div style={{
            background: 'var(--sand-100)',
            border: '1px solid var(--sand-300)',
            borderRadius: '14px',
            padding: '10px 16px',
            marginBottom: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span style={{ flex: 1 }}>
              <strong>Supabase Status:</strong> {status.connectionError}
            </span>
            <button
              onClick={() => setActiveTab('config')}
              className="clay-pill-btn secondary-terracotta"
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
            >
              Configure Key
            </button>
          </div>
        )}

        {/* Collection Switcher Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          borderBottom: '1px solid var(--sand-300)',
          paddingBottom: '12px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`clay-pill-btn ${activeTab === 'inquiries' ? 'primary-terracotta' : 'secondary-pill'}`}
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              <span>📋 Inquiries ({inquiries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`clay-pill-btn ${activeTab === 'sql' ? 'primary-terracotta' : 'secondary-pill'}`}
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              <span>⚡ SQL Query &amp; Schema</span>
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`clay-pill-btn ${activeTab === 'chats' ? 'primary-terracotta' : 'secondary-pill'}`}
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              <span>💬 Chat Logs ({chatLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`clay-pill-btn ${activeTab === 'config' ? 'primary-terracotta' : 'secondary-pill'}`}
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              <span>⚙️ Supabase Settings</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={fetchData}
              className="clay-pill-btn secondary-pill"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              title="Refresh records from Supabase"
            >
              🔄 Refresh
            </button>
            <button
              onClick={exportToJson}
              className="clay-pill-btn secondary-pill"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              title="Export records as JSON"
            >
              💾 Export JSON
            </button>
          </div>
        </div>

        {/* Tab 1: Inquiries List */}
        {activeTab === 'inquiries' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
            {/* Filter Pill Row */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, marginRight: '4px' }}>
                Filter Scope:
              </span>
              {['all', 'Excel', 'Python', 'Consulting'].map((scope) => (
                <button
                  key={scope}
                  onClick={() => setFilterScope(scope)}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    borderRadius: '20px',
                    border: '1px solid var(--sand-300)',
                    background: filterScope === scope ? 'var(--terracotta)' : 'var(--sand-100)',
                    color: filterScope === scope ? '#FFFFFF' : 'var(--text-main)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {scope === 'all' ? 'All Scopes' : scope}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.9rem' }}>Loading records from Supabase...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--text-main)' }}>No inquiries found in this category.</p>
                <p style={{ margin: 0, fontSize: '0.84rem' }}>
                  Submit the project inquiry form on the page to record client briefs in Supabase.
                </p>
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid var(--sand-200)',
                    boxShadow: 'var(--clay-pill-sand-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                          {inq.clientName}
                        </strong>
                        <span className="clay-tag-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          {inq.selectedScope}
                        </span>
                        {inq.storedIn === 'supabase' && (
                          <span className="clay-badge-olive" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                            ⚡ Cloud Table
                          </span>
                        )}
                      </div>
                      <a 
                        href={`mailto:${inq.clientEmail}`} 
                        style={{ fontSize: '0.82rem', color: 'var(--terracotta)', textDecoration: 'none' }}
                      >
                        {inq.clientEmail}
                      </a>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>
                        {new Date(inq.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="clay-badge-olive" style={{ fontSize: '0.7rem', padding: '2px 8px', marginTop: '4px' }}>
                        {inq.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.5,
                    background: 'var(--sand-100)',
                    padding: '10px 14px',
                    borderRadius: '10px'
                  }}>
                    {inq.projectDetails}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>
                      Signed as: <strong className="handwritten-script" style={{ fontSize: '1.05rem', color: 'var(--terracotta)' }}>{inq.signature}</strong>
                    </span>
                    <code style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>ID: {inq.id}</code>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: SQL Query & Table Schema */}
        {activeTab === 'sql' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid var(--sand-200)', boxShadow: 'var(--clay-pill-sand-shadow)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚡ PostgreSQL Table Structure</span>
                    <span className="clay-badge-olive" style={{ fontSize: '0.72rem' }}>Supabase Ready</span>
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Stores client contact inquiries with fields for <strong>name</strong>, <strong>email</strong>, <strong>service interest</strong>, and <strong>signature path</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sqlSnippet);
                      onShowToast('Copied SQL query to clipboard! 📋', '⚡');
                    }}
                    className="clay-pill-btn primary-terracotta"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    📋 Copy SQL Query
                  </button>
                  <a
                    href="https://supabase.com/dashboard/project/rwjsepktqzgmbsslpusq/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-pill-btn secondary-terracotta"
                    style={{ padding: '6px 14px', fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    ↗ Open Supabase SQL Editor
                  </a>
                </div>
              </div>

              {/* Schema Fields Breakdown Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '10px',
                marginBottom: '16px',
                background: 'var(--sand-100)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--sand-200)'
              }}>
                <div style={{ fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--terracotta)', display: 'block' }}>client_name (text)</strong>
                  <span style={{ color: 'var(--text-muted)' }}>Client name or business</span>
                </div>
                <div style={{ fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--terracotta)', display: 'block' }}>client_email (text)</strong>
                  <span style={{ color: 'var(--text-muted)' }}>Contact email address</span>
                </div>
                <div style={{ fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--terracotta)', display: 'block' }}>service_interest (text)</strong>
                  <span style={{ color: 'var(--text-muted)' }}>Selected service track</span>
                </div>
                <div style={{ fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--terracotta)', display: 'block' }}>signature_path (text)</strong>
                  <span style={{ color: 'var(--text-muted)' }}>Vector / SVG path</span>
                </div>
              </div>

              {/* SQL Code Block */}
              <div style={{ position: 'relative' }}>
                <pre style={{
                  margin: 0,
                  background: '#1A1816',
                  color: '#F4ECE1',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  border: '1px solid #332D27'
                }}>
{sqlSnippet}
                </pre>
              </div>

              {/* How to run instructions */}
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--sand-100)', borderRadius: '12px', border: '1px solid var(--sand-200)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  How to create this table in Supabase (1 minute):
                </h4>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Click <strong>Copy SQL Query</strong> above or copy the code block.</li>
                  <li>In your Supabase project dashboard, navigate to the <strong>SQL Editor</strong> tab.</li>
                  <li>Click <strong>New Query</strong>, paste the copied SQL snippet, and press <strong>Run</strong>.</li>
                  <li>The <code style={{ color: 'var(--terracotta)' }}>inquiries</code> table with Row Level Security is immediately active and receives submissions!</li>
                </ol>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Chat Logs */}
        {activeTab === 'chats' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
            {chatLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--text-main)' }}>No chat sessions logged yet.</p>
                <p style={{ margin: 0, fontSize: '0.84rem' }}>
                  Ask questions in the AI Assistant in the bottom-right corner to record chat logs.
                </p>
              </div>
            ) : (
              chatLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    border: '1px solid var(--sand-200)',
                    boxShadow: 'var(--clay-pill-sand-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--terracotta)' }}>
                      👤 Client Question
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {log.userMessage}
                  </p>
                  <div style={{
                    marginTop: '4px',
                    padding: '8px 12px',
                    background: 'var(--sand-100)',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}>
                    <strong style={{ color: 'var(--olive)', display: 'block', marginBottom: '2px', fontSize: '0.75rem' }}>
                      🌿 Assistant Response:
                    </strong>
                    {log.assistantReply}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Supabase Connection & Configuration */}
        {activeTab === 'config' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid var(--sand-200)', boxShadow: 'var(--clay-pill-sand-shadow)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  Connected Supabase Project
                </h3>
                <a
                  href="https://supabase.com/dashboard/project/rwjsepktqzgmbsslpusq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-pill-btn secondary-terracotta"
                  style={{ padding: '4px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  ↗ Open Supabase Dashboard
                </a>
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Client form submissions are automatically channeled into your Supabase database project <strong>rwjsepktqzgmbsslpusq</strong>.
              </p>

              {/* Cluster Card */}
              <div style={{ background: 'var(--sand-100)', padding: '14px 18px', borderRadius: '14px', marginBottom: '16px', border: '1px solid var(--sand-200)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', display: 'block' }}>PROJECT ID</span>
                    <code style={{ fontSize: '0.9rem', color: 'var(--terracotta)', fontWeight: 600 }}>
                      rwjsepktqzgmbsslpusq
                    </code>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', display: 'block' }}>REST ENDPOINT</span>
                    <code style={{ fontSize: '0.82rem', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                      https://rwjsepktqzgmbsslpusq.supabase.co/rest/v1/
                    </code>
                  </div>
                </div>
              </div>

              {/* Set / Update Anon Key Form */}
              <form onSubmit={handleSaveKey} style={{ background: 'var(--sand-100)', padding: '16px', borderRadius: '14px', marginBottom: '16px', border: '1px solid var(--sand-200)' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Supabase Anon / Service Key (JWT):
                </label>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Found under <strong>Project Settings → API → Project API Keys (anon public)</strong> in your Supabase dashboard.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKeyInput}
                    onChange={(e) => setAnonKeyInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--sand-300)',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingKey || !anonKeyInput.trim()}
                    className="clay-pill-btn primary-terracotta"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    {isUpdatingKey ? 'Saving...' : '⚡ Save & Connect'}
                  </button>
                </div>
                {status?.apiKeyConfigured && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--olive)', fontWeight: 600 }}>
                    ✓ Current key configured: {status.apiKeyMasked}
                  </p>
                )}
              </form>

              {/* SQL Schema Copy Card */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Supabase PostgreSQL Table Schema (SQL Editor)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sqlSnippet);
                      onShowToast('Copied Supabase SQL schema', '📋');
                    }}
                    className="clay-pill-btn secondary-terracotta"
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    📋 Copy SQL
                  </button>
                </div>
                <pre style={{
                  background: 'var(--sand-100)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  border: '1px solid var(--sand-200)',
                  color: 'var(--text-main)',
                  lineHeight: 1.45
                }}>
{sqlSnippet}
                </pre>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
