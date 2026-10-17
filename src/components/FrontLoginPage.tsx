import React, { useState, useId } from 'react';
import {
  GraduationCap,
  User as UserIcon,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layers,
  Cpu,
  Zap,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateMobileNumber, validateName, cleanMobileNumber } from '../utils/mobileValidator';

const ENGINEERING_BRANCHES = [
  { code: 'Computer Engineering', label: 'Computer Engineering', short: 'COMP', icon: Code2 },
  { code: 'Information Technology', label: 'Information Technology', short: 'IT', icon: Layers },
  { code: 'AI & Data Science', label: 'AI & Data Science', short: 'AI & DS', icon: Cpu },
  { code: 'Electronics & Telecommunication', label: 'Electronics & Telecommunication (E&TC)', short: 'E&TC', icon: Zap },
  { code: 'Mechanical Engineering', label: 'Mechanical Engineering', short: 'MECH', icon: Cpu },
  { code: 'Civil Engineering', label: 'Civil Engineering', short: 'CIVIL', icon: Layers },
  { code: 'Electrical Engineering', label: 'Electrical Engineering', short: 'ELECT', icon: Zap },
  { code: 'First Year (FE - Common)', label: 'First Year Engineering (FE - Common)', short: 'FE', icon: BookOpen }
];

