import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Search,
  Upload,
  User as UserIcon,
  Menu,
  X,
  Compass,
  FolderGit2,
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { SectionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

interface NavbarProps {
  currentSection: SectionType;
  onNavigate: (section: SectionType) => void;
  onOpenAuthModal: () => void;
  onOpenGitHubModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  onOpenAuthModal
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useNotes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (section: SectionType) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('browse');
    }
  };

  const navLinks: { id: SectionType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-5 h-5" /> },
    { id: 'browse', label: 'Browse Notes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'branches', label: 'Branches & Syllabus', icon: <FolderGit2 className="w-5 h-5" /> },
    { id: 'upload', label: 'Upload Notes', icon: <Upload className="w-5 h-5" />, badge: '+50 pts' },
    { id: 'account', label: 'My Account', icon: <UserIcon className="w-5 h-5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo - Bigger SVG logo without dancing animation */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#006353] flex items-center justify-center text-white shadow-md shadow-[#006353]/25 transition-transform">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
                Engi<span className="text-[#006353]">Notes</span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/30 shadow-2xs">
                Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold -mt-0.5 hidden sm:block">
              Engineering Study Portal
            </p>
          </div>
        </div>

        {/* Global Search Bar (Medium & Up) - Bigger SVG search icon */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center relative max-w-xs xl:max-w-sm w-full"
        >
          <Search className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, subjects, branch, units..."
            className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-11 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none focus:ring-2 focus:ring-[#006353]/20 transition-all"
          />
        </form>

        {/* Desktop Navigation Links with Bigger SVG icons */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-[#006353] bg-[#006353]/10 border border-[#006353]/25 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Upload CTA (Mobile & Tablet) */}
          <button
            onClick={() => handleNavClick('upload')}
            className="hidden sm:flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#006353]/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#006353] flex items-center justify-center text-white font-bold text-xs border border-[#006353]/30 shadow-xs">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#ffa600] font-black -mt-0.5">
                    {user.reputationPoints} pts
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] font-mono text-[#006353] font-semibold">+91 {user.mobileNumber}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/20">
                        {user.branch} {user.semester ? `• Sem ${user.semester}` : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4.5 h-4.5 text-[#006353]" />
                    <span>My Account & Downloads</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('upload');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Upload className="w-4.5 h-4.5 text-[#ffa600]" />
                    <span>Upload New Notes</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu hamburger button with bigger icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-5 h-5 absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, subjects, branch..."
              className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-11 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006353] focus:bg-white"
            />
          </form>

          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-[#006353] bg-[#006353]/10 border border-[#006353]/25'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
