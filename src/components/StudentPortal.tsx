import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  X, User, Lock, Mail, BookOpen, Calendar, Award, TrendingUp,
  FileText, LogOut, Play, Download,
  MessageSquare, Briefcase, BarChart3, Settings,
  Video, ClipboardCheck, CreditCard,
  CheckCircle2, AlertCircle, Send, ChevronRight, ShieldCheck, ArrowLeft
} from 'lucide-react';
import Logo from './Logo';


// ─── EmailJS Configuration ─────────────────────────────────────────────
// 👉 Replace these 3 values with your EmailJS credentials.
//    Get them at https://dashboard.emailjs.com (free, takes 5 minutes)
//    Detailed steps: see EMAILJS_SETUP.md in the project root
const EMAILJS_CONFIG = {
  SERVICE_ID:  'service_xxxxxxx',
  TEMPLATE_ID: 'template_xxxxxxx',
  PUBLIC_KEY:  'YOUR_PUBLIC_KEY',
  TO_EMAIL:    'hr.skillitiq@gmail.com',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Student {
  name: string;
  email: string;
  course: string;
  enrollDate: string;
  progress: number;
}

type View = 'login' | 'register' | 'verify' | 'dashboard';
type Section =
  | 'overview' | 'courses' | 'assignments' | 'classes' | 'materials'
  | 'chat' | 'jobs' | 'certificates' | 'payments' | 'profile';

export default function StudentPortal({ open, onClose }: Props) {
  const [view, setView] = useState<View>('login');
  const [section, setSection] = useState<Section>('overview');
  const [pendingStudent, setPendingStudent] = useState<Student | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', course: '' });
  const [error, setError] = useState('');

  // OTP / verification state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [sending, setSending] = useState(false);

  // Resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // ─── Send OTP via EmailJS ───────────────────────────────────────────
  const sendOtp = async (s: Student) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setVerifyError('');
    setSending(true);

    const isConfigured =
      EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
      EMAILJS_CONFIG.SERVICE_ID !== 'service_xxxxxxx';

    if (isConfigured) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email:      EMAILJS_CONFIG.TO_EMAIL,
            student_name:  s.name,
            student_email: s.email,
            otp_code:      code,
            time:          new Date().toLocaleString(),
            subject:       'SKILLITIQ – Student Login Access Code',
            message:       `Login access code for ${s.email}: ${code}`,
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        );
        console.log('✅ Access code sent to', EMAILJS_CONFIG.TO_EMAIL);
      } catch (err) {
        console.error('❌ EmailJS error:', err);
        setVerifyError('Failed to send code. Please try again.');
        setSending(false);
        return;
      }
    } else {
      console.log('📧 [DEMO] Code that would be sent to', EMAILJS_CONFIG.TO_EMAIL, ':', code);
    }

    setSending(false);
    setResendTimer(30);
  };

  // ─── Login → triggers OTP send ──────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) { setError('Please enter both email and password'); return; }
    if (loginData.password.length < 4) { setError('Password must be at least 4 characters'); return; }

    const s: Student = {
      name: loginData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: loginData.email,
      course: 'Clinical SAS',
      enrollDate: 'Jan 2026',
      progress: 65,
    };
    setPendingStudent(s);
    setView('verify');
    setOtp(['', '', '', '', '', '']);
    await sendOtp(s);
  };

  // ─── Register → also triggers OTP ───────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.course) {
      setError('Please fill in all fields'); return;
    }
    const s: Student = {
      name: registerData.name, email: registerData.email,
      course: registerData.course, enrollDate: 'Jan 2026', progress: 0,
    };
    setPendingStudent(s);
    setView('verify');
    setOtp(['', '', '', '', '', '']);
    await sendOtp(s);
  };

  // ─── Verify OTP → grants dashboard access ───────────────────────────
  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length !== 6) { setVerifyError('Please enter all 6 digits'); return; }
    if (entered !== generatedOtp) { setVerifyError('Invalid code. Please try again.'); return; }
    if (!pendingStudent) return;

    setStudent(pendingStudent);
    setPendingStudent(null);
    setView('dashboard');
    setSection('overview');
    setOtp(['', '', '', '', '', '']);
    setVerifyError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setVerifyError('');
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleLogout = () => {
    setStudent(null);
    setPendingStudent(null);
    setLoginData({ email: '', password: '' });
    setView('login');
  };

  const goBackToLogin = () => {
    setPendingStudent(null);
    setOtp(['', '', '', '', '', '']);
    setVerifyError('');
    setView('login');
  };

  if (!open) return null;

  const sidebarItems: { id: Section; label: string; icon: any; badge?: string }[] = [
    { id: 'overview',     label: 'Overview',         icon: BarChart3 },
    { id: 'courses',      label: 'My Courses',       icon: BookOpen },
    { id: 'assignments',  label: 'Assignments',      icon: ClipboardCheck, badge: '3' },
    { id: 'classes',      label: 'Live Classes',     icon: Video, badge: 'LIVE' },
    { id: 'materials',    label: 'Course Materials', icon: FileText },
    { id: 'chat',         label: 'Course Support',   icon: MessageSquare, badge: '2' },
    { id: 'jobs',         label: 'Placements',       icon: Briefcase },
    { id: 'certificates', label: 'Certificates',     icon: Award },
    { id: 'payments',     label: 'Payments',         icon: CreditCard },
    { id: 'profile',      label: 'Profile',          icon: Settings },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 22 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl h-[95vh] overflow-hidden relative flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <X size={18} className="text-gray-600" />
          </button>

          {/* ── LOGIN VIEW ── */}
          {view === 'login' && (
            <div className="grid md:grid-cols-2 h-full overflow-y-auto">
              <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="flex items-center rounded-3xl">
                  <Logo />
                  <div className="text-2xl font-extrabold tracking-tight">
                    SKILL<span className="text-yellow-300">L</span>ITIQ<span className="text-amber-300">AI</span>
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold mt-6 mb-3">Welcome Back!</h2>
                <p className="text-white/90 leading-relaxed mb-8">Login to access your courses, assignments, certificates, course support, and placement opportunities.</p>
                <div className="space-y-3">
                  {[{i:BookOpen,t:'7+ industry-aligned courses'},{i:Video,t:'Live + recorded classes'},{i:Award,t:'Verifiable certificates'},{i:Briefcase,t:'300+ hiring partners'}].map(item => (
                    <div key={item.t} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><item.i size={16} /></div>{item.t}
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-xl text-xs leading-relaxed">
                  <ShieldCheck size={16} className="inline mr-1.5" />
                  <strong>Two-step secure login</strong> — Every login requires a verification code sent to our admin email.
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="md:hidden mb-6 text-center text-2xl font-extrabold tracking-tight text-gray-900">
                  SKILL<span className="text-purple-600">L</span><span className="text-blue-600">ITIQ</span><span className="text-amber-500">AI</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h3>
                <p className="text-gray-500 text-sm mb-8">Enter your credentials to continue</p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <Field icon={Mail} type="email" placeholder="student@example.com" label="Email Address" value={loginData.email} onChange={(v: string) => setLoginData({ ...loginData, email: v })} />
                  <Field icon={Lock} type="password" placeholder="••••••••" label="Password" value={loginData.password} onChange={(v: string) => setLoginData({ ...loginData, password: v })} />
                  {error && <ErrorMsg msg={error} />}
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer"><input type="checkbox" className="rounded" /> Remember me</label>
                    <a href="#" className="text-blue-600 hover:underline font-medium">Forgot password?</a>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2">
                    Continue <ChevronRight size={18} />
                  </button>
                  <div className="text-center text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3 leading-relaxed">
                    <ShieldCheck size={14} className="inline text-blue-600 mr-1" />
                    For your security, an access code will be sent to <strong>{EMAILJS_CONFIG.TO_EMAIL}</strong> after you continue.
                  </div>
                  <p className="text-center text-sm text-gray-500">New student?{' '}
                    <button type="button" onClick={() => { setView('register'); setError(''); }} className="text-blue-600 hover:underline font-semibold">Create an account</button>
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* ── REGISTER VIEW ── */}
          {view === 'register' && (
            <div className="grid md:grid-cols-2 h-full overflow-y-auto">
              <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white">
                <div className="flex items-center gap-3">
                  <Logo size={56} />
                  <div className="text-2xl font-extrabold tracking-tight">
                    SKILL<span className="text-yellow-300">L</span>ITIQ<span className="text-amber-300">AI</span>
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold mt-6 mb-3">Join SKILLITIQ</h2>
                <p className="text-white/90 leading-relaxed mb-8">Create your free account and start your journey toward a successful career in clinical research.</p>
                <div className="space-y-3">
                  {['100% Placement Assistance','Live Expert Sessions','Industry-Aligned Curriculum','Lifetime Course Access'].map(t => (
                    <div key={t} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</div>{t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-500 text-sm mb-8">Sign up to start learning</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <Field icon={User} type="text" placeholder="John Doe" label="Full Name" value={registerData.name} onChange={(v: string) => setRegisterData({ ...registerData, name: v })} />
                  <Field icon={Mail} type="email" placeholder="you@example.com" label="Email" value={registerData.email} onChange={(v: string) => setRegisterData({ ...registerData, email: v })} />
                  <Field icon={Lock} type="password" placeholder="Min 4 characters" label="Password" value={registerData.password} onChange={(v: string) => setRegisterData({ ...registerData, password: v })} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course of Interest</label>
                    <select value={registerData.course} onChange={e => setRegisterData({ ...registerData, course: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
                      <option value="">Select a course</option>
                      <option>Clinical SAS</option><option>R Language</option><option>CDM (Clinical Data Management)</option>
                      <option>Clinical Research</option><option>Pharmacovigilance</option><option>Medical Coding</option><option>Regulatory Affairs</option>
                    </select>
                  </div>
                  {error && <ErrorMsg msg={error} />}
                  <button type="submit" className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-700 transition shadow-md">Continue →</button>
                  <p className="text-center text-sm text-gray-500">Already have an account?{' '}
                    <button type="button" onClick={() => { setView('login'); setError(''); }} className="text-blue-600 hover:underline font-semibold">Sign in</button>
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* ── VERIFY VIEW (OTP entry) ── */}
          {view === 'verify' && pendingStudent && (
            <div className="flex items-center justify-center h-full overflow-y-auto p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <button onClick={goBackToLogin} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft size={14} /> Back to login
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                  >
                    {sending ? (
                      <svg className="animate-spin text-white h-7 w-7" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <ShieldCheck className="text-white" size={28} />
                    )}
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                    {sending ? 'Sending code...' : 'Enter Access Code'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {sending
                      ? 'We are sending your access code'
                      : 'A 6-digit access code has been sent to'}
                  </p>
                  <p className="text-sm font-bold text-blue-700 mb-4 break-all">{EMAILJS_CONFIG.TO_EMAIL}</p>
                  <p className="text-xs text-gray-500 mb-5">
                    Login attempt for: <strong className="text-gray-700">{pendingStudent.email}</strong>
                  </p>

                  {/* Demo helper – only when EmailJS not configured */}
                  {!sending && EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' && generatedOtp && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg py-2 px-3 mb-4">
                      <strong>⚠️ Demo mode:</strong> Your code is{' '}
                      <span className="font-mono font-bold text-base">{generatedOtp}</span>
                      <div className="mt-1 text-[10px]">Configure EmailJS in StudentPortal.tsx to send real emails.</div>
                    </div>
                  )}
                  {!sending && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg py-2 px-3 mb-4">
                      ✅ Code sent successfully. Please check the inbox at <strong>{EMAILJS_CONFIG.TO_EMAIL}</strong>.
                    </div>
                  )}

                  {/* OTP inputs */}
                  <div className="flex justify-center gap-2 mb-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={sending}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition disabled:bg-gray-100"
                      />
                    ))}
                  </div>

                  {verifyError && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg py-2 px-3 mb-3 flex items-center justify-center gap-1.5">
                      <AlertCircle size={12} /> {verifyError}
                    </div>
                  )}

                  <button onClick={verifyOtp} disabled={sending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold mb-3 transition shadow-md flex items-center justify-center gap-2">
                    Verify & Login <ChevronRight size={16} />
                  </button>

                  <div className="text-xs text-gray-500">
                    Didn't get the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-gray-400">Resend in {resendTimer}s</span>
                    ) : (
                      <button onClick={() => sendOtp(pendingStudent)} disabled={sending} className="text-blue-600 hover:underline font-bold disabled:text-gray-400">
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── DASHBOARD VIEW ── */}
          {view === 'dashboard' && student && (
            <div className="flex flex-col md:flex-row h-full">
              <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col">
                <div className="p-5 border-b border-gray-800 flex items-center gap-3">
                  <Logo size={36} />
                  <div>
                    <div className="text-sm font-extrabold text-white tracking-tight">
                      SKILL<span className="text-purple-400">L</span><span className="text-blue-400">ITIQ</span><span className="text-amber-400">AI</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">Student Portal</div>
                  </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {sidebarItems.map(item => {
                    const active = section === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSection(item.id)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                          active ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={16} />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'
                          }`}>{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-semibold text-sm hover:bg-red-500/20 transition">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </aside>

              <main className="flex-1 flex flex-col overflow-hidden">
                <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Hi, {student.name.split(' ')[0]} 👋</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
                    <ShieldCheck size={14} /> Verified Login
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-gray-50">
                  {section === 'overview'     && <Overview student={student} />}
                  {section === 'courses'      && <CoursesSection student={student} />}
                  {section === 'assignments'  && <Assignments />}
                  {section === 'classes'      && <Classes />}
                  {section === 'materials'    && <Materials />}
                  {section === 'chat'         && <Chat />}
                  {section === 'jobs'         && <Jobs />}
                  {section === 'certificates' && <Certificates student={student} />}
                  {section === 'payments'     && <Payments />}
                  {section === 'profile'      && <Profile student={student} />}
                </div>
              </main>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ───────────────────────── Helpers ───────────────────────── */
function Field({ icon: Icon, label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input {...props} value={props.value} onChange={e => props.onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>
    </div>
  );
}
function ErrorMsg({ msg }: { msg: string }) {
  return <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"><AlertCircle size={14} />{msg}</div>;
}

/* ───────────────────────── Section Components ───────────────────────── */

function Overview({ student }: { student: Student }) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900">Dashboard Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Course', val: student.course.length > 14 ? student.course.slice(0,14) + '…' : student.course, color: 'bg-blue-100 text-blue-700' },
          { icon: Calendar, label: 'Enrolled Since', val: student.enrollDate, color: 'bg-purple-100 text-purple-700' },
          { icon: TrendingUp, label: 'Progress', val: `${student.progress}%`, color: 'bg-green-100 text-green-700' },
          { icon: Award, label: 'Certificates', val: '2', color: 'bg-orange-100 text-orange-700' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={20} /></div>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="font-bold text-gray-900 text-sm">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{student.course}</h3>
            <p className="text-sm text-gray-600 mt-1">Module 5 of 8 — Risk Management Plans (RMP) & REMS</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2">
            <Play size={14} /> Resume
          </button>
        </div>
        <div className="bg-white/70 rounded-full h-3 overflow-hidden mb-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${student.progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
        </div>
        <div className="text-xs text-gray-500">{student.progress}% complete · 3 modules remaining</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Recent Activity" icon={TrendingUp} color="text-blue-600">
          {[
            { txt: 'Completed "Module 4 Quiz" with 92%', time: '2h ago', icon: '✅' },
            { txt: 'Submitted "Adverse Event Report" assignment', time: '1d ago', icon: '📝' },
            { txt: 'Joined live class on MedDRA Coding', time: '2d ago', icon: '🎥' },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800">{a.txt}</div>
                <div className="text-xs text-gray-500 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card title="Performance" icon={BarChart3} color="text-purple-600">
          {[
            { label: 'Overall Score', val: 87, color: 'bg-green-500' },
            { label: 'Attendance', val: 94, color: 'bg-blue-500' },
            { label: 'Assignments', val: 78, color: 'bg-orange-500' },
            { label: 'Quiz Avg', val: 89, color: 'bg-purple-500' },
          ].map(p => (
            <div key={p.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 font-medium">{p.label}</span>
                <span className="font-bold text-gray-900">{p.val}%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.val}%` }} transition={{ duration: 1 }} className={`h-full ${p.color} rounded-full`} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function CoursesSection({ student }: { student: Student }) {
  const courses = [
    { title: student.course, progress: student.progress, status: 'Active', modules: 8, color: 'from-blue-500 to-purple-500' },
    { title: 'Pharmacovigilance', progress: 100, status: 'Completed', modules: 6, color: 'from-green-500 to-emerald-500' },
    { title: 'Medical Coding', progress: 25, status: 'Active', modules: 5, color: 'from-pink-500 to-rose-500' },
  ];
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900">My Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(c => (
          <div key={c.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className={`bg-gradient-to-br ${c.color} h-24 flex items-center justify-center text-white`}><BookOpen size={32} /></div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900">{c.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{c.status}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{c.modules} modules · {c.progress}% complete</p>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                <div className={`h-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.progress}%` }} />
              </div>
              <button className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-100 transition text-sm">Continue Learning →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Assignments() {
  const items = [
    { title: 'Adverse Event Case Processing', due: 'Today, 11:59 PM', status: 'pending', score: null },
    { title: 'MedDRA Coding Practical', due: 'Jan 27, 2026', status: 'pending', score: null },
    { title: 'Signal Detection Quiz', due: 'Jan 30, 2026', status: 'in-progress', score: null },
    { title: 'Drug Safety Module 3 Test', due: 'Jan 18, 2026', status: 'submitted', score: 92 },
    { title: 'Risk Management Essay', due: 'Jan 15, 2026', status: 'graded', score: 88 },
  ];
  const colors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700', 'in-progress': 'bg-blue-100 text-blue-700',
    submitted: 'bg-purple-100 text-purple-700', graded: 'bg-green-100 text-green-700',
  };
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Assignments & Quizzes</h2>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {items.map(it => (
          <div key={it.title} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><ClipboardCheck size={18} className="text-blue-600" /></div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{it.title}</div>
                <div className="text-xs text-gray-500">Due: {it.due}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {it.score !== null && <span className="text-sm font-bold text-gray-900">{it.score}/100</span>}
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${colors[it.status]}`}>{it.status.replace('-', ' ')}</span>
              <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">Open <ChevronRight size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Classes() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Live Classes</h2>
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <div>
            <div className="text-sm uppercase font-bold opacity-90">Live Now</div>
            <div className="text-xl font-extrabold">Signal Detection Workshop</div>
            <div className="text-sm opacity-90 mt-1">47 students attending</div>
          </div>
        </div>
        <button className="bg-white text-red-600 font-extrabold px-6 py-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
          <Video size={18} /> Join Now
        </button>
      </div>
      <h3 className="text-sm font-bold text-gray-700 mt-6">Upcoming Classes</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { date: 'Tomorrow', time: '6:30 PM', topic: 'MedDRA Coding Practice', dur: '90 min' },
          { date: 'Fri, Jan 24', time: '7:00 PM', topic: 'Mock Interview Session', dur: '60 min' },
          { date: 'Mon, Jan 27', time: '7:00 PM', topic: 'PSUR Report Writing', dur: '90 min' },
          { date: 'Wed, Jan 29', time: '6:00 PM', topic: 'Argus Software Training', dur: '120 min' },
        ].map((c, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex flex-col items-center justify-center text-xs font-bold">
              {c.date.split(',')[0]}<span className="text-[10px] font-medium">{c.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{c.topic}</div>
              <div className="text-xs text-gray-500">Live · {c.dur}</div>
            </div>
            <button className="text-blue-600 hover:underline text-sm font-bold">Reminder</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Materials() {
  const files = [
    { name: 'Module 5 - RMP Notes.pdf', size: '2.4 MB', cat: 'Notes' },
    { name: 'PSUR Template.docx', size: '850 KB', cat: 'Templates' },
    { name: 'Argus Software Setup.pdf', size: '1.2 MB', cat: 'Software' },
    { name: 'Case Study Pack.zip', size: '5.6 MB', cat: 'Cases' },
    { name: 'MedDRA Coding Manual.pdf', size: '3.1 MB', cat: 'Reference' },
    { name: 'Module 4 Recording.mp4', size: '120 MB', cat: 'Video' },
    { name: 'CDISC Standards Guide.pdf', size: '4.2 MB', cat: 'Reference' },
    { name: 'Sample ICSR Reports.zip', size: '8.4 MB', cat: 'Cases' },
  ];
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Course Materials</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {files.map((f, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><FileText size={18} className="text-purple-600" /></div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{f.name}</div>
                <div className="text-xs text-gray-500">{f.cat} · {f.size}</div>
              </div>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download"><Download size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  const [msg, setMsg] = useState('');
  const messages = [
    { from: 'support', text: 'Hi! Your last assignment was reviewed. Excellent work on the case narrative! 🎉', time: '10:24 AM' },
    { from: 'me', text: 'Thank you! Could you suggest reading material for Signal Detection?', time: '10:30 AM' },
    { from: 'support', text: 'Sure! 3 PDFs have been shared in the Materials section. The next live class will also cover this in detail.', time: '10:32 AM' },
    { from: 'me', text: 'Perfect, will join the class at 7 PM. Thanks!', time: '10:33 AM' },
  ];
  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Course Support</h2>
      <div className="bg-white border border-gray-200 rounded-2xl flex-1 flex flex-col overflow-hidden max-h-[500px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold">
            <MessageSquare size={18} />
          </div>
          <div>
            <div className="font-bold text-sm">SKILLITIQ Support</div>
            <div className="text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" />Online</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 rounded-bl-sm'}`}>
                <div>{m.text}</div>
                <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-sm" />
          <button onClick={() => setMsg('')} className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function Jobs() {
  const jobs = [
    { co: 'IQVIA', role: 'PV Associate', loc: 'Bangalore', salary: '4-6 LPA', status: 'Apply', match: 95 },
    { co: 'Parexel', role: 'Drug Safety Specialist', loc: 'Hyderabad', salary: '5-7 LPA', status: 'Applied', match: 88 },
    { co: 'Syneos Health', role: 'Clinical SAS Programmer', loc: 'Mumbai', salary: '6-9 LPA', status: 'Interview', match: 82 },
    { co: 'Cognizant', role: 'Pharmacovigilance Analyst', loc: 'Pune', salary: '4-5 LPA', status: 'Apply', match: 90 },
  ];
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Placement Opportunities</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((j, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-lg text-gray-900">{j.role}</div>
                <div className="text-sm text-blue-600 font-semibold">{j.co}</div>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">{j.match}% match</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
              <span>📍 {j.loc}</span>
              <span>💰 {j.salary}</span>
            </div>
            <button className={`w-full font-bold py-2 rounded-lg transition text-sm ${
              j.status === 'Apply' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              j.status === 'Applied' ? 'bg-purple-100 text-purple-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {j.status === 'Apply' ? 'Apply Now →' : j.status === 'Applied' ? '✓ Applied' : '🎯 Interview Scheduled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Certificates({ student }: { student: Student }) {
  const certs = [
    { title: 'Pharmacovigilance Foundation', date: 'Dec 2025', id: 'SKL-PV-2025-1234' },
    { title: 'MedDRA Coding Specialist', date: 'Nov 2025', id: 'SKL-MED-2025-5678' },
  ];
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">My Certificates</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {certs.map((c, i) => (
          <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border-2 border-amber-200 relative overflow-hidden">
            <Award className="absolute -top-4 -right-4 text-amber-200" size={120} />
            <div className="relative">
              <div className="text-xs uppercase font-bold text-amber-700 tracking-widest">Certificate of Completion</div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2">{c.title}</h3>
              <p className="text-sm text-gray-700 mt-1">Awarded to <span className="font-bold">{student.name}</span></p>
              <p className="text-xs text-gray-500 mt-3">Issued: {c.date} · ID: {c.id}</p>
              <div className="flex gap-2 mt-4">
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Download size={12} /> Download</button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold">Share</button>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
          <Award className="text-gray-300 mb-2" size={40} />
          <div className="text-sm font-bold text-gray-700">{student.course} Certificate</div>
          <div className="text-xs text-gray-500 mt-1">Complete the course to unlock</div>
          <div className="mt-3 w-full max-w-[160px] bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{student.progress}% complete</div>
        </div>
      </div>
    </div>
  );
}

function Payments() {
  const txns = [
    { date: 'Jan 5, 2026', desc: 'Clinical SAS - Full Course', amount: 35000, status: 'Paid', method: 'UPI' },
    { date: 'Dec 12, 2025', desc: 'Pharmacovigilance Course', amount: 28000, status: 'Paid', method: 'Card' },
    { date: 'Nov 1, 2025', desc: 'Medical Coding - Installment 2', amount: 15000, status: 'Paid', method: 'Net Banking' },
    { date: 'Oct 1, 2025', desc: 'Medical Coding - Installment 1', amount: 15000, status: 'Paid', method: 'UPI' },
  ];
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Payment History</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl">
          <CreditCard size={20} className="mb-2" />
          <div className="text-xs uppercase opacity-90">Total Paid</div>
          <div className="text-2xl font-extrabold mt-1">₹93,000</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <CheckCircle2 size={20} className="text-blue-600 mb-2" />
          <div className="text-xs uppercase text-gray-500">Successful</div>
          <div className="text-2xl font-extrabold mt-1">4</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <AlertCircle size={20} className="text-orange-500 mb-2" />
          <div className="text-xs uppercase text-gray-500">Pending</div>
          <div className="text-2xl font-extrabold mt-1">0</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-bold text-sm">Recent Transactions</div>
        {txns.map((t, i) => (
          <div key={i} className="flex flex-wrap justify-between items-center gap-2 p-4 border-b border-gray-50 hover:bg-gray-50">
            <div>
              <div className="font-semibold text-sm text-gray-900">{t.desc}</div>
              <div className="text-xs text-gray-500">{t.date} · {t.method}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900">₹{t.amount.toLocaleString()}</span>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">{t.status}</span>
              <button className="text-blue-600 hover:underline text-xs font-bold">Invoice</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ student }: { student: Student }) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-extrabold text-gray-900">Profile Settings</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
            <button className="mt-2 text-xs font-bold text-blue-600 hover:underline">Change Photo</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', val: student.name },
            { label: 'Email', val: student.email },
            { label: 'Phone', val: '+91 98765 43210' },
            { label: 'Course', val: student.course },
            { label: 'Enrolled Since', val: student.enrollDate },
            { label: 'Member ID', val: 'SKL-2026-0042' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{f.label}</label>
              <input defaultValue={f.val} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700">Save Changes</button>
          <button className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, color, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className={`font-bold text-gray-900 mb-4 flex items-center gap-2`}>
        <Icon size={18} className={color} /> {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