export const FrontLoginPage: React.FC = () => {
  const { loginWithMobile } = useAuth();
  const nameInputId = useId();
  const phoneInputId = useId();
  const branchSelectId = useId();
  const semesterSelectId = useId();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState<number>(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedName, setTouchedName] = useState(false);

  // Live validation checks
  const phoneValidation = validateMobileNumber(mobileNumber);
  const nameValidation = validateName(name);

  // Quick check for sequence during typing to alert the user immediately
  const rawClean = mobileNumber.replace(/\D/g, '');
  const isObviousSequence =
    rawClean === '1234567890' ||
    rawClean === '9876543210' ||
    rawClean === '0123456789' ||
    (rawClean.length === 10 && /^(\d)\1{9}$/.test(rawClean));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);
    if (!touchedPhone) setTouchedPhone(true);
    if (errorMessage) setErrorMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touchedName) setTouchedName(true);
    if (errorMessage) setErrorMessage(null);
  };

  const handleBranchSelect = (selectedBranch: string) => {
    setBranch(selectedBranch);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedName(true);
    setTouchedPhone(true);

    const nameCheck = validateName(name);
    if (!nameCheck.isValid) {
      setErrorMessage(nameCheck.error || 'Please enter your full name.');
      return;
    }

    const mobileCheck = validateMobileNumber(mobileNumber);
    if (!mobileCheck.isValid) {
      setErrorMessage(mobileCheck.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!branch) {
      setErrorMessage('Please select your engineering branch.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = loginWithMobile({
        name: name.trim(),
        mobileNumber: cleanMobileNumber(mobileNumber),
        branch,
        semester
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden selection:bg-[#006353] selection:text-white">
      {/* Background Decorative Ambient Glows using user requested colors */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#006353]/10 via-[#006353]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-[#ffa600]/10 via-[#ffa600]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-[#ffa600]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle blueprint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #006353 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#006353] flex items-center justify-center text-white shadow-lg shadow-[#006353]/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Engi<span className="text-[#006353]">Notes</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#ffa600]/15 text-[#b87700] border border-[#ffa600]/30">
                Study Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Engineering Study Portal • College Notes & PYQ Bank
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#006353]" />
          <span className="font-semibold">Verified Student Access • 100% Free</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual highlights & value props */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006353]/10 border border-[#006353]/20 text-[#006353] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#ffa600]" />
              <span>SPPU Verified Study Material & PYQs</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Study Smarter, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#006353] via-[#008f77] to-[#ffa600] bg-clip-text text-transparent">
                  Score Like Toppers!
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Access verified handwritten notes, solved PYQs, syllabus guides, formula sheets, and AI-powered revision tools across all engineering branches.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#006353]/40 transition-all flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#006353]/10 text-[#006353] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Handwritten Notes</h4>
                  <p className="text-[11px] text-slate-500">Unit-wise high scoring notes</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#ffa600]/40 transition-all flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ffa600]/15 text-[#b87700] flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">PYQ Question Bank</h4>
                  <p className="text-[11px] text-slate-500">Past papers with step solutions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#ffa600]/40 transition-all flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ffa600]/15 text-[#c78200] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Last Minute Notes AI</h4>
                  <p className="text-[11px] text-slate-500">Instant PDF exam short notes</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#006353]/40 transition-all flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#006353]/10 text-[#006353] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verified Direct Login</h4>
                  <p className="text-[11px] text-slate-500">Name, mobile & branch access</p>
                </div>
              </div>
            </div>

            {/* Social Proof Counter */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-600">
              <div className="flex -space-x-2">
                {['A', 'S', 'P', 'R'].map((initial, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#006353] shadow-xs"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span>
                Joined by <strong className="text-[#006353] font-bold">14,500+</strong> engineering students
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Modern Login Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-200/50 relative">
              {/* Card Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#006353]" />
                    <span>Student Login</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your student details to access the study hub
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffa600]/10 border border-[#ffa600]/20 text-[11px] font-bold text-[#b87700]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Access</span>
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <strong className="font-bold block text-rose-900">Validation Error:</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Enter Your Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Your Full Name
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    {touchedName && name.trim().length >= 2 && nameValidation.isValid && (
                      <span className="text-[11px] font-semibold text-[#006353] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid Name
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id={nameInputId}
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="e.g. Abhishek Babar or Rahul Sharma"
                      required
                      autoComplete="name"
                      className={`w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl border transition-all ${
                        touchedName && !nameValidation.isValid && name.length > 0
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : touchedName && nameValidation.isValid
                          ? 'border-[#006353]/50 focus:border-[#006353] focus:ring-2 focus:ring-[#006353]/20'
                          : 'border-slate-200 focus:border-[#006353] focus:ring-2 focus:ring-[#006353]/20'
                      } focus:bg-white focus:outline-none`}
                    />
                  </div>
                </div>

                {/* 2. Enter Mobile Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={phoneInputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Mobile Number <span className="text-slate-500 font-normal lowercase">(10 Digits)</span>
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          mobileNumber.length === 10
                            ? 'bg-[#006353]/10 text-[#006353]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {mobileNumber.length}/10
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-slate-500 border-r border-slate-200 pr-2.5">
                      <Phone className="w-4 h-4 text-[#006353]" />
                      <span className="text-xs font-bold text-slate-700">+91</span>
                    </div>
                    <input
                      id={phoneInputId}
                      type="tel"
                      inputMode="numeric"
                      value={mobileNumber}
                      onChange={handlePhoneChange}
                      placeholder="98XXXXXXXX (10 digits only)"
                      maxLength={10}
                      required
                      autoComplete="tel"
                      className={`w-full bg-slate-50 text-sm font-mono text-slate-900 placeholder-slate-400 pl-20 pr-10 py-3 rounded-2xl border transition-all ${
                        isObviousSequence || (touchedPhone && !phoneValidation.isValid && mobileNumber.length === 10)
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : touchedPhone && phoneValidation.isValid
                          ? 'border-[#006353]/50 focus:border-[#006353] focus:ring-2 focus:ring-[#006353]/20'
                          : 'border-slate-200 focus:border-[#006353] focus:ring-2 focus:ring-[#006353]/20'
                      } focus:bg-white focus:outline-none`}
                    />
                    {touchedPhone && phoneValidation.isValid && (
                      <CheckCircle2 className="w-4 h-4 text-[#006353] absolute right-3 pointer-events-none" />
                    )}
                  </div>

                  {/* Realtime sequence warning helper */}
                  {isObviousSequence && (
                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>Sequence or dummy numbers (e.g. 1234567890 or 9876543210) are not allowed! Please enter your real number.</span>
                    </p>
                  )}

                  {!isObviousSequence && touchedPhone && mobileNumber.length === 10 && !phoneValidation.isValid && (
                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneValidation.error}</span>
                    </p>
                  )}

                  {!isObviousSequence && touchedPhone && phoneValidation.isValid && (
                    <p className="text-[11px] font-semibold text-[#006353] flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified 10-digit mobile number</span>
                    </p>
                  )}
                </div>

                {/* 3. Select Branch */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={branchSelectId} className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Select Your Branch
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#006353]">
                      {branch}
                    </span>
                  </div>

                  {/* Quick Select Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ENGINEERING_BRANCHES.slice(0, 8).map((b) => {
                      const isSelected = branch === b.code;
                      const IconComp = b.icon;
                      return (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => handleBranchSelect(b.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#006353] border-[#006353] text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#006353]/50 hover:bg-white'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-white text-slate-500 border border-slate-200'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <span className="block text-xs font-bold truncate">
                              {b.short}
                            </span>
                            <span className={`text-[9px] block truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                              {b.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Full Dropdown for all branches */}
                  <div className="pt-1">
                    <select
                      id={branchSelectId}
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-slate-50 text-xs text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#006353] focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {ENGINEERING_BRANCHES.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.label} ({b.short})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Year/Semester selection */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={semesterSelectId} className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Semester
                    </label>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
                      const isSelected = semester === semNum;
                      return (
                        <button
                          key={semNum}
                          type="button"
                          onClick={() => setSemester(semNum)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#ffa600] text-slate-900 shadow-xs font-black'
                              : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-[#ffa600]/40 hover:bg-white'
                          }`}
                        >
                          Sem {semNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Login Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#006353] hover:bg-[#004d41] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#006353]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying student details...</span>
                      </div>
                    ) : (
                      <>
                        <span>Enter Study Hub</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Guarantee */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 text-center sm:text-left">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006353]" />
                  <span>Secure verified login via Name, Mobile No. & Branch</span>
                </div>
                <span className="text-slate-500 font-medium">
                  100% Genuine Engineering Study Portal
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          EngiNotes Study Hub © {new Date().getFullYear()} • Engineering Notes, PYQs & Syllabi Portal
        </p>
      </footer>
    </div>
  );
};
