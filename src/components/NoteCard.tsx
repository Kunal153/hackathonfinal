import React, { useState } from 'react';
import {
  FileText,
  Download,
  ThumbsUp,
  Bookmark,
  CheckCircle,
  Eye,
  Calendar,
  Layers,
  Trash2,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { INITIAL_NOTES } from '../data/seedNotes';
import { downloadNotePDF } from '../utils/pdfGenerator';

interface NoteCardProps {
  note: Note;
  onPreview: (note: Note) => void;
  variant?: 'grid' | 'compact' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPreview,
  variant = 'grid'
}) => {
  const { user, isBookmarkSaved, toggleUserBookmark } = useAuth();
  const { toggleUpvote, recordDownload, deleteNote } = useNotes();
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const canDelete =
    note.isUserUploaded === true ||
    !INITIAL_NOTES.some((inNote) => inNote.id === note.id) ||
    (user && (user.uploadedNoteIds.includes(note.id) || note.author.id === user.id));

  const isSaved = isBookmarkSaved(note.id);
  const isUpvoted = user?.upvotedNoteIds.includes(note.id) || false;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadState('downloading');
    recordDownload(note.id);
    const res = await downloadNotePDF(note);
    if (res.success) {
      setDownloadState('done');
      setTimeout(() => setDownloadState('idle'), 3500);
    } else {
      setDownloadState('idle');
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(note.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUserBookmark(note.id);
  };

  const getBranchBadgeStyle = (branch: string) => {
    switch (branch.toUpperCase()) {
      case 'CSE':
      case 'COMP':
        return 'bg-[#006353]/10 text-[#006353] border-[#006353]/25';
      case 'IT':
        return 'bg-[#006353]/10 text-[#006353] border-[#006353]/25';
      case 'AI & DS':
      case 'AIDS':
        return 'bg-[#ffa600]/15 text-[#b87700] border-[#ffa600]/30';
      case 'E&TC':
      case 'ECE':
        return 'bg-[#ffa600]/15 text-[#c78200] border-[#ffa600]/30';
      case 'MECH':
        return 'bg-[#006353]/10 text-[#006353] border-[#006353]/25';
      case 'CIVIL':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ELECT':
      case 'EEE':
        return 'bg-[#ffa600]/15 text-[#c78200] border-[#ffa600]/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (variant === 'list') {
    return (
      <div
        onClick={() => onPreview(note)}
        className="group bg-white hover:bg-slate-50/60 border border-slate-200 hover:border-[#006353]/50 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#006353]/10 border border-[#006353]/20 flex items-center justify-center shrink-0 text-[#006353] group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBranchBadgeStyle(note.branch)}`}>
                {note.branch}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Sem {note.semester}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {note.category}
              </span>
              {note.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded-full border border-[#006353]/20">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006353] transition-colors line-clamp-1">
              {note.title}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-1">{note.subject}</p>
            <p className="text-xs text-slate-500 line-clamp-1">{note.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t border-slate-100 md:border-t-0">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006353] bg-[#006353]/10 px-2.5 py-0.5 rounded-full border border-[#006353]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Syllabus</span>
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              {note.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {note.pages}p
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              title={isSaved ? 'Remove Bookmark' : 'Save Note'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#ffa600]/15 border-[#ffa600]/40 text-[#c78200]'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#ffa600]' : ''}`} />
            </button>

            {canDelete && (
              <div className="flex items-center gap-1">
                {confirmDelete ? (
                  <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                    <span className="text-[10px] text-rose-700 font-bold">Delete?</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(false);
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(true);
                    }}
                    title="Delete uploaded note"
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              title="Download PDF"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer ${
                downloadState === 'done'
                  ? 'bg-emerald-600'
                  : downloadState === 'downloading'
                  ? 'bg-[#006353] opacity-80 cursor-wait'
                  : 'bg-[#006353] hover:bg-[#004f42]'
              }`}
            >
              {downloadState === 'downloading' ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : downloadState === 'done' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onPreview(note)}
      className="group relative flex flex-col bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#006353]/50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg shadow-sm cursor-pointer"
    >
      {/* Top Banner with Subject & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getBranchBadgeStyle(note.branch)}`}>
              {note.branch}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Sem {note.semester}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            title={isSaved ? 'Remove from saved' : 'Save note'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#ffa600]/15 border-[#ffa600]/40 text-[#c78200]'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#ffa600]' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded-md">
            {note.category}
          </span>
          {note.isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006353]">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006353] transition-colors line-clamp-2 mt-1 leading-snug">
          {note.title}
        </h3>
        <p className="text-xs text-slate-600 font-semibold mt-0.5">{note.subject}</p>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {note.description}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Author and metadata */}
      <div className="mt-auto px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center font-bold text-xs shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {note.author.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {note.author.college}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded-full border border-[#006353]/20 shrink-0">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified</span>
        </span>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title={`${note.downloads} downloads`}>
            <Download className="w-3 h-3 text-slate-400" />
            <span>{note.downloads}</span>
          </span>
          <span className="flex items-center gap-1" title={`${note.pages} pages (${note.fileSize})`}>
            <Layers className="w-3 h-3 text-slate-400" />
            <span>{note.pages}p</span>
          </span>
          <button
            onClick={handleUpvote}
            title={isUpvoted ? 'Upvoted' : 'Upvote this note'}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isUpvoted ? 'text-[#006353] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${isUpvoted ? 'fill-[#006353]' : ''}`} />
            <span>{note.upvotes}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(note);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          {canDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                <span className="text-[10px] text-rose-700 font-bold">Del?</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                title="Delete uploaded note"
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}

          <button
            onClick={handleDownload}
            disabled={downloadState === 'downloading'}
            title="Download PDF directly to your device"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer ${
              downloadState === 'done'
                ? 'bg-emerald-600'
                : downloadState === 'downloading'
                ? 'bg-[#006353] opacity-80 cursor-wait'
                : 'bg-[#006353] hover:bg-[#004f42]'
            }`}
          >
            {downloadState === 'downloading' ? (
              <>
                <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : downloadState === 'done' ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
