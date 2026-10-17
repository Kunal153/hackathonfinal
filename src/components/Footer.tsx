import React from 'react';
import { GraduationCap } from 'lucide-react';
import { SectionType } from '../types';

interface FooterProps {
  onNavigate: (section: SectionType) => void;
  onSelectSubject: (subject: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-slate-800">
          <div className="w-8 h-8 rounded-xl bg-[#006353] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900">EngiNotes</span>
          <span className="text-slate-400 text-xs">— Engineering Study Portal</span>
        </div>

        <div className="flex items-center gap-6 text-slate-600">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#006353] font-medium transition-colors cursor-pointer"
          >
            Branches
          </button>
          <button
            onClick={() => {
              onNavigate('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#006353] font-medium transition-colors cursor-pointer"
          >
            Browse Notes
          </button>
          <button
            onClick={() => {
              onNavigate('upload');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#006353] font-medium transition-colors cursor-pointer"
          >
            Upload
          </button>
        </div>
      </div>
    </footer>
  );
};
