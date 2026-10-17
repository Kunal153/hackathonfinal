import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SppuSubject } from '../data/sppuSyllabusData';
import { SppuPyqPaper, PyqQuestion, getPyqPapersForSubject } from '../data/sppuPyqData';

interface SppuPyqModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SppuSubject | null;
}

export const SppuPyqModal: React.FC<SppuPyqModalProps> = ({
  isOpen,
  onClose,
  subject
}) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>('');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  if (!isOpen || !subject) return null;

  const papers = getPyqPapersForSubject(subject.code, subject.name);
  const activePaper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  const toggleSolution = (qNum: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qNum]: !prev[qNum]
    }));
  };

  const expandAllSolutions = () => {
    const allExpanded: Record<string, boolean> = {};
    activePaper.questionGroups.forEach((group) => {
      group.primaryQuestions.forEach((q) => {
        allExpanded[q.questionNumber] = true;
      });
      group.orOptionQuestions.forEach((q) => {
        allExpanded[q.questionNumber] = true;
      });
    });
    setExpandedSolutions(allExpanded);
  };

  const collapseAllSolutions = () => {
    setExpandedSolutions({});
  };

  // Download PDF generator using jsPDF
  const handleDownloadPdf = () => {
    if (!activePaper) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('SAVITRIBAI PHULE PUNE UNIVERSITY', pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${activePaper.examType} - ${activePaper.examSession}`, pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`[SPPU-${activePaper.subjectCode}] ${activePaper.subjectName}`, pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Exam Meta line
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Time Allowed: ${activePaper.timeAllowedHours}`, 15, y);
    doc.text(`Max Marks: ${activePaper.totalMarks} Marks`, pageWidth - 15, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(180, 180, 180);
    doc.line(15, y, pageWidth - 15, y);
    y += 6;

    // Instructions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Instructions to Candidates:', 15, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    activePaper.instructions.forEach((inst, i) => {
      doc.text(`${i + 1}. ${inst}`, 15, y);
      y += 4;
    });
    y += 4;

    // Question Groups
    activePaper.questionGroups.forEach((group) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(group.groupTitle, 15, y);
      y += 5;

      // Primary Questions
      group.primaryQuestions.forEach((q) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`${q.questionNumber}`, 15, y);
        doc.text(`[${q.marks} Marks]`, pageWidth - 15, y, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(q.questionText, pageWidth - 50);
        doc.text(splitText, 32, y);
        y += splitText.length * 4.5 + 4;

        // Solution Summary
        if (q.solution) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(80, 80, 80);
          const solSummary = doc.splitTextToSize(`Ans: ${q.solution.definitionAndOverview} Result: ${q.solution.conclusionOrFinalAnswer}`, pageWidth - 40);
          doc.text(solSummary, 32, y);
          doc.setTextColor(0, 0, 0);
          y += solSummary.length * 4 + 4;
        }
      });

      // OR Divider
      if (group.orOptionQuestions.length > 0) {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('--- OR ---', pageWidth / 2, y, { align: 'center' });
        y += 6;

        group.orOptionQuestions.forEach((q) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(`${q.questionNumber}`, 15, y);
          doc.text(`[${q.marks} Marks]`, pageWidth - 15, y, { align: 'right' });

          doc.setFont('helvetica', 'normal');
          const splitText = doc.splitTextToSize(q.questionText, pageWidth - 50);
          doc.text(splitText, 32, y);
          y += splitText.length * 4.5 + 4;

          if (q.solution) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            const solSummary = doc.splitTextToSize(`Ans: ${q.solution.definitionAndOverview} Result: ${q.solution.conclusionOrFinalAnswer}`, pageWidth - 40);
            doc.text(solSummary, 32, y);
            doc.setTextColor(0, 0, 0);
            y += solSummary.length * 4 + 4;
          }
        });
      }

      y += 6;
    });

    // Save PDF
    doc.save(`SPPU_${activePaper.subjectCode}_${activePaper.examSession.replace(/[^a-zA-Z0-9]/g, '_')}_Paper.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006353]/10 text-[#006353] flex items-center justify-center border border-[#006353]/20 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded border border-[#006353]/20">
                  SPPU-{subject.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/30">
                  Original PYQs & Solutions
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-md sm:max-w-xl">
                {subject.name} - Past Year Question Papers
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Selector Bar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {papers.map((p) => {
              const isSelected = p.id === activePaper.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPaperId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#006353] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{p.examSession} ({p.totalMarks}M)</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAllSolutions}
              className="text-xs text-[#006353] hover:text-[#004f42] font-bold cursor-pointer"
            >
              Expand All Solutions
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={collapseAllSolutions}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          {/* SPPU Formal Header Sheet */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
            <p className="text-xs font-black tracking-wider uppercase text-[#006353]">
              SAVITRIBAI PHULE PUNE UNIVERSITY
            </p>
            <h3 className="text-lg font-black text-slate-900">
              {activePaper.examType}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Course: <strong className="text-slate-900">[SPPU-{activePaper.subjectCode}] {activePaper.subjectName}</strong>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-600 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                Time: {activePaper.timeAllowedHours}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                Max Marks: {activePaper.totalMarks} Marks
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                {activePaper.syllabusPattern}
              </span>
            </div>
            
            {/* Candidate Instructions */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-left text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 block font-bold">Instructions to Candidates:</strong>
              {activePaper.instructions.map((inst, idx) => (
                <p key={idx} className="leading-relaxed">
                  {idx + 1}. {inst}
                </p>
              ))}
            </div>
          </div>

          {/* Question Groups */}
          <div className="space-y-6">
            {activePaper.questionGroups.map((group, gIdx) => (
              <div
                key={gIdx}
                className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm"
              >
                {/* Group Heading */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-black text-[#006353] flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{group.groupTitle}</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Solve Primary OR Option
                  </span>
                </div>

                {/* Primary Questions */}
                <div className="space-y-4">
                  {group.primaryQuestions.map((q) => (
                    <QuestionCard
                      key={q.questionNumber}
                      question={q}
                      isExpanded={!!expandedSolutions[q.questionNumber]}
                      onToggle={() => toggleSolution(q.questionNumber)}
                    />
                  ))}
                </div>

                {/* OR Option Divider */}
                {group.orOptionQuestions.length > 0 && (
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 py-1 text-xs font-bold text-[#ffa600] rounded-full border border-[#ffa600]/30 shadow-2xs">
                        --- OR ---
                      </span>
                    </div>
                  </div>
                )}

                {/* OR Option Questions */}
                {group.orOptionQuestions.length > 0 && (
                  <div className="space-y-4">
                    {group.orOptionQuestions.map((q) => (
                      <QuestionCard
                        key={q.questionNumber}
                        question={q}
                        isExpanded={!!expandedSolutions[q.questionNumber]}
                        onToggle={() => toggleSolution(q.questionNumber)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Download Bar for mobile */}
          <div className="sm:hidden pt-2">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3 rounded-2xl bg-[#006353] hover:bg-[#004f42] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PYQ Paper & Solutions PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual question with expandable solution
const QuestionCard: React.FC<{
  question: PyqQuestion;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ question, isExpanded, onToggle }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#006353]/30 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded border border-[#006353]/20">
            {question.questionNumber}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Unit {question.unitNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-[#b87700] border border-[#ffa600]/30">
            [{question.marks} Marks]
          </span>

          <button
            onClick={onToggle}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>{isExpanded ? 'Hide Solution' : 'View Solved Answer'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
        {question.questionText}
      </p>

      {/* Expandable Model Solution */}
      {isExpanded && question.solution && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-2xs">
            <strong className="text-[#006353] flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006353]" />
              <span>SPPU Model Answer Key & Definition:</span>
            </strong>
            <p className="text-slate-700 leading-relaxed">
              {question.solution.definitionAndOverview}
            </p>
          </div>

          {/* Key Formulas */}
          {question.solution.keyFormulasOrEquations && question.solution.keyFormulasOrEquations.length > 0 && (
            <div className="p-3 rounded-xl bg-[#006353]/10 border border-[#006353]/20 text-xs space-y-1">
              <span className="font-bold text-[#006353] block">
                Governing Formulas & Equations:
              </span>
              <ul className="list-disc list-inside space-y-1 font-mono text-[#006353]">
                {question.solution.keyFormulasOrEquations.map((f, fIdx) => (
                  <li key={fIdx}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step by step derivation */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block">
              Step-by-Step Derivation & Solution:
            </span>
            <div className="space-y-1.5 pl-3 border-l-2 border-[#ffa600]">
              {question.solution.stepByStepSolution.map((step, sIdx) => (
                <p key={sIdx} className="leading-relaxed">
                  {step}
                </p>
              ))}
            </div>
          </div>

          {/* Diagram Note if present */}
          {question.diagramDescription && (
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
              <strong className="text-slate-800">Exam Diagram Guidance: </strong>
              {question.diagramDescription}
            </div>
          )}

          {/* Final Answer Box */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between gap-2">
            <span className="font-bold text-emerald-800">
              Final Answer: {question.solution.conclusionOrFinalAnswer}
            </span>
          </div>

          {/* Examiner Tip */}
          <div className="text-[11px] text-[#b87700] italic flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#ffa600]" />
            <span>Examiner Scoring Tip: {question.solution.examinerTips}</span>
          </div>
        </div>
      )}
    </div>
  );
};
