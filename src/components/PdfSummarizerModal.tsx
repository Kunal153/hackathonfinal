import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Bookmark,
  Languages,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  GraduationCap
} from 'lucide-react';
import { SppuSubject } from '../data/sppuSyllabusData';

interface PdfSummarizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SppuSubject | null;
  branchCode?: string;
  semester?: number;
}

export const PdfSummarizerModal: React.FC<PdfSummarizerModalProps> = ({
  isOpen,
  onClose,
  subject,
  branchCode = 'General',
  semester = 2,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'sppu-units'>('upload');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hinglish' | 'Marathi'>('English');
  const [revisionMode, setRevisionMode] = useState<'last-minute' | 'comprehensive' | 'pyq-high-yield'>('comprehensive');

  // Input states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileMimeType, setFileMimeType] = useState<string>('application/pdf');
  const [pastedText, setPastedText] = useState<string>('');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);

  // Generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(1);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToLocal, setSavedToLocal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentSubjectName = subject ? subject.name : 'Engineering Course';
  const currentSubjectCode = subject ? subject.code : 'SPPU-ENG';
  const unitsList = subject?.units || [
    { unitNumber: 1, title: 'Unit 1: Fundamentals & Primary Governing Equations', subtopics: ['Basic principles', 'Standard definitions', 'Analytical relations'] },
    { unitNumber: 2, title: 'Unit 2: System Formulations & Boundary Conditions', subtopics: ['Boundary criteria', 'Model deduction', 'Equilibrium states'] },
    { unitNumber: 3, title: 'Unit 3: Procedural Analysis & Algorithmic Steps', subtopics: ['Step-by-step algorithms', 'Implementation', 'Applications'] },
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileMimeType(file.type || 'application/pdf');
    setErrorMsg(null);

    const reader = new FileReader();
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileDataUrl(text);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFileDataUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Summary Action
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setProgressStep(1);

    const stepTimer1 = setTimeout(() => setProgressStep(2), 1200);
    const stepTimer2 = setTimeout(() => setProgressStep(3), 2500);

    try {
      let contentToSend = '';
      let unitName = unitsList[selectedUnitIndex]?.title || 'All Units';

      if (activeTab === 'upload') {
        if (!uploadedFile && !fileDataUrl) {
          setErrorMsg('Please select a PDF or document file to summarize.');
          setIsLoading(false);
          clearTimeout(stepTimer1);
          clearTimeout(stepTimer2);
          return;
        }
        contentToSend = fileDataUrl || `Uploaded file: ${uploadedFile?.name}`;
      } else if (activeTab === 'paste') {
        if (!pastedText.trim()) {
          setErrorMsg('Please paste textbook or notes text in the box below.');
          setIsLoading(false);
          clearTimeout(stepTimer1);
          clearTimeout(stepTimer2);
          return;
        }
        contentToSend = pastedText.trim();
        unitName = 'Pasted Notes / Textbook Chapter';
      } else {
        // SPPU unit mode
        const chosenUnit = unitsList[selectedUnitIndex];
        unitName = `Unit ${chosenUnit.unitNumber}: ${chosenUnit.title}`;
        contentToSend = `Subject: ${currentSubjectName}\nUnit: ${unitName}\nSyllabus Subtopics to cover without missing any point:\n${chosenUnit.subtopics.map(t => `- ${t}`).join('\n')}\nReference standard SPPU textbooks: Nirali, TechKnowledge, Pearson, McGraw-Hill.`;
      }

      const response = await fetch('/api/gemini/summarize-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: currentSubjectName,
          branchCode: branchCode,
          unitOrChapter: unitName,
          language: selectedLanguage,
          mode: revisionMode,
          fileContent: contentToSend,
          mimeType: fileMimeType,
          fileName: uploadedFile?.name || `${currentSubjectCode}_notes.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.summary) {
        setSummaryResult(data.summary);
      } else {
        throw new Error('No summary received from engine.');
      }
    } catch (err: any) {
      console.error('Summarization failed:', err);
      setErrorMsg('Failed to process document. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download text file
  const handleDownload = () => {
    if (!summaryResult) return;
    const blob = new Blob([summaryResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSubjectCode}_ZeroLoss_RevisionNotes_${selectedLanguage}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save to localStorage
  const handleSaveToLocal = () => {
    if (!summaryResult) return;
    try {
      const existing = JSON.parse(localStorage.getItem('enginotes_saved_summaries') || '[]');
      const newEntry = {
        id: Date.now(),
        subjectName: currentSubjectName,
        subjectCode: currentSubjectCode,
        language: selectedLanguage,
        mode: revisionMode,
        createdAt: new Date().toLocaleDateString(),
        content: summaryResult,
      };
      existing.unshift(newEntry);
      localStorage.setItem('enginotes_saved_summaries', JSON.stringify(existing.slice(0, 30)));
      setSavedToLocal(true);
      setTimeout(() => setSavedToLocal(false), 2500);
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }
  };

  // Render formatted lines without raw LaTeX clutter
  const renderFormattedSummary = (rawText: string) => {
    const lines = rawText.split('\n');

    return (
      <div className="space-y-3 text-sm text-slate-800 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Heading with icon or special prefix
          if (trimmed.startsWith('📌') || trimmed.startsWith('🔑') || trimmed.startsWith('📝') || trimmed.startsWith('⚙️') || trimmed.startsWith('⚠️') || trimmed.startsWith('💡')) {
            return (
              <div
                key={idx}
                className="mt-5 mb-2.5 px-3.5 py-2 rounded-xl bg-[#006353]/10 border border-[#006353]/25 flex items-center gap-2 font-extrabold text-[#006353] text-sm shadow-2xs"
              >
                <span>{trimmed}</span>
              </div>
            );
          }

          // Numbered concept points
          if (/^(\d+[\.\)]|Point \d+:|Payeri \d+:|Step \d+:)/i.test(trimmed)) {
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#006353]/30 transition-colors shadow-2xs"
              >
                <span className="font-bold text-[#b87700] mr-2">{trimmed.split(':')[0]}:</span>
                <span className="text-slate-900">{trimmed.split(':').slice(1).join(':') || trimmed}</span>
              </div>
            );
          }

          // Formula lines
          if (trimmed.toLowerCase().includes('formula')) {
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#006353]/5 border border-[#006353]/20 font-mono text-xs text-[#006353] flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#ffa600] shrink-0" />
                <span>{trimmed}</span>
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const cleanContent = trimmed.replace(/^[\s•\-\*]+/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006353] mt-2 shrink-0" />
                <span className="text-slate-700">{cleanContent}</span>
              </div>
            );
          }

          // Normal paragraph
          return (
            <p key={idx} className="text-slate-700 pl-1">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden text-slate-800">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-4.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#006353] text-white flex items-center justify-center shadow-md shadow-[#006353]/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#b87700] border border-[#ffa600]/30">
                  Option 4
                </span>
                <span className="text-[10px] font-bold text-[#006353] uppercase tracking-wider">
                  PW Revision Engine • Zero-Point-Loss
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Smart PDF & Textbook Revision Notes
              </h3>
              <p className="text-xs text-slate-500">
                {currentSubjectName} • {branchCode} (Sem {semester})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= MODAL CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
          
          {/* Main Controls Row: Language & Revision Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#006353]" />
                <span>Notes Language (User Language Choice)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['English', 'Hinglish', 'Marathi'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-[#006353] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {lang === 'English' ? 'English' : lang === 'Hinglish' ? 'Hinglish' : 'Standard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Revision Depth Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ffa600]" />
                <span>Revision Depth Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setRevisionMode('comprehensive')}
                  title="Every single syllabus point covered step-by-step"
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    revisionMode === 'comprehensive'
                      ? 'bg-amber-100 text-[#b87700] border border-[#ffa600]/40 shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  📖 Zero Points Missed
                </button>
                <button
                  onClick={() => setRevisionMode('last-minute')}
                  title="Formulas and 5-mark core points for exam night"
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    revisionMode === 'last-minute'
                      ? 'bg-[#ffa600] text-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  ⚡ Last-Minute Exam
                </button>
                <button
                  onClick={() => setRevisionMode('pyq-high-yield')}
                  title="Most repeated SPPU questions with steps"
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    revisionMode === 'pyq-high-yield'
                      ? 'bg-[#006353] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  🎯 High-Yield PYQs
                </button>
              </div>
            </div>
          </div>

          {/* Three Input Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-[#006353] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>1. Upload PDF / Book File</span>
              </button>

              <button
                onClick={() => setActiveTab('paste')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-[#006353] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Paste Notes / Text</span>
              </button>

              <button
                onClick={() => setActiveTab('sppu-units')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'sppu-units'
                    ? 'bg-[#006353] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3. Pick SPPU Syllabus Unit (Instant)</span>
              </button>
            </div>

            {/* TAB 1: File Upload */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx,image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#006353] bg-white hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {uploadedFile ? uploadedFile.name : 'Click to select or drag & drop any PDF or Textbook file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports heavy textbooks, Techknowledge, Nirali publication PDFs, handwritten class notes, or chapter pages (up to 25MB)
                  </p>
                  {uploadedFile && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Paste Text */}
            {activeTab === 'paste' && (
              <div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste textbook chapter text, professor's handwritten notes transcription, or syllabus concepts here..."
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006353] shadow-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: You can copy and paste long chapters directly. The engine will extract every definition and formula without omitting anything.
                </p>
              </div>
            )}

            {/* TAB 3: SPPU Syllabus Unit Quick Picker */}
            {activeTab === 'sppu-units' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  Select any unit below to instantly generate full, zero-loss short revision notes from standard SPPU engineering reference books:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {unitsList.map((unit, idx) => (
                    <button
                      key={unit.unitNumber}
                      onClick={() => setSelectedUnitIndex(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
                        selectedUnitIndex === idx
                          ? 'bg-[#006353]/10 border-[#006353] text-slate-900 ring-1 ring-[#006353]/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[#006353]">
                          Unit {unit.unitNumber}
                        </span>
                        {selectedUnitIndex === idx && (
                          <Check className="w-3.5 h-3.5 text-[#006353]" />
                        )}
                      </div>
                      <p className="text-xs font-bold truncate text-slate-900">
                        {unit.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {unit.subtopics.join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#006353]" />
              <span>SPPU Pattern 2024 NEP • Step-by-Step Short Notes</span>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-[#006353] hover:bg-[#004f42] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-sm shadow-[#006353]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {progressStep === 1
                      ? 'Scanning Document Structure...'
                      : progressStep === 2
                      ? 'Extracting Formulas & Definitions...'
                      : 'Synthesizing Zero-Loss Notes...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Generate Short Revision Notes (Zero Missing Points)</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= RESULTS SECTION ================= */}
          {summaryResult && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              {/* Output Actions Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006353] animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Generated Notes Ready ({selectedLanguage})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-[#006353] border border-slate-200 font-semibold">
                    {revisionMode === 'last-minute' ? 'Last-Minute Exam Booster' : revisionMode === 'pyq-high-yield' ? 'High-Yield PYQ Format' : 'Comprehensive (All Points)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#006353]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#006353]" />
                    <span>Download .txt</span>
                  </button>

                  <button
                    onClick={handleSaveToLocal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006353]/10 hover:bg-[#006353]/20 text-[#006353] text-xs font-semibold border border-[#006353]/25 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedToLocal ? 'Saved in Account!' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Notes Viewer */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
                {renderFormattedSummary(summaryResult)}
              </div>
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SPPU B.Tech Revision Portal • Team Hunters (Abhishek, Tejas, Piyush, Kunal)</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
