import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Flag,
  Flame
} from 'lucide-react';
import {
  UnitQuiz,
  QuizQuestion,
  QuizAttemptResult,
  getQuizForSubjectAndUnit,
  saveQuizAttempt,
  getQuizAttemptsForSubject,
  getBestAttemptForUnit
} from '../data/sppuQuizzesData';
import { SppuSubject } from '../data/sppuSyllabusData';

interface SppuQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SppuSubject | null;
  initialUnitNumber?: number;
  onOpenNotes?: (unitNumber: number) => void;
}

export const SppuQuizModal: React.FC<SppuQuizModalProps> = ({
  isOpen,
  onClose,
  subject,
  initialUnitNumber = 1,
  onOpenNotes
}) => {
  // Navigation states: 'select-unit' | 'active-quiz' | 'result'
  const [viewState, setViewState] = useState<'select-unit' | 'active-quiz' | 'result'>('select-unit');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(initialUnitNumber);
  const [currentQuiz, setCurrentQuiz] = useState<UnitQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Quiz running state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(20 * 60); // 20 minutes = 1200 seconds
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [autoSubmittedAlert, setAutoSubmittedAlert] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<QuizAttemptResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial unit when modal opens
  useEffect(() => {
    if (isOpen && subject) {
      setSelectedUnitNumber(initialUnitNumber);
      setViewState('select-unit');
      setAutoSubmittedAlert(false);
      setShowConfirmSubmit(false);
    }
  }, [isOpen, subject, initialUnitNumber]);

  // Countdown timer logic with AUTO-SUBMIT at 00:00
  useEffect(() => {
    if (viewState === 'active-quiz' && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState, timeRemainingSeconds]);

  if (!isOpen || !subject) return null;

  // Start Quiz handler
  const handleStartQuiz = (unitNumber: number) => {
    const unitData = subject.units.find((u) => u.unitNumber === unitNumber) || subject.units[0];
    const quiz = getQuizForSubjectAndUnit(
      subject.code,
      subject.name,
      unitNumber,
      unitData.title
    );

    setCurrentQuiz(quiz);
    setSelectedUnitNumber(unitNumber);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds((quiz.durationMinutes || 20) * 60);
    setQuizStartTime(Date.now());
    setAutoSubmittedAlert(false);
    setShowConfirmSubmit(false);
    setViewState('active-quiz');
  };

  // Submit Logic
  const handleEvaluateQuiz = (isAutoSubmit: boolean = false) => {
    if (!currentQuiz) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.round((Date.now() - quizStartTime) / 1000);
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    currentQuiz.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unansweredCount++;
      } else if (ans === q.correctIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const score = correctCount; // 1 mark each
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);

    // Dynamic congratulatory / motivational messages based on score
    let congratulatoryMessage: string | undefined;
    let motivationalMessage: string | undefined;

    if (percentage >= 75) {
      congratulatoryMessage = `Outstanding Mastery! You scored ${score}/${currentQuiz.questions.length} (${percentage}%) in Unit ${currentQuiz.unitNumber}. You have thoroughly comprehended the SPPU 2024 core concepts, derivations, and mathematical algorithms. Keep up this relentless momentum and you will comfortably score an 'O' Grade in ${subject.name}!`;
    } else if (percentage >= 50) {
      congratulatoryMessage = `Great Effort! You secured ${score}/${currentQuiz.questions.length} (${percentage}%) and successfully cleared the passing threshold. Review the marked solutions below to refine your speed and numerical problem-solving precision for the upcoming university examination.`;
    } else {
      motivationalMessage = `Do not be discouraged! Engineering subjects require repetitive problem solving and conceptual clarity. Review each of the model answer explanations provided below, revise your unit notes, and take this mock quiz once more. Every mistake is a stepping stone to scoring higher in the actual SPPU in-sem and end-sem exams!`;
    }

    const result: QuizAttemptResult = {
      attemptId: `attempt_${Date.now()}`,
      subjectCode: subject.code,
      subjectName: subject.name,
      unitNumber: currentQuiz.unitNumber,
      unitTitle: currentQuiz.unitTitle,
      score,
      totalQuestions: currentQuiz.questions.length,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      userAnswers,
      isAutoSubmitted: isAutoSubmit,
      congratulatoryMessage,
      motivationalMessage
    };

    saveQuizAttempt(result);
    setActiveResult(result);
    setViewState('result');
    if (isAutoSubmit) {
      setAutoSubmittedAlert(true);
    }
  };

  const handleAutoSubmit = () => {
    handleEvaluateQuiz(true);
  };

  const handleManualSubmit = () => {
    setShowConfirmSubmit(false);
    handleEvaluateQuiz(false);
  };

  // Helper formatting for seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ: QuizQuestion | undefined = currentQuiz?.questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffa600] flex items-center justify-center border border-[#ffa600]/30 shadow-xs">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#006353] bg-[#006353]/10 px-2 py-0.5 rounded border border-[#006353]/20">
                  SPPU-{subject.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#b87700] border border-[#ffa600]/30">
                  Pattern 2024
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  • 20 Questions / 20 Mins Timer
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-md sm:max-w-xl">
                {subject.name} - Unit-wise SPPU Quizzes
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewState === 'active-quiz' && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs border ${
                  timeRemainingSeconds <= 180
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-amber-50 text-[#b87700] border-[#ffa600]/40'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* ================= VIEW 1: UNIT SELECTION LIST ================= */}
          {viewState === 'select-unit' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#006353] text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-[#ffa600]" />
                  <span>SPPU Examination 2024 Pattern Engine</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Unit-wise Mock Tests for {subject.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Every quiz contains strictly <strong>20 questions</strong> with a <strong>20-minute countdown timer</strong>. The quiz automatically submits when time expires. Test your conceptual depth and solve real SPPU PYQs with detailed explanations!
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006353]" />
                    Passing Mark: 10/20 (50%)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Timer className="w-3.5 h-3.5 text-[#ffa600]" />
                    20 Min Strict Auto-Submit
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-[#ffa600]" />
                    SPPU PYQ Questions Included
                  </span>
                </div>
              </div>

              {/* Units Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Select Unit to Begin (Units 1 to 6)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {subject.units.map((unit) => {
                    const bestAttempt = getBestAttemptForUnit(subject.code, unit.unitNumber);
                    const isInSem = unit.unitNumber === 1 || unit.unitNumber === 2;

                    return (
                      <div
                        key={unit.unitNumber}
                        className="bg-white border border-slate-200 hover:border-[#006353]/40 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#006353]/10 text-[#006353] text-xs font-bold flex items-center justify-center border border-[#006353]/20">
                                U{unit.unitNumber}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                Unit {unit.unitNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {isInSem && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/25">
                                  In-Sem (30M)
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                20 Qs
                              </span>
                            </div>
                          </div>

                          <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {unit.title}
                          </h5>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {unit.subtopics.join(' • ')}
                          </p>

                          {/* Best score badge if attempted */}
                          {bestAttempt ? (
                            <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <span className="text-slate-500">Previous Best:</span>
                              <span
                                className={`font-bold font-mono ${
                                  bestAttempt.percentage >= 75
                                    ? 'text-[#006353]'
                                    : bestAttempt.percentage >= 50
                                    ? 'text-[#ffa600]'
                                    : 'text-rose-600'
                                }`}
                              >
                                {bestAttempt.score} / 20 ({bestAttempt.percentage}%)
                              </span>
                            </div>
                          ) : (
                            <div className="mt-3 text-[11px] text-slate-400 italic">
                              Not attempted yet
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleStartQuiz(unit.unitNumber)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            <span>{bestAttempt ? 'Retake Quiz' : 'Start 20Q Quiz'}</span>
                          </button>

                          {onOpenNotes && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenNotes(unit.unitNumber);
                              }}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                              title="Read Unit Notes First"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: ACTIVE 20Q QUIZ RUNNER ================= */}
          {viewState === 'active-quiz' && currentQuiz && currentQ && (
            <div className="space-y-6">
              {/* Auto submit warning banner if triggered */}
              {autoSubmittedAlert && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-bounce">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Time has expired!</strong> 20 minutes limit reached. Submitting your answers automatically...
                  </span>
                </div>
              )}

              {/* Progress and Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#006353]">
                    Unit {currentQuiz.unitNumber}: {currentQuiz.unitTitle}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-slate-900">
                      Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                    </span>
                    {currentQ.pyqYear && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#b87700] border border-[#ffa600]/30">
                        {currentQ.pyqYear}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFlaggedQuestions((prev) => ({
                        ...prev,
                        [currentQ.id]: !prev[currentQ.id]
                      }));
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-50 text-[#b87700] border-[#ffa600]/40'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQ.id] ? 'Flagged' : 'Mark for Review'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[currentQ.id];
                        return copy;
                      });
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 cursor-pointer"
                    title="Clear choice"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setUserAnswers((prev) => ({
                          ...prev,
                          [currentQ.id]: optIdx
                        }));
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#006353]/10 border-[#006353] shadow-sm text-slate-900 ring-1 ring-[#006353]/30'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#006353] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Palette (1 to 20) */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Question Palette:</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006353]" />
                      Answered ({Object.keys(userAnswers).length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffa600]" />
                      Flagged
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      Pending ({currentQuiz.questions.length - Object.keys(userAnswers).length})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
                  {currentQuiz.questions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = idx === currentQuestionIndex;

                    let bgClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                    if (isAnswered) bgClass = 'bg-[#006353] text-white';
                    if (isFlagged) bgClass = 'bg-[#ffa600] text-white';
                    if (isCurrent) bgClass += ' ring-2 ring-[#006353] font-bold';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-8 rounded-lg text-xs font-mono font-semibold flex items-center justify-center cursor-pointer transition-all ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next / Submit Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-5 py-2 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </button>
                </div>
              </div>

              {/* Submit Confirmation Dialog */}
              {showConfirmSubmit && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffa600] border border-[#ffa600]/30 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      Ready to submit your quiz?
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1.5">
                      <p>
                        Total Questions: <strong>{currentQuiz.questions.length}</strong>
                      </p>
                      <p>
                        Answered: <strong className="text-[#006353]">{Object.keys(userAnswers).length}</strong>
                      </p>
                      <p>
                        Unattempted:{' '}
                        <strong className="text-rose-600">
                          {currentQuiz.questions.length - Object.keys(userAnswers).length}
                        </strong>
                      </p>
                      <p>
                        Time Left: <strong>{formatTime(timeRemainingSeconds)}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setShowConfirmSubmit(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      >
                        Resume Quiz
                      </button>
                      <button
                        onClick={handleManualSubmit}
                        className="flex-1 py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-sm cursor-pointer"
                      >
                        Yes, Submit Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 3: QUIZ RESULT SCORECARD & MOTIVATION ================= */}
          {viewState === 'result' && activeResult && currentQuiz && (
            <div className="space-y-6">
              {/* Scorecard Hero Banner */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm ${
                  activeResult.percentage >= 75
                    ? 'bg-emerald-50 border-emerald-200'
                    : activeResult.percentage >= 50
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Unit {activeResult.unitNumber} Quiz Completed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {activeResult.score} / {activeResult.totalQuestions} Marks
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        activeResult.percentage >= 75
                          ? 'bg-[#006353]/15 text-[#006353] border border-[#006353]/30'
                          : activeResult.percentage >= 50
                          ? 'bg-amber-100 text-[#b87700] border border-[#ffa600]/40'
                          : 'bg-rose-100 text-rose-700 border border-rose-300'
                      }`}
                    >
                      {activeResult.percentage}% Score •{' '}
                      {activeResult.percentage >= 75
                        ? 'Passed with Distinction'
                        : activeResult.percentage >= 50
                        ? 'Passed'
                        : 'Needs Revision'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Time Spent: {Math.floor(activeResult.timeSpentSeconds / 60)}m {activeResult.timeSpentSeconds % 60}s
                    </span>
                  </div>
                </div>

                {/* Score circle icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <div
                    className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center ${
                      activeResult.percentage >= 75
                        ? 'border-[#006353] text-[#006353] bg-white'
                        : activeResult.percentage >= 50
                        ? 'border-[#ffa600] text-[#b87700] bg-white'
                        : 'border-rose-500 text-rose-600 bg-white'
                    }`}
                  >
                    <span className="text-2xl font-black font-mono">{activeResult.percentage}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Accuracy</span>
                  </div>
                </div>
              </div>

              {/* PURE ENGLISH MOTIVATIONAL / CONGRATULATORY SECTION */}
              {activeResult.congratulatoryMessage && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                    <Sparkles className="w-5 h-5 text-[#ffa600]" />
                    <span>Congratulations! — SPPU 2024 Exam Ready</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-800">
                    {activeResult.congratulatoryMessage}
                  </p>
                </div>
              )}

              {activeResult.motivationalMessage && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
                    <Flame className="w-5 h-5 text-[#ffa600]" />
                    <span>Exam Motivation — Practice Makes Perfect!</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-800">
                    {activeResult.motivationalMessage}
                  </p>
                </div>
              )}

              {/* Detailed Question Review Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#006353]" />
                    <span>Detailed Question Review & Explanations</span>
                  </h4>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                        reviewFilter === 'all' ? 'bg-[#006353] text-white' : 'text-slate-600'
                      }`}
                    >
                      All (20)
                    </button>
                    <button
                      onClick={() => setReviewFilter('correct')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                        reviewFilter === 'correct' ? 'bg-[#006353] text-white' : 'text-slate-600'
                      }`}
                    >
                      Correct ({activeResult.correctCount})
                    </button>
                    <button
                      onClick={() => setReviewFilter('incorrect')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer font-bold ${
                        reviewFilter === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      Wrong / Missed ({activeResult.incorrectCount + activeResult.unansweredCount})
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {currentQuiz.questions
                    .filter((q) => {
                      const ans = activeResult.userAnswers[q.id];
                      const isCorrect = ans === q.correctIndex;
                      if (reviewFilter === 'correct') return isCorrect;
                      if (reviewFilter === 'incorrect') return !isCorrect;
                      return true;
                    })
                    .map((q, qIndex) => {
                      const userChoice = activeResult.userAnswers[q.id];
                      const isCorrect = userChoice === q.correctIndex;
                      const isUnanswered = userChoice === undefined;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border space-y-3 shadow-xs ${
                            isCorrect
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : isUnanswered
                              ? 'bg-white border-slate-200'
                              : 'bg-rose-50/60 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">
                                #{qIndex + 1}
                              </span>
                              {isCorrect ? (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Correct (+1 Mark)
                                </span>
                              ) : isUnanswered ? (
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  Unattempted (0 Mark)
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Incorrect (0 Mark)
                                </span>
                              )}
                            </div>

                            {q.pyqYear && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#b87700] border border-[#ffa600]/30">
                                {q.pyqYear}
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-slate-900">
                            {q.question}
                          </p>

                          {/* Options breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oIdx) => {
                              const isThisCorrect = oIdx === q.correctIndex;
                              const isThisUserSelected = oIdx === userChoice;

                              let optBorder = 'border-slate-200 bg-white text-slate-600';
                              if (isThisCorrect) {
                                optBorder = 'border-emerald-300 bg-emerald-100/70 text-emerald-900 font-bold';
                              } else if (isThisUserSelected && !isThisCorrect) {
                                optBorder = 'border-rose-300 bg-rose-100/70 text-rose-900 line-through';
                              }

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${optBorder}`}
                                >
                                  <span className="w-5 h-5 rounded font-mono font-bold flex items-center justify-center text-[10px] bg-slate-100 text-slate-700">
                                    {['A', 'B', 'C', 'D'][oIdx]}
                                  </span>
                                  <span className="truncate">{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Detailed Explanation */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1 shadow-2xs">
                            <strong className="text-[#006353] block">
                              SPPU Model Explanation:
                            </strong>
                            <p className="leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setViewState('select-unit')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to All Units
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartQuiz(currentQuiz.unitNumber)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006353] hover:bg-[#004f42] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Unit {currentQuiz.unitNumber} Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
