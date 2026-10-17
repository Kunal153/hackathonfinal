import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Eye,
  Plus,
  X,
  FileCheck,
  Award,
  Layers,
  ArrowRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Note, NoteCategory, SectionType } from '../types';
import { BRANCHES_DATA, NOTE_CATEGORIES } from '../data/branchesData';
import { INITIAL_NOTES } from '../data/seedNotes';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { saveOriginalFile } from '../utils/fileStorage';
import { NoteCard } from './NoteCard';

interface UploadNotesSectionProps {
  onNavigate: (section: SectionType) => void;
  onPreviewNote: (note: Note) => void;
  onOpenAuthModal: () => void;
}

export const UploadNotesSection: React.FC<UploadNotesSectionProps> = ({
  onNavigate,
  onPreviewNote,
  onOpenAuthModal
}) => {
  const { user, isAuthenticated } = useAuth();
  const { notes, addNote, deleteNote, deleteAllUploadedNotes } = useNotes();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState(user?.branch || 'CSE');
  const [semester, setSemester] = useState<number>(user?.semester || 3);
  const [category, setCategory] = useState<NoteCategory>('Handwritten Notes');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['ExamReady', 'UnitWise']);
  const [keyConcept, setKeyConcept] = useState('');

  // Deletion modal states
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteToast, setDeleteToast] = useState<string | null>(null);

  // Compute all user uploaded notes
  const myUploadedNotes = notes.filter(
    (n) =>
      n.isUserUploaded === true ||
      !INITIAL_NOTES.some((inNote) => inNote.id === n.id) ||
      (user && (n.author.id === user.id || user.uploadedNoteIds.includes(n.id)))
  );
  const [formulaOrCode, setFormulaOrCode] = useState('');

  // Uploaded file
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(24);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submittedNote, setSubmittedNote] = useState<Note | null>(null);

  const processFile = (file: File) => {
    setSelectedFileObj(file);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSampleFile = () => {
    setFileName(`${subject || 'Engineering'}_Notes_Complete_Semester.pdf`);
    setFileSize('8.4 MB');
    setPageCount(32);
    if (!title) {
      setTitle(`Complete ${subject || 'Course'} Notes & Exam Solved Papers`);
    }
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) {
      setValidationError('Please fill in both the Note Title and Subject Name before publishing.');
      return;
    }
    setValidationError(null);

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Build note object
          const created = addNote({
            title: title.trim(),
            subject: subject.trim(),
            branch,
            semester,
            category,
            description: description.trim() || 'Comprehensive exam preparation materials and university course notes.',
            fileName: fileName || `${subject.replace(/\s+/g, '_')}_Notes.pdf`,
            fileSize: fileSize || '9.6 MB',
            fileDataUrl: fileDataUrl || undefined,
            pages: pageCount || 24,
            tags,
            isVerified: true,
            hasOriginalFile: !!selectedFileObj,
            previewPages: [
              {
                pageNumber: 1,
                title: `${subject} - Unit 1 Fundamentals`,
                content: description || 'Complete unit notes with definitions, diagrams, and step-by-step problem derivations.',
                keyPoints: [
                  keyConcept || 'Core theorems and definitions',
                  'Standard university exam questions with step marks',
                  'Common mistakes to avoid during semester exams'
                ],
                formula: formulaOrCode ? formulaOrCode : undefined
              },
              {
                pageNumber: 2,
                title: `${subject} - Key Formulas & Derivations`,
                content: 'Formulas, step-by-step proofs, and solved numerical problems for quick revision.',
                keyPoints: ['Comprehensive chapter summary', 'Quick revision cheat sheet']
              }
            ]
          });

          if (selectedFileObj) {
            saveOriginalFile(created.id, selectedFileObj);
          }

          setSubmittedNote(created);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Mock note for live preview
  const mockPreviewNote: Note = {
    id: 'live-preview-id',
    title: title || 'Untitled Course Note',
    subject: subject || 'Subject Name',
    branch: branch,
    semester: semester,
    category: category,
    description: description || 'Detailed lecture notes with formulas, solved problems, and key takeaways for university exams.',
    author: {
      id: user?.id || 'demo-auth',
      name: user?.name || 'You (Contributor)',
      college: user?.college || 'National Engineering College',
      avatarUrl: user?.avatar,
      verified: true
    },
    fileName: fileName || 'Course_Notes.pdf',
    fileSize: fileSize || '8.4 MB',
    pages: pageCount || 24,
    format: 'pdf',
    downloads: 0,
    upvotes: 0,
    isVerified: true,
    isFeatured: false,
    tags: tags.length > 0 ? tags : ['Notes'],
    createdAt: 'Today',
    previewPages: []
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-slate-800">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006353] mb-1">
          <Upload className="w-4 h-4" />
          <span>Contributor Portal</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Upload Engineering Notes
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Share your handwritten notes, lecture slides, or solved question papers with peers and earn contributor karma.
        </p>
      </div>

      {/* Guest / Auth notice banner if not signed in */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#006353] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Sign in to earn 50 Contributor Reputation Points for each upload!
              </p>
              <p className="text-xs text-slate-600">
                You can still upload as a guest, or log in to track your downloads and badges.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-semibold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Document File (PDF, DOCX, PPT)
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-[#006353] bg-[#006353]/5'
                    : fileName
                    ? 'border-emerald-500/60 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-[#006353]/50 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  id="note-file-upload"
                  accept=".pdf,.docx,.doc,.ppt,.pptx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {fileName ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{fileName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {fileSize} • {pageCount} pages detected
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <label
                        htmlFor="note-file-upload"
                        className="text-xs text-[#006353] hover:underline cursor-pointer font-bold"
                      >
                        Replace file
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFileName('');
                          setFileSize('');
                        }}
                        className="text-xs text-rose-600 hover:underline cursor-pointer font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#006353]/10 text-[#006353] flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag and drop your file here, or{' '}
                      <label
                        htmlFor="note-file-upload"
                        className="text-[#006353] hover:underline cursor-pointer font-bold"
                      >
                        browse files
                      </label>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, DOCX, PPT up to 50MB
                    </p>
                    <button
                      type="button"
                      onClick={handleSelectSampleFile}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#ffa600]" />
                      <span>Use Sample PDF Attachment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Note Details */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Note Information
              </label>

              {/* Title */}
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Note Title *
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete Trees & Graphs Handwritten Notes (Unit 2 & 3)"
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                />
              </div>

              {/* Subject */}
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Subject / Course Name *
                </span>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Data Structures & Algorithms, Thermodynamics, Signals..."
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                />
              </div>

              {/* Branch, Semester, Category Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-xs font-medium text-slate-600 block mb-1">
                    Branch *
                  </span>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {BRANCHES_DATA.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-600 block mb-1">
                    Semester *
                  </span>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-600 block mb-1">
                    Category *
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoteCategory)}
                    className="w-full bg-slate-50 text-xs text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {NOTE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Description & Exam Highlights
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention key topics, university questions solved, or chapters covered..."
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                />
              </div>

              {/* Key Concept & Formula for the Preview Viewer */}
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Featured Formula or Core Theorem (Shows in Interactive Preview)
                </span>
                <input
                  type="text"
                  value={formulaOrCode}
                  onChange={(e) => setFormulaOrCode(e.target.value)}
                  placeholder="e.g. Master Theorem: T(n) = a*T(n/b) + f(n) or Euler Formula"
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Topic Tags
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter (e.g. #Algorithms)"
                    className="flex-1 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 px-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-[#006353] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-[#006353]/10 text-[#006353] font-semibold px-2.5 py-1 rounded-lg border border-[#006353]/20"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#006353] font-bold">
                  <span>Uploading & generating preview pages...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#006353] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-sm shadow-md shadow-[#006353]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Publishing...' : 'Publish Note to EngiNotes (+50 pts)'}</span>
            </button>
          </form>
        </div>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Card Preview
            </span>
            <span className="text-xs text-slate-400">Updates as you type</span>
          </div>

          <NoteCard
            note={mockPreviewNote}
            onPreview={onPreviewNote}
            variant="grid"
          />

          {/* Publishing Checklist Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#006353]" />
              <span>Contributor Verification Guidelines</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006353] mt-1.5 shrink-0" />
                <span>Legible handwriting or clear high-resolution scanned pages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006353] mt-1.5 shrink-0" />
                <span>Specify the correct semester and engineering branch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006353] mt-1.5 shrink-0" />
                <span>Include formula derivations and worked numerical problems for max rating.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Feedback Toast */}
      {deleteToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{deleteToast}</span>
          </div>
          <button
            onClick={() => setDeleteToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded Files Management Section */}
      {myUploadedNotes.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#006353]" />
                <span>Your Uploaded Files & Notes ({myUploadedNotes.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage or delete all study materials uploaded from this device.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Files ({myUploadedNotes.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myUploadedNotes.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#006353]/10 text-[#006353]">
                      {n.branch} • Sem {n.semester}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {n.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {n.subject} • {n.fileSize || 'PDF'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => onPreviewNote(n)}
                    className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#006353]" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => setNoteToDelete(n)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-medium transition-colors cursor-pointer"
                    title="Delete this note"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submittedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Note Published Successfully!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your note <strong>"{submittedNote.title}"</strong> is now live in the library. You earned{' '}
              <strong className="text-[#006353]">+50 reputation points</strong>.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => {
                    onPreviewNote(submittedNote);
                    setSubmittedNote(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Interactive Preview</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedNote(null);
                    onNavigate('browse');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Browse All Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  deleteNote(submittedNote.id);
                  setSubmittedNote(null);
                  setDeleteToast(`"${submittedNote.title}" deleted.`);
                  setTimeout(() => setDeleteToast(null), 3500);
                }}
                className="w-full py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Uploaded by mistake? Delete note</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                  File: <em>{noteToDelete.fileName}</em>
                </span>
              )}
              This note will be permanently removed from your library.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const title = noteToDelete.title;
                  deleteNote(noteToDelete.id);
                  setNoteToDelete(null);
                  setDeleteToast(`"${title}" deleted successfully.`);
                  setTimeout(() => setDeleteToast(null), 3500);
                }}
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
              All attached documents, PDFs, and notes will be permanently erased. This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Keep Files
              </button>
              <button
                onClick={() => {
                  const count = myUploadedNotes.length;
                  deleteAllUploadedNotes();
                  setShowDeleteAllModal(false);
                  setDeleteToast(`All ${count} uploaded files were deleted.`);
                  setTimeout(() => setDeleteToast(null), 3500);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
