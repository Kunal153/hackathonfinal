import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider, useNotes } from './context/NotesContext';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { BrowseNotesSection } from './components/BrowseNotesSection';
import { BranchesSection } from './components/BranchesSection';
import { UploadNotesSection } from './components/UploadNotesSection';
import { MyAccountSection } from './components/MyAccountSection';
import { NotePreviewModal } from './components/NotePreviewModal';
import { AuthModal } from './components/AuthModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { Footer } from './components/Footer';
import { BrahmastraAiModal } from './components/BrahmastraAiModal';
import { FrontLoginPage } from './components/FrontLoginPage';
import { Note, SectionType } from './types';

function AppContent() {
  const { notes } = useNotes();
  const { user, isAuthenticated } = useAuth();
  const [currentSection, setCurrentSection] = useState<SectionType>('home');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  // STRICT ACCESS GATE: User MUST login with verified name, 10-digit mobile & branch
  // "login kelya shivay aat acseec nakoy ajibaat"
  // "aani logout kelyavr vapas login screen aali pahije"
  if (!isAuthenticated || !user) {
    return <FrontLoginPage />;
  }

  // Navigation handlers
  const handleNavigate = (section: SectionType) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subject: string) => {
    setSubjectFilter(subject);
    setCurrentSection('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBranchAndSem = (branchCode: string, sem?: number) => {
    setCurrentSection('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-[#006353] selection:text-white">
      {/* Top sticky Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenGitHubModal={() => setGithubModalOpen(true)}
      />

      {/* Main Content Area based on 5 Sections */}
      <main className="flex-1">
        {currentSection === 'home' && (
          <HomeSection
            notes={notes}
            onNavigate={handleNavigate}
            onSelectSubject={handleSelectSubject}
            onPreviewNote={(note) => setPreviewNote(note)}
          />
        )}

        {currentSection === 'browse' && (
          <BrowseNotesSection
            notes={notes}
            initialSubjectFilter={subjectFilter}
            onPreviewNote={(note) => setPreviewNote(note)}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'branches' && (
          <BranchesSection
            onSelectBranchAndSem={handleSelectBranchAndSem}
            onSelectSubject={handleSelectSubject}
            onNavigate={handleNavigate}
            onPreviewNote={(note) => setPreviewNote(note)}
          />
        )}

        {currentSection === 'upload' && (
          <UploadNotesSection
            onNavigate={handleNavigate}
            onPreviewNote={(note) => setPreviewNote(note)}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {currentSection === 'account' && (
          <MyAccountSection
            onNavigate={handleNavigate}
            onPreviewNote={(note) => setPreviewNote(note)}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectSubject={handleSelectSubject}
      />

      {/* Interactive Note Preview Reader Modal */}
      <NotePreviewModal
        note={previewNote}
        onClose={() => setPreviewNote(null)}
      />

      {/* Firebase Google Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* GitHub Repository Upload Guide Modal */}
      <GitHubExportModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
      />

      {/* Floating Draggable Brahmastra AI Bot */}
      <BrahmastraAiModal
        onSelectSubject={handleSelectSubject}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </AuthProvider>
  );
}
