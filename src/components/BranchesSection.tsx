import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  ChevronRight,
  BookOpen,
  FileText,
  Timer,
  Search,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Award,
  Calendar,
  Eye,
  HelpCircle,
  Zap
} from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { BranchIcon } from './BranchIcon';
import { Note, SectionType } from '../types';
import { useNotes } from '../context/NotesContext';
import { getOrCreateNoteForSubject } from '../utils/subjectNotesGenerator';
import {
  SPPU_2024_BRANCHES,
  SPPU_2024_SUBJECTS,
  SppuSubject,
  getSppuSubjectsForBranchAndSemester
} from '../data/sppuSyllabusData';
import { SppuQuizModal } from './SppuQuizModal';
import { SppuPyqModal } from './SppuPyqModal';
import { getQuizAttemptsForSubject } from '../data/sppuQuizzesData';

interface BranchesSectionProps {
  onSelectBranchAndSem: (branchCode: string, sem?: number) => void;
  onSelectSubject: (subject: string) => void;
  onNavigate: (section: SectionType) => void;
  onPreviewNote?: (note: Note) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({
  onSelectBranchAndSem,
  onSelectSubject,
  onNavigate,
  onPreviewNote
}) => {
  const { notes, setSelectedBranch, setSelectedSemester: setContextSemester, setSearchQuery } = useNotes();

  const [currentStep, setCurrentStep] = useState<'branches' | 'semesters' | 'subjects'>('branches');
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [subjectSearch, setSubjectSearch] = useState<string>('');

  // Modals for PYQ and Quizzes
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [pyqModalOpen, setPyqModalOpen] = useState<boolean>(false);
  const [activeModalSubject, setActiveModalSubject] = useState<SppuSubject | null>(null);

  const currentBranch =
    BRANCHES_DATA.find((b) => b.code === selectedBranchCode) || BRANCHES_DATA[0];

  const currentSemesterSubjects = getSppuSubjectsForBranchAndSemester(
    selectedBranchCode,
    selectedSemester
  );

  const filteredSubjects = currentSemesterSubjects.filter((s) => {
    if (!subjectSearch.trim()) return true;
    const query = subjectSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  });

  const handleOpenNotes = (subjectName: string, semester: number) => {
    if (onPreviewNote) {
      const generated = getOrCreateNoteForSubject(
        subjectName,
        selectedBranchCode,
        notes,
        semester
      );
      onPreviewNote(generated);
    } else {
      setSelectedBranch(selectedBranchCode);
      setSelectedSemester(semester);
      setSearchQuery(subjectName);
      onSelectSubject(subjectName);
      onNavigate('browse');
    }
  };

  const handleOpenPyqs = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setPyqModalOpen(true);
  };

