import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Timer,
  Cpu,
  ArrowRight,
  GraduationCap,
  Award,
  Zap,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Flame,
  ChevronDown
} from 'lucide-react';

interface HeroFrontPageProps {
  onStartPreparation: () => void;
}

export const HeroFrontPage: React.FC<HeroFrontPageProps> = ({ onStartPreparation }) => {
  return (
    <div className="relative overflow-hidden bg-white py-12 sm:py-20 border-b border-slate-200">
      {/* Background Ambient Glows with custom theme colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#006353]/10 via-[#006353]/5 to-[#ffa600]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-[#ffa600]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffa600]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #006353 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006353]/10 border border-[#006353]/25 text-[#006353] text-xs font-bold uppercase tracking-wider shadow-xs">
            <GraduationCap className="w-4 h-4 text-[#006353]" />
            <span>Savitribai Phule Pune University (SPPU) • 2024 NEP Pattern</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffa600]/15 border border-[#ffa600]/30 text-[#b87700] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Free College Study Portal</span>
          </div>
        </div>

        {/* Grand Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Crush Your Engineering Exams with{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006353] via-[#008f77] to-[#ffa600]">
                EngiNotes
              </span>
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Your all-in-one SPPU academic hub: verified handwritten short notes for every syllabus unit, authentic 5-year PYQ question papers with step-by-step solved solutions, 20-minute timed unit quizzes with auto-submit, and Brahmāstra AI 24/7 engineering problem solver.
          </p>
        </div>

        {/* ================= MASSIVE CTA BUTTON ================= */}
        <div className="pt-2 pb-4 flex flex-col items-center justify-center">
          {/* Team Hunters & Founders: Strictly in ONE single horizontal line */}
          <div className="mb-6 w-full flex justify-center px-2">
            <div className="inline-flex flex-nowrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white border border-[#ffa600]/50 text-xs sm:text-sm shadow-md whitespace-nowrap overflow-x-auto max-w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffa600] shrink-0" />
                <span className="font-extrabold uppercase tracking-wider text-[#c78200] shrink-0">Team Hunters</span>
              </div>
              <span className="text-slate-300 shrink-0 font-bold">•</span>
              <span className="font-bold text-slate-700 shrink-0">Founders:</span>
              <div className="inline-flex flex-nowrap items-center gap-2 text-slate-800 shrink-0">
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[#006353] font-bold text-xs whitespace-nowrap shrink-0 shadow-2xs">
                  1) Abhishek Babar
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[#006353] font-bold text-xs whitespace-nowrap shrink-0 shadow-2xs">
                  2) Tejas Shinde
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[#006353] font-bold text-xs whitespace-nowrap shrink-0 shadow-2xs">
                  3) Piyush Plepagwar
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[#006353] font-bold text-xs whitespace-nowrap shrink-0 shadow-2xs">
                  4) Kunal Chaudhari
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onStartPreparation}
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-5 sm:py-6 rounded-3xl font-black text-sm sm:text-lg tracking-wider uppercase text-white bg-[#006353] hover:bg-[#004f42] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-[#006353]/35 border-2 border-[#008f77]/50 overflow-hidden"
          >
            {/* Light Wave Sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#ffa600] fill-[#ffa600]" />
              <span className="font-extrabold tracking-wide drop-shadow-sm">
                LET'S START YOUR PREPARATION
              </span>
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-200" />
            </div>
          </button>

          <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
            <span>✨ Select branch, choose semester, and access notes & quizzes instantly</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#006353]" />
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-4">
          
          {/* Pillar 1: Notes */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#006353]/60 transition-all shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006353] transition-colors">
              SPPU Unit Short Notes
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Every syllabus point covered from Unit 1 to Unit 6 across standard reference textbooks (Nirali, TechKnowledge, B.S. Grewal, Boylestad).
            </p>
            <div className="mt-3 text-[11px] font-bold text-[#006353]">
              PDF Downloads & Quick Formula Sheets →
            </div>
          </div>

          {/* Pillar 2: PYQ */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#ffa600]/60 transition-all shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-[#ffa600]/15 border border-[#ffa600]/30 text-[#b87700] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#b87700] transition-colors">
              Authentic 5-Year PYQs
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Original In-Sem (30M) and End-Sem (70M) question papers with step-by-step marking scheme answers and derivation diagrams.
            </p>
            <div className="mt-3 text-[11px] font-bold text-[#b87700]">
              Pattern 2024 Question Papers →
            </div>
          </div>

          {/* Pillar 3: Quizzes */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#ffa600]/60 transition-all shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-[#ffa600]/15 border border-[#ffa600]/30 text-[#c78200] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#c78200] transition-colors">
              20Q / 20-Min Quizzes
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Unit-wise mock tests with 20 questions, a strict 20-minute countdown timer, auto-submit at 00:00, and performance reviews.
            </p>
            <div className="mt-3 text-[11px] font-bold text-[#c78200]">
              Exam Condition Testing →
            </div>
          </div>

          {/* Pillar 4: Brahmastra AI */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#006353]/60 transition-all shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-[#006353]/10 border border-[#006353]/20 text-[#006353] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006353] transition-colors">
              Brahmāstra AI Bot
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Draggable AI tutor powered by Gemini. Solves any engineering numerical, mathematical derivation, or coding question.
            </p>
            <div className="mt-3 text-[11px] font-bold text-[#006353]">
              Floating 24/7 Problem Solver →
            </div>
          </div>
        </div>

        {/* Academic Counters */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#006353] font-mono">9</p>
            <p className="text-xs text-slate-500 font-semibold">Engineering Branches</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#ffa600] font-mono">8</p>
            <p className="text-xs text-slate-500 font-semibold">Semesters (FE to BE)</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#006353] font-mono">100+</p>
            <p className="text-xs text-slate-500 font-semibold">Core SPPU Courses</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#ffa600] font-mono">5,000+</p>
            <p className="text-xs text-slate-500 font-semibold">Solved PYQs & MCQs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
