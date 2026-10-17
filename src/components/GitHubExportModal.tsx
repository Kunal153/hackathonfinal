import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  FolderGit2,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'parts' | 'commands' | 'structure'>('parts');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectParts = [
    {
      part: 'Part 1: Core Configuration',
      files: [
        { path: 'package.json', desc: 'Dependencies, scripts, and build metadata' },
        { path: 'vite.config.ts', desc: 'Vite & Tailwind CSS v4 bundler setup' },
        { path: 'tsconfig.json', desc: 'TypeScript path mappings and JSX configuration' },
        { path: 'index.html', desc: 'HTML entry point with Plus Jakarta Sans & JetBrains Mono' },
        { path: 'README.md', desc: 'Complete GitHub project documentation' }
      ]
    },
    {
      part: 'Part 2: Data Models & Mock Data',
      files: [
        { path: 'src/types/index.ts', desc: 'Note, User, Branch, Syllabus, and Category types' },
        { path: 'src/data/branchesData.ts', desc: '7 Engineering Branches with 8-semester course syllabi' },
        { path: 'src/data/seedNotes.ts', desc: 'Initial high-yield notes with formulas and preview pages' }
      ]
    },
    {
      part: 'Part 3: State Management & Contexts',
      files: [
        { path: 'src/context/AuthContext.tsx', desc: 'User state, Google login, demo profiles, and bookmarks' },
        { path: 'src/context/NotesContext.tsx', desc: 'Filter state, branch/semester filters, syllabus verification, and downloads' }
      ]
    },
    {
      part: 'Part 4: UI Components & Sections',
      files: [
        { path: 'src/components/Navbar.tsx', desc: 'Sticky header with search bar, navigation tabs, and profile menu' },
        { path: 'src/components/HomeSection.tsx', desc: 'Hero section, instant jump search, and featured notes' },
        { path: 'src/components/BrowseNotesSection.tsx', desc: 'Filterable notes catalog with branch/semester selectors' },
        { path: 'src/components/BranchesSection.tsx', desc: 'Curriculum explorer with semester course units' },
        { path: 'src/components/UploadNotesSection.tsx', desc: 'Contributor publishing studio with live preview' },
        { path: 'src/components/MyAccountSection.tsx', desc: 'Student dashboard with bookmarks and upload history' },
        { path: 'src/components/NotePreviewModal.tsx', desc: 'In-browser multi-page document viewer with zoom & formulas' },
        { path: 'src/components/AuthModal.tsx', desc: 'Google Sign-In and 1-click student demo authentication' },
        { path: 'src/components/NoteCard.tsx', desc: 'Reusable note card with download and bookmark triggers' },
        { path: 'src/components/Footer.tsx', desc: 'Engineering directory footer with course links' }
      ]
    },
    {
      part: 'Part 5: Application Entry Points',
      files: [
        { path: 'src/App.tsx', desc: 'Root component orchestrating the 5 sections and modals' },
        { path: 'src/main.tsx', desc: 'React 19 root DOM hydration' },
        { path: 'src/index.css', desc: 'Tailwind CSS and custom scrollbars' }
      ]
    }
  ];

  const terminalCommands = `# Step 1: Open your terminal inside your project folder
git init

# Step 2: Add all files
git add .

# Step 3: Create initial commit
git commit -m "Add complete EngiNotes engineering platform"

# Step 4: Set primary branch to main
git branch -M main

# Step 5: Connect your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/VERIFIED-COURSE.git

# Step 6: Push all files to GitHub
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-5 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006353]/10 text-[#006353] flex items-center justify-center border border-[#006353]/20 shadow-xs">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>GitHub Repository Upload Guide</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/25">
                  Ready to Commit
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Organized into modular parts to easily upload or commit to GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-white text-[#006353] border border-[#006353]/30 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            File Parts (5 Modules)
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'commands'
                ? 'bg-white text-[#006353] border border-[#006353]/30 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Git CLI Commands</span>
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-white text-[#006353] border border-[#006353]/30 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Folder Structure
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {activeTab === 'parts' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 text-xs text-[#006353]">
                💡 <strong>Tip for GitHub Web UI:</strong> If you are creating files on github.com (via <em>Add file &gt; Create new file</em>), type the full path (e.g. <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[#006353]">src/types/index.ts</code>) into the filename box; GitHub will automatically create the subdirectories for you!
              </div>

              {projectParts.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006353]" />
                      <span>{group.part}</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {group.files.length} files
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.files.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#006353]/40 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <span className="font-mono text-xs font-semibold text-[#006353]">
                            {file.path}
                          </span>
                          <p className="text-[11px] text-slate-500 truncate">
                            {file.desc}
                          </p>
                        </div>

                        <button
                          onClick={() => copyToClipboard(file.path, file.path)}
                          className="shrink-0 p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Copy file path"
                        >
                          {copiedKey === file.path ? (
                            <Check className="w-3.5 h-3.5 text-[#006353]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Run these commands in your project terminal to push everything to your GitHub repository:
                </span>
                <button
                  onClick={() => copyToClipboard(terminalCommands, 'cmd')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {copiedKey === 'cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>Copy All Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                <pre>{terminalCommands}</pre>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <span className="text-xs text-slate-600">
                Complete verified repository tree:
              </span>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                <pre>{`verified-course/
├── .env.example
├── README.md
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── NotesContext.tsx
│   ├── data/
│   │   ├── branchesData.ts
│   │   ├── seedNotes.ts
│   │   ├── sppuPyqData.ts
│   │   ├── sppuQuizzesData.ts
│   │   └── sppuSyllabusData.ts
│   └── components/
│       ├── AuthModal.tsx
│       ├── BrahmastraAiModal.tsx
│       ├── BranchIcon.tsx
│       ├── BranchesSection.tsx
│       ├── BrowseNotesSection.tsx
│       ├── Footer.tsx
│       ├── FrontLoginPage.tsx
│       ├── GitHubExportModal.tsx
│       ├── HeroFrontPage.tsx
│       ├── HomeSection.tsx
│       ├── MyAccountSection.tsx
│       ├── Navbar.tsx
│       ├── NoteCard.tsx
│       ├── NotePreviewModal.tsx
│       ├── PdfSummarizerModal.tsx
│       ├── SppuPyqModal.tsx
│       ├── SppuQuizModal.tsx
│       └── UploadNotesSection.tsx`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