  const handleOpenQuiz = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setQuizModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-slate-800">
      {/* ================= STEP 1: SELECT BRANCH ================= */}
      {currentStep === 'branches' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006353] mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>SPPU University Engineering Streams (Pattern 2024 NEP)</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              Engineering Branches & Academic Streams
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Select your engineering branch below to view semester syllabi, original SPPU past year question papers (PYQs), and unit-wise exam quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BRANCHES_DATA.map((branch) => {
              return (
                <div
                  key={branch.code}
                  onClick={() => {
                    setSelectedBranchCode(branch.code);
                    setCurrentStep('semesters');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#006353] rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center group-hover:bg-[#006353] group-hover:text-white transition-colors">
                        <BranchIcon name={branch.iconName} className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/20">
                          {branch.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Sem 1-8
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#006353] transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {branch.shortDesc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      SPPU Pattern 2024 Aligned
                    </span>
                    <span className="text-xs font-bold text-[#006353] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Choose Semester</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STEP 2: CHOOSE YOUR SEMESTER ================= */}
      {currentStep === 'semesters' && (
        <div className="space-y-6">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep('branches')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Branches</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#006353]">
              {currentBranch.name} ({currentBranch.code})
            </span>
          </div>

          <div className="bg-gradient-to-r from-[#006353]/10 via-[#006353]/5 to-[#ffa600]/10 border border-[#006353]/20 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c78200] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>SPPU University 2024 Syllabus • NEP Pattern</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Choose Your Semester
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Below are all 8 semesters for <strong>{currentBranch.name}</strong>. Click on your semester to explore subjects, past year PYQ question papers, and unit-wise quizzes.
            </p>
          </div>

          {/* Semesters 1 to 8 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
              const academicYear =
                semNum <= 2
                  ? 'FE (First Year)'
                  : semNum <= 4
                  ? 'SE (Second Year)'
                  : semNum <= 6
                  ? 'TE (Third Year)'
                  : 'BE (Final Year)';

              const subjectsForSem = getSppuSubjectsForBranchAndSemester(
                selectedBranchCode,
                semNum
              );

              return (
                <div
                  key={semNum}
                  onClick={() => {
                    setSelectedSemester(semNum);
                    setCurrentStep('subjects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#006353] rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/20">
                        {academicYear}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffa600]/15 text-[#c78200] border border-[#ffa600]/30">
                        NEP 2024
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#006353] transition-colors">
                      Semester {semNum}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {subjectsForSem.length} Core Subjects (In-Sem 30M + End-Sem 70M)
                    </p>

                    <div className="mt-4 space-y-1 pl-2 border-l-2 border-slate-200">
                      {subjectsForSem.slice(0, 3).map((s) => (
                        <p key={s.code} className="text-[11px] text-slate-600 truncate">
                          • {s.name}
                        </p>
                      ))}
                      {subjectsForSem.length > 3 && (
                        <p className="text-[10px] text-slate-400 italic">
                          +{subjectsForSem.length - 3} more subjects
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006353] group-hover:translate-x-1 transition-transform">
                    <span>View Subjects & Quizzes</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STEP 3: SEMESTER SUBJECTS WITH 3 OPTIONS ================= */}
      {currentStep === 'subjects' && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep('semesters')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Semester</span>
              </button>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => setCurrentStep('branches')}
                className="text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {currentBranch.name}
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-[#006353]">
                Semester {selectedSemester}
              </span>
            </div>

            {/* Semester Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSemester(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSemester === s
                      ? 'bg-[#006353] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#006353]/10 text-[#006353] border border-[#006353]/20">
                  {currentBranch.code} • Semester {selectedSemester}
                </span>
                <span className="text-xs text-[#c78200] font-bold px-2 py-0.5 rounded bg-[#ffa600]/15 border border-[#ffa600]/30">
                  SPPU University Pattern 2024
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Semester {selectedSemester} Courses & Modules
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                For each subject below, you have <strong>3 options</strong>: 📘 <strong>Notes & Study Material</strong>, 📑 <strong>Past Year PYQ Papers</strong> (original questions with solved solutions), and ⏱️ <strong>Unit-wise Quizzes</strong> (20 questions / 20 mins timer with auto-submit).
              </p>
            </div>

            {/* Search Input Filter */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                placeholder="Search subject or code..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 focus:outline-none focus:border-[#006353] focus:bg-white"
              />
            </div>
          </div>

          {/* Subjects Cards Grid with the 3 Distinct Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Subjects for Semester {selectedSemester} ({filteredSubjects.length} Courses)
              </h3>
              <span className="text-xs text-slate-500">
                In-Sem: 30 Marks (Units 1-2) | End-Sem: 70 Marks (Units 3-6)
              </span>
            </div>

            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {filteredSubjects.map((subject) => {
                  const pastAttempts = getQuizAttemptsForSubject(subject.code);
                  const solvedCount = pastAttempts.length;

                  return (
                    <div
                      key={subject.code}
                      className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#006353]/40 rounded-3xl p-6 transition-all space-y-4 shadow-sm"
                    >
                      {/* Top Info Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold text-[#006353] bg-[#006353]/10 px-2.5 py-0.5 rounded-lg border border-[#006353]/20">
                              SPPU-{subject.code}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {subject.credits} Credits • {subject.courseType}
                            </span>
                            {solvedCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{solvedCount} Quiz Attempt{solvedCount > 1 ? 's' : ''}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-xl font-bold text-slate-900">
                            {subject.name}
                          </h4>

                          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                            {subject.description}
                          </p>
                        </div>

                        {/* Exam Marks Badge */}
                        <div className="flex sm:flex-col items-end gap-1.5 shrink-0 text-right">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                            In-Sem: <strong>30M</strong> | End-Sem: <strong>70M</strong>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            6 Units Total (SPPU 2024)
                          </span>
                        </div>
                      </div>

                      {/* Units Pill Summary */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Syllabus Units:
                        </span>
                        {subject.units.map((u) => (
                          <span
                            key={u.unitNumber}
                            className={`text-[11px] px-2.5 py-0.5 rounded-lg border ${
                              u.unitNumber <= 2
                                ? 'bg-[#006353]/5 text-[#006353] border-[#006353]/20'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                            title={u.subtopics.join(', ')}
                          >
                            U{u.unitNumber}: {u.title.split('-')[0].split(':')[0].substring(0, 24)}...
                          </span>
                        ))}
                      </div>

                      {/* ================= THE 3 DEDICATED OPTIONS ================= */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* OPTION 1: Notes & Study Material */}
                        <button
                          onClick={() => handleOpenNotes(subject.name, selectedSemester)}
                          className="p-3.5 rounded-2xl bg-[#006353]/5 hover:bg-[#006353]/10 border border-[#006353]/20 text-left transition-all group cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-xl bg-[#006353]/15 text-[#006353] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#006353]/10 text-[#006353]">
                              Option 1
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#006353] transition-colors">
                              📘 Notes & Study Material
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Handwritten notes, formulas, unit summaries & PDF download
                            </p>
                          </div>
                        </button>

                        {/* OPTION 2: Past Year PYQ Papers */}
                        <button
                          onClick={() => handleOpenPyqs(subject)}
                          className="p-3.5 rounded-2xl bg-[#ffa600]/10 hover:bg-[#ffa600]/15 border border-[#ffa600]/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-xl bg-[#ffa600]/20 text-[#b87700] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffa600]/20 text-[#b87700]">
                              Option 2
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#b87700] transition-colors">
                              📑 Past Year PYQ Papers
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Original SPPU In-Sem & End-Sem papers with model solutions
                            </p>
                          </div>
                        </button>

                        {/* OPTION 3: Unit-wise Quizzes */}
                        <button
                          onClick={() => handleOpenQuiz(subject)}
                          className="p-3.5 rounded-2xl bg-[#ffa600]/10 hover:bg-[#ffa600]/15 border border-[#ffa600]/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-xl bg-[#ffa600]/20 text-[#c78200] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Timer className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffa600]/20 text-[#c78200]">
                              Option 3
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#c78200] transition-colors">
                              ⏱️ Unit-wise Quizzes (20Q / 20M)
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              20 Qs per unit, 20 min timer with auto-submit & results
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs shadow-sm">
                No subjects found matching your query for Semester {selectedSemester}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive SPPU Unit Quiz Modal */}
      <SppuQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        subject={activeModalSubject}
        onOpenNotes={(unitNum) => {
          if (activeModalSubject) {
            handleOpenNotes(activeModalSubject.name, selectedSemester);
          }
        }}
      />

      {/* Interactive SPPU PYQ Papers Modal */}
      <SppuPyqModal
        isOpen={pyqModalOpen}
        onClose={() => setPyqModalOpen(false)}
        subject={activeModalSubject}
      />
    </div>
  );
};
