import React, { useState } from 'react';
import {
  User as UserIcon,
  Bookmark,
  Upload,
  Download,
  Award,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Trash2,
  Eye,
  CheckCircle,
  Edit3,
  AlertTriangle,
  FileText,
  RotateCcw,
  X,
  Phone
} from 'lucide-react';
import { Note, SectionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { INITIAL_NOTES } from '../data/seedNotes';
import { NoteCard } from './NoteCard';
import { validateMobileNumber, validateName, cleanMobileNumber } from '../utils/mobileValidator';

interface MyAccountSectionProps {
  onNavigate: (section: SectionType) => void;
  onPreviewNote: (note: Note) => void;
  onOpenAuthModal: () => void;
}

export const MyAccountSection: React.FC<MyAccountSectionProps> = ({
  onNavigate,
  onPreviewNote,
  onOpenAuthModal
}) => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { notes, deleteNote, deleteAllUploadedNotes, restoreDefaultNotes } = useNotes();

  const [activeTab, setActiveTab] = useState<'saved' | 'uploads' | 'history' | 'settings'>('saved');

  // Deletion modal & feedback states
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Edit profile states
  const [editName, setEditName] = useState(user?.name || '');
  const [editMobile, setEditMobile] = useState(user?.mobileNumber || '');
  const [editBranch, setEditBranch] = useState(user?.branch || 'Computer Engineering');
  const [editSemester, setEditSemester] = useState<number>(user?.semester || 1);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Filter user's saved notes
  const savedNotes = notes.filter((n) => user?.savedNoteIds.includes(n.id));

  // Filter user's uploaded notes
  const myUploadedNotes = notes.filter(
    (n) =>
      n.isUserUploaded === true ||
      !INITIAL_NOTES.some((inNote) => inNote.id === n.id) ||
      (user && (n.author.id === user.id || user.uploadedNoteIds.includes(n.id)))
  );

  // Filter user's downloaded notes
  const downloadedNotes = notes.filter((n) => user?.downloadedNoteIds.includes(n.id));

  const handleConfirmDeleteSingle = () => {
    if (!noteToDelete) return;
    const title = noteToDelete.title;
    deleteNote(noteToDelete.id);
    setNoteToDelete(null);
    setFeedbackToast(`"${title}" deleted successfully.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleConfirmDeleteAll = () => {
    const count = myUploadedNotes.length;
    deleteAllUploadedNotes();
    setShowDeleteAllModal(false);
    setFeedbackToast(`All ${count} uploaded file(s) and documents were deleted.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleConfirmReset = () => {
    restoreDefaultNotes();
    setShowResetModal(false);
    setFeedbackToast('Library reset to original standard notes.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const nameCheck = validateName(editName);
    if (!nameCheck.isValid) {
      setEditError(nameCheck.error || 'Please enter a valid name.');
      return;
    }

    const mobileCheck = validateMobileNumber(editMobile);
    if (!mobileCheck.isValid) {
      setEditError(mobileCheck.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    updateProfile({
      name: editName.trim(),
      mobileNumber: cleanMobileNumber(editMobile),
      branch: editBranch,
      semester: editSemester
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8 bg-white text-slate-800">
        <div className="w-20 h-20 rounded-3xl bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Student Profile Dashboard
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            Please log in to manage your bookmarks, track downloaded notes, and view study materials.
          </p>
        </div>

        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <button
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-sm shadow-md shadow-[#006353]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Student Login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-slate-800">
      {/* User Profile Card Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#006353]/40 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#006353] flex items-center justify-center text-white border-2 border-[#006353]/30 shadow-sm">
                  <GraduationCap className="w-8 h-8" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#006353] text-white shadow-xs">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {user.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/20 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-[#006353]" />
                  <span>+91 {user.mobileNumber}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#006353] bg-[#006353]/10 px-2.5 py-0.5 rounded-lg border border-[#006353]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[#006353] font-bold bg-[#006353]/10 px-2.5 py-1 rounded-lg border border-[#006353]/20">
                  {user.branch}
                </span>
                {user.semester && (
                  <span className="text-slate-600 text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Semester {user.semester}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Note</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-colors text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#ffa600]" />
              Reputation
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              <span className="text-[#ffa600]">{user.reputationPoints}</span> <span className="text-xs text-slate-500 font-normal">pts</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#006353]" />
              Saved Notes
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              {user.savedNoteIds.length}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#ffa600]" />
              My Uploads
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              {myUploadedNotes.length}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#006353]" />
              Downloads
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              {user.downloadedNoteIds.length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-[#006353] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Notes ({savedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'uploads'
              ? 'bg-[#006353] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>My Uploads ({myUploadedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#006353] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Downloaded ({downloadedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#006353] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Saved Notes Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPreview={onPreviewNote}
                    variant="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No saved notes yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the bookmark icon on any note card to save it for quick revision before exams.
                </p>
                <button
                  onClick={() => onNavigate('browse')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Browse Notes
                </button>
              </div>
            )}
          </div>
        )}

        {/* My Uploads Tab */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#006353]" />
                  <span>My Uploaded Notes ({myUploadedNotes.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All study materials and PDF files you have contributed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('upload')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload More</span>
                </button>

                {myUploadedNotes.length > 0 && (
                  <button
                    onClick={() => setShowDeleteAllModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                    title="Permanently delete all your uploaded files"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Files ({myUploadedNotes.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification Toast if present */}
            {feedbackToast && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedbackToast}</span>
                </div>
                <button
                  onClick={() => setFeedbackToast(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {myUploadedNotes.length > 0 ? (
              <div className="space-y-3">
                {myUploadedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#006353]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#006353]/10 text-[#006353]">
                          {note.branch} • Sem {note.semester}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {note.category}
                        </span>
                        {note.fileName && (
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                            <FileText className="w-3 h-3 text-[#006353]" />
                            <span className="truncate max-w-[180px]">{note.fileName}</span>
                            <span>({note.fileSize || 'PDF'})</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {note.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Subject: <span className="text-slate-700 font-medium">{note.subject}</span> • {note.downloads} downloads • {note.upvotes} upvotes
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onPreviewNote(note)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#006353]" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => setNoteToDelete(note)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors text-xs font-semibold cursor-pointer"
                        title="Delete this note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No uploaded files in library</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't uploaded any notes yet or all files have been deleted.
                </p>
                <button
                  onClick={() => onNavigate('upload')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Upload Your First Note
                </button>
              </div>
            )}
          </div>
        )}

        {/* Downloaded History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {downloadedNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPreview={onPreviewNote}
                    variant="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                <Download className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No download history</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Notes you download will appear here for fast re-access.
                </p>
                <button
                  onClick={() => onNavigate('browse')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Explore Notes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#006353]" />
                <span>Update Academic Profile</span>
              </h3>
              {isSavedNotice && (
                <span className="text-xs font-bold text-[#006353] bg-[#006353]/10 px-2.5 py-1 rounded-lg border border-[#006353]/20">
                  Profile updated!
                </span>
              )}
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-slate-50 text-sm text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number (10 Digits)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 font-mono text-sm text-slate-900 pl-14 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sequence numbers (e.g. 1234567890 or 9876543210) are strictly not allowed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:outline-none cursor-pointer"
                  >
                    {[
                      'Computer Engineering',
                      'Information Technology',
                      'AI & Data Science',
                      'Electronics & Telecommunication',
                      'Mechanical Engineering',
                      'Civil Engineering',
                      'Electrical Engineering',
                      'First Year (FE - Common)'
                    ].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Semester
                  </label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(Number(e.target.value))}
                    className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>

            {/* Data & Storage Management Card */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Data & Storage Management</span>
              </h4>
              <p className="text-xs text-slate-500">
                Manage your locally stored study notes, uploaded PDFs, and library cache.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Delete All Uploaded Files
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Permanently wipes all {myUploadedNotes.length} uploaded files and attachments from device storage.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteAllModal(true)}
                    disabled={myUploadedNotes.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    Delete All ({myUploadedNotes.length})
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Reset Library to Standard Notes
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Restores all standard engineering seed notes to default and resets deleted records.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Reset Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Single Note Delete Confirmation */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Delete This Note?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>"{noteToDelete.title}"</strong>?
              {noteToDelete.fileName && (
                <span className="block mt-1 text-slate-500">
                  Attached file: <em>{noteToDelete.fileName}</em>
                </span>
              )}
              This file will be permanently removed from your library.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteSingle}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete All Uploaded Files Confirmation */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Delete All Uploaded Files?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete all <strong className="text-rose-600">{myUploadedNotes.length} uploaded files</strong>?
              All attached documents, PDFs, and notes will be permanently erased from your storage. This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Keep Files
              </button>
              <button
                onClick={handleConfirmDeleteAll}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Library Confirmation */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#006353]/10 text-[#006353] border border-[#006353]/20 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Reset Notes Library?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore all standard engineering seed notes to default and reset deleted records.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="w-full py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Reset Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
