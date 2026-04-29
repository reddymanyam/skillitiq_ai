import { useState, useEffect, useRef } from 'react';
import {
  Users, Award, X, Clock, Star, ChevronRight, CheckCircle,
  Monitor, Building2, Wifi, Laptop, GraduationCap, TrendingUp,
  Handshake, BarChart2, Phone, Mail, MapPin, Menu, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentPortal from './components/StudentPortal';
import Logo from './components/Logo';

// ─── SKILLITIQ Official Social Links ─────────────────────────────────
const SOCIAL_LINKS = {
  website:   'https://www.skillitiq.com',
  linkedin:  'https://www.linkedin.com/company/skillitiq',
  instagram: 'https://www.instagram.com/skillitiq',
  facebook:  'https://www.facebook.com/skillitiq',
  whatsapp:  'https://wa.me/917995134506',
  youtube:   'https://www.youtube.com/@skillitiq',
  twitter:   'https://twitter.com/skillitiq',
};

interface Course {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  students: number;
  rating: string;
  level: string;
  color: string;
  bgColor: string;
  modules: string[];
  features: string[];
  badge?: string;
  image: string;
  emoji: string;
  iconBg: string;
}

const courses: Course[] = [
  {
    id: 1, title: 'Clinical SAS', shortTitle: 'Clinical SAS', badge: 'HIGH DEMAND',
    description: 'Master SAS programming for clinical trial data analysis, TLF generation, and CDISC standards.',
    duration: '12 Weeks', students: 3500, rating: '4.9', level: 'Beginner to Advanced',
    color: 'bg-blue-600', bgColor: 'bg-blue-50', emoji: '📊', iconBg: 'bg-blue-100',
    image: '/images/course-clinical-sas.jpg',
    modules: ['Introduction to SAS & Base SAS', 'Data Manipulation & Analysis', 'TLF Generation', 'CDISC Standards (SDTM & ADaM)', 'Macro Programming', 'Clinical Trial Reporting', 'Regulatory Submissions'],
    features: ['Hands-on Projects', 'Job Referrals', 'Industry Software Training', 'Placement Assistance', 'Live Sessions', 'Certification']
  },
  {
    id: 2, title: 'R Language', shortTitle: 'R Language',
    description: 'Advanced statistical analysis using R programming for clinical data and bio-statistics.',
    duration: '8 Weeks', students: 1200, rating: '4.7', level: 'Intermediate',
    color: 'bg-indigo-600', bgColor: 'bg-indigo-50', emoji: '📈', iconBg: 'bg-indigo-100',
    image: '/images/course-r-language.jpg',
    modules: ['R Fundamentals & Environment', 'Data Visualization with ggplot2', 'Statistical Modeling', 'Bio-statistics Applications', 'Clinical Data Analysis', 'Shiny Dashboards'],
    features: ['Industry Case Studies', 'Resume Building', 'Mock Interviews', 'Lifetime Access', 'Live Doubt Sessions']
  },
  {
    id: 3, title: 'CDM (Clinical Data Management)', shortTitle: 'CDM', badge: 'FLAGSHIP',
    description: 'Build expertise in EDC systems, database design, data validation, and CDISC compliance.',
    duration: '10 Weeks', students: 2100, rating: '4.8', level: 'Beginner to Advanced',
    color: 'bg-purple-600', bgColor: 'bg-purple-50', emoji: '🗄️', iconBg: 'bg-purple-100',
    image: '/images/course-cdm.jpg',
    modules: ['EDC Systems Overview', 'Database Design & Build', 'Data Validation & Cleaning', 'CDISC Compliance', 'Clinical Trial Data Flow', 'Query Management', 'Career Preparation'],
    features: ['EDC Tool Training', 'Mock Interviews', 'Real-world Projects', 'Certification Support', 'Placement Assistance']
  },
  {
    id: 4, title: 'Clinical Research', shortTitle: 'Clinical Research',
    description: 'Master clinical trial design, GCP guidelines, site management, and regulatory compliance.',
    duration: '12 Weeks', students: 2800, rating: '4.8', level: 'Beginner to Advanced',
    color: 'bg-emerald-600', bgColor: 'bg-emerald-50', emoji: '🧪', iconBg: 'bg-emerald-100',
    image: '/images/course-clinical-research.jpg',
    modules: ['GCP Guidelines', 'Site Management', 'Clinical Trial Design', 'Regulatory Compliance', 'Patient Safety Monitoring', 'Project Management', 'Audit & Inspection Readiness'],
    features: ['Expert Led Sessions', 'Placement Support', 'Live Interactive Classes', 'Project Work', 'Industry Network Access']
  },
  {
    id: 5, title: 'Pharmacovigilance', shortTitle: 'Pharmacovigilance', badge: 'MOST POPULAR',
    description: 'Master drug safety operations, adverse event reporting, signal detection, and risk management.',
    duration: '10 Weeks', students: 3200, rating: '4.9', level: 'Beginner to Advanced',
    color: 'bg-red-600', bgColor: 'bg-red-50', emoji: '💊', iconBg: 'bg-red-100',
    image: '/images/course-pharmacovigilance.jpg',
    modules: [
      'Introduction to Pharmacovigilance & Drug Safety',
      'Adverse Event Case Processing & Narrative Writing',
      'Medical Coding with MedDRA & WHO-DRUG',
      'Signal Detection & Data Mining Methods',
      'Risk Management Plans (RMP) & REMS',
      'Periodic Safety Update Reports (PSUR/PBRER)',
      'Global Regulatory Requirements (FDA, EMA, ICH)',
      'PV Systems, Databases & Career Preparation'
    ],
    features: [
      'Hands-on Case Processing with Real Data',
      'Signal Detection Workshops',
      'Mock Interviews & Resume Building',
      'Live Interactive Sessions with Experts',
      'MedDRA & WHO-DRUG Coding Practice',
      'Industry Software Training (Argus, ARISg)',
      'Placement Assistance & Job Referrals',
      'Lifetime Access to Course Materials'
    ]
  },
  {
    id: 6, title: 'Medical Coding', shortTitle: 'Medical Coding',
    description: 'Specialize in ICD-10-CM, CPT, HCPCS coding and healthcare documentation for industry readiness.',
    duration: '8 Weeks', students: 2600, rating: '4.7', level: 'Beginner to Intermediate',
    color: 'bg-pink-600', bgColor: 'bg-pink-50', emoji: '🏥', iconBg: 'bg-pink-100',
    image: '/images/course-medical-coding.jpg',
    modules: ['ICD-10-CM Coding', 'CPT Coding', 'HCPCS Level II', 'Medical Terminology', 'Healthcare Documentation', 'Compliance & Auditing'],
    features: ['Certification Support', 'Lab Access', 'Real Data Practice', 'Career Coaching', 'Mock Tests']
  },
  {
    id: 7, title: 'Regulatory Affairs', shortTitle: 'Regulatory Affairs',
    description: 'Learn drug registration, dossier preparation, and compliance with global regulatory bodies.',
    duration: '10 Weeks', students: 1800, rating: '4.8', level: 'Beginner to Advanced',
    color: 'bg-orange-600', bgColor: 'bg-orange-50', emoji: '📋', iconBg: 'bg-orange-100',
    image: '/images/course-regulatory-affairs.jpg',
    modules: ['Drug Registration Process', 'Dossier Preparation (CTD/eCTD)', 'Global Compliance', 'FDA & EMA Guidelines', 'ICH Guidelines', 'Regulatory Strategy', 'Career Preparation'],
    features: ['Industry Experts', 'Live Classes', 'Real Case Studies', 'Placement Support', 'Certification']
  },
];

const companies = [
  'Advance Clinical', 'Hetero', 'Sun Pharma', 'IQVIA', 'Parexel', 'Syneos Health',
  'Infosys BPM', 'Clario', 'WNS', 'Genpact', 'Labcorp Drug Dev.', 'Johnson & Johnson',
  'Eli Lilly', 'Biocon', "Dr. Reddy's", 'Cipla', 'Novartis', 'Pfizer',
  'R1 Healthcare', 'Premier Research', 'Sensan Bioscience', 'Syngene', 'Gebbs', 'Orixon', 'Avontix'
];

const quickLinkContent = {
  about: {
    title: 'About Us',
    subtitle: 'Advanced clinical skills training built for real healthcare and pharma careers.',
    sections: [
      {
        heading: 'Who We Are',
        body: 'SKILLITIQ is a clinical skills training platform focused on practical, job-ready learning across Clinical SAS, R Language, CDM, Clinical Research, Pharmacovigilance, Medical Coding, and Regulatory Affairs.',
        bullets: ['Industry-aligned curriculum', 'Hands-on software exposure', 'Placement-focused learning flow', 'Career support from training to interview readiness'],
      },
      {
        heading: 'Student Reference Notes',
        body: 'Students are guided with structured modules, live practice tasks, case-study based assignments, resume preparation, and interview readiness checkpoints.',
        bullets: ['Weekly learning milestones', 'Project documentation support', 'Mock interview checkpoints', 'Course completion certification'],
      },
    ],
  },
  blogs: {
    title: 'Blogs',
    subtitle: 'Career guidance and domain insights for clinical research learners.',
    sections: [
      {
        heading: 'Popular Blog Topics',
        body: 'Our blog section is designed to help students understand career paths, job roles, tools, and real-world industry workflows before entering the clinical research field.',
        bullets: ['How to start a career in Clinical Research', 'Clinical SAS vs R Language for pharma analytics', 'Pharmacovigilance job roles and interview preparation', 'CDM tools, EDC workflows, and query management'],
      },
      {
        heading: 'Advanced Student Reference',
        body: 'Every article is planned around practical decision-making: what to learn, how to practice, which tools matter, and how to prepare for placement interviews.',
        bullets: ['Beginner-to-advanced learning roadmaps', 'Tool-based learning recommendations', 'Resume keyword guidance', 'Interview scenario examples'],
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    subtitle: 'Transparent student-first refund guidelines for course enrolments.',
    sections: [
      {
        heading: 'Refund Eligibility',
        body: 'Refund requests are reviewed based on enrolment date, batch commencement, class access, learning material access, and administrative processing status.',
        bullets: ['Request must be raised through official email', 'Refund approval depends on course access status', 'Administrative charges may apply', 'Processed refunds are sent to the original payment mode'],
      },
      {
        heading: 'Non-Refundable Cases',
        body: 'Refunds may not apply after significant course access, downloadable material usage, batch transfer confirmation, or certification processing.',
        bullets: ['Recorded content accessed', 'Course materials downloaded', 'Batch change already processed', 'Certificate issued or assessment completed'],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, protect, and manage student information.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We collect only the information needed for enrolment, course access, learning support, placement assistance, and communication.',
        bullets: ['Name, email, phone, and course interest', 'Learning progress and assessment status', 'Placement preference and resume details', 'Payment and invoice information when applicable'],
      },
      {
        heading: 'How We Use Data',
        body: 'Student data is used strictly for training delivery, support communication, placement tracking, and student account management.',
        bullets: ['Course reminders and schedule updates', 'Placement coordination', 'Certificate validation', 'Support and query resolution'],
      },
    ],
  },
  placement: {
    title: 'Placement Policy',
    subtitle: 'Structured assistance to help students become recruiter-ready.',
    sections: [
      {
        heading: 'Placement Support Scope',
        body: 'Placement assistance includes skill readiness, profile grooming, interview preparation, and opportunity sharing with hiring networks.',
        bullets: ['Resume and LinkedIn optimization', 'Mock interviews and feedback', 'Job referral support', 'Interview scheduling assistance when eligible'],
      },
      {
        heading: 'Student Responsibilities',
        body: 'Placement success depends on attendance, assessment performance, project completion, communication discipline, and interview readiness.',
        bullets: ['Maintain attendance and task completion', 'Complete projects and assessments', 'Keep resume updated', 'Attend scheduled interviews professionally'],
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Reach the SKILLITIQ team for admissions, support, and placement queries.',
    sections: [
      {
        heading: 'Official Contact',
        body: 'For admissions, course counselling, student support, or placement coordination, use the official contact channels below.',
        bullets: ['Email: hr@skillitiq@gmail.com', 'Phone: +91 79951 34506', 'Location: Hyderabad, India', 'Website: www.skillitiq.com'],
      },
      {
        heading: 'Response Timelines',
        body: 'Our team aims to respond to course enquiries and student support requests within one working day.',
        bullets: ['Admissions query: within 24 hours', 'Student support: same or next working day', 'Placement support: based on active drive schedule', 'Urgent query: WhatsApp or call preferred'],
      },
    ],
  },
} as const;

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const tick = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(p * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatCard({ icon: Icon, end, suffix, label }: { icon: React.ElementType; end: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="bg-white p-6 rounded-2xl text-center border border-gray-200 shadow-sm hover:shadow-md transition">
      <Icon className="mx-auto mb-3 text-blue-600" size={30} />
      <div className="text-3xl font-extrabold text-gray-900">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

// ─── Course Student Counter (per-card) ────────────────────────────────────────
function CourseStudentCount({ count }: { count: number }) {
  const { count: animated, ref } = useCountUp(count, 1500);
  return (
    <span ref={ref} className="flex items-center gap-1">
      <Users size={14} />{animated.toLocaleString()}
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [activeQuickLink, setActiveQuickLink] = useState<keyof typeof quickLinkContent | null>(null);

  const navLinks = [
    { name: 'Home',      link: '#home' },
    { name: 'About',     link: '#about' },
    { name: 'Courses',   link: '#courses' },
    { name: 'Services',  link: '#services' },
    { name: 'Companies', link: '#companies' },
    { name: 'Placement', link: '#placement' },
    { name: 'Contact',   link: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 group select-none">
          <Logo size={50} />
          <div>
            <p className="text-xl font-extrabold tracking-tight leading-none">
              <span className="text-gray-900">SKILL</span><span className="text-purple-600">L</span><span className="text-blue-600">ITIQ</span><span className="text-amber-500">AI</span>
            </p>
            <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-0.5 font-medium">IGNITE CLINICAL SKILLS</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          {navLinks.map(item => (
            <a
              key={item.name}
              href={item.link}
              className="relative py-1 hover:text-blue-600 transition after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setPortalOpen(true)}
            className="text-green-600 border-2 border-green-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-500 hover:text-white transition"
          >
            Student Login
          </button>
          <a
            href="#contact"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
          >
            Enquire Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-gray-200 px-8 overflow-hidden"
          >
            {navLinks.map(item => (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100 font-medium"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); setPortalOpen(true); }}
              className="block w-full text-left py-3 text-green-600 font-bold border-b border-gray-100"
            >
              Student Login →
            </button>
            <a href="#contact" className="block py-3 text-blue-600 font-bold">Enquire Now →</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <header id="home" className="py-16 px-8 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] text-gray-900 mb-6">
              Build a Career in<br />
              <span className="text-sky-500">Clinical Research</span><br />
              with Industry<br />
              Experts
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              SKILLITIQ delivers job-ready training in{' '}
              <a href="#course-1" className="text-sky-600 hover:underline">Clinical SAS</a>,{' '}
              <a href="#course-2" className="text-sky-600 hover:underline">R Language</a>,{' '}
              <a href="#course-3" className="text-sky-600 hover:underline">CDM</a>,{' '}
              <a href="#course-4" className="text-sky-600 hover:underline">Clinical Research</a>,{' '}
              <a href="#course-5" className="text-sky-600 hover:underline">Pharmacovigilance</a>,{' '}
              <a href="#course-6" className="text-sky-600 hover:underline">Medical Coding</a>, and{' '}
              <a href="#course-7" className="text-sky-600 hover:underline">Regulatory Affairs</a> — built around real-world pharma industry workflows.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#courses" className="bg-sky-500 text-white px-8 py-3.5 rounded-full font-bold hover:bg-sky-600 transition shadow-lg shadow-sky-200 flex items-center gap-2">
                Explore Courses →
              </a>
              <a href="#contact" className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-3.5 rounded-full font-bold hover:border-sky-300 hover:text-sky-600 transition flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </span>
                Free Demo Session
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center h-[520px] w-full max-w-[520px] mx-auto">

            {/* Outer purple arc – rotating */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[400px] h-[400px]"
              viewBox="0 0 400 400"
            >
              <circle cx="200" cy="200" r="180" fill="none" stroke="#a78bfa" strokeWidth="14" strokeLinecap="round" strokeDasharray="700 432" opacity="0.8" />
            </motion.svg>

            {/* Middle pink arc – rotating opposite */}
            <motion.svg
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[320px] h-[320px]"
              viewBox="0 0 320 320"
            >
              <circle cx="160" cy="160" r="145" fill="none" stroke="#f9a8d4" strokeWidth="10" strokeLinecap="round" strokeDasharray="500 412" opacity="0.6" />
            </motion.svg>

            {/* Inner cyan arc – rotating */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[260px] h-[260px]"
              viewBox="0 0 260 260"
            >
              <circle cx="130" cy="130" r="115" fill="none" stroke="#a5f3fc" strokeWidth="8" strokeLinecap="round" strokeDasharray="400 322" opacity="0.7" />
            </motion.svg>

            {/* Scattered color arcs */}
            <motion.svg
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[440px] h-[440px]"
              viewBox="0 0 440 440"
            >
              <circle cx="220" cy="220" r="200" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" strokeDasharray="180 1078" opacity="0.7" />
              <circle cx="220" cy="220" r="200" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" strokeDasharray="120 1138" strokeDashoffset="-600" opacity="0.5" />
            </motion.svg>

            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[440px] h-[440px]"
              viewBox="0 0 440 440"
            >
              <circle cx="220" cy="220" r="195" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray="100 1126" strokeDashoffset="-300" opacity="0.5" />
              <circle cx="220" cy="220" r="195" fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" strokeDasharray="130 1096" strokeDashoffset="-700" opacity="0.5" />
            </motion.svg>

            {/* Center content */}
            <div className="absolute flex flex-col items-center justify-center z-10">
              <span className="text-4xl mb-2">🧪</span>
              <span className="font-extrabold text-2xl text-gray-900">Clinical Research</span>
              <span className="text-sky-500 font-semibold text-sm mt-1">Training Programs</span>
            </div>

            {/* ── Floating Badges – all clickable ── */}

            {/* SAS Training → #course-1 */}
            <motion.a
              href="#course-1"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, y: -14 }}
              className="absolute -top-2 left-0 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-gray-100 z-20 cursor-pointer hover:border-purple-300 hover:shadow-purple-100 transition-all"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md">SAS</div>
              <div>
                <div className="text-sm font-bold text-gray-900">SAS Training</div>
                <div className="text-[11px] text-gray-500">Live Projects</div>
              </div>
            </motion.a>

            {/* 7+ Courses → #courses */}
            <motion.a
              href="#courses"
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, x: 12 }}
              className="absolute top-8 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-gray-100 z-20 cursor-pointer hover:border-blue-300 hover:shadow-blue-100 transition-all"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Award size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">7+ Courses</div>
                <div className="text-[11px] text-gray-500">Expert-Led</div>
              </div>
            </motion.a>

            {/* 5K+ Learners → #about */}
            <motion.a
              href="#about"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, x: 10 }}
              className="absolute top-1/2 -translate-y-1/4 -right-8 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-gray-100 z-20 cursor-pointer hover:border-sky-300 hover:shadow-sky-100 transition-all"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-sky-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-gray-900">5K+</div>
                <div className="text-[11px] text-gray-500">Learners</div>
              </div>
            </motion.a>

            {/* 85% Placed → #placement */}
            <motion.a
              href="#placement"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, y: 12 }}
              className="absolute bottom-12 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-gray-100 z-20 cursor-pointer hover:border-orange-300 hover:shadow-orange-100 transition-all"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">85% Placed</div>
                <div className="text-[11px] text-gray-500">Track Record</div>
              </div>
            </motion.a>

            {/* 100% Placement → #placement */}
            <motion.a
              href="#placement"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, y: 14 }}
              className="absolute -bottom-2 right-8 bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-gray-100 z-20 cursor-pointer hover:border-green-300 hover:shadow-green-100 transition-all"
            >
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                <CheckCircle className="text-green-600" size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">100% Placement</div>
                <div className="text-[11px] text-gray-500">Assistance</div>
              </div>
            </motion.a>
          </div>
        </div>
      </header>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-8 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <StatCard icon={Users}       end={8500} suffix="+" label="Students Trained" />
          <StatCard icon={BookOpen}    end={7}    suffix=""  label="Courses Offered" />
          <StatCard icon={TrendingUp}  end={85}   suffix="%" label="Placement Rate" />
          <StatCard icon={Handshake}   end={50}   suffix="+" label="Industry Partners" />
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-8 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-blue-100">About Us</span>
          <h2 className="text-4xl font-bold mb-4">Why <span className="text-blue-600">SKILLITIQ</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are a premier clinical skills training institute dedicated to nurturing the next generation of healthcare and clinical research professionals through innovative, technology-driven education.
          </p>
        </div>

        {/* Advantage stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {[
            { val: '8,500+', label: 'Students Trained' },
            { val: '15+',    label: 'Expert Courses' },
            { val: '85%',    label: 'Placement Rate' },
            { val: '50+',    label: 'Industry Partners' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 text-center border border-gray-200 shadow-sm">
              <div className="text-2xl font-extrabold text-blue-600">{s.val}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: 'Mission', icon: '🎯', desc: 'To bridge the gap between academic knowledge and industry requirements by providing practical, hands-on training in clinical research and healthcare domains.' },
            { title: 'Vision',  icon: '💡', desc: 'To become the most trusted clinical skills training platform globally, empowering professionals with cutting-edge knowledge and AI-enhanced learning experiences.' },
            { title: 'Values',  icon: '❤️', desc: 'Integrity, Excellence, Innovation, and Student Success drive everything we do. We believe in transparent education and measurable career outcomes.' },
          ].map(item => (
            <div key={item.title} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Advantage checklist */}
        <div className="mt-16 max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-0.5 rounded-full text-xs font-medium border border-yellow-100">Why Choose Us</span>
          </div>
          <h3 className="text-3xl font-bold mb-2">The SKILLITIQ <span className="text-blue-600">Advantage</span></h3>
          <p className="text-gray-600 mb-6 max-w-xl">Our unique approach combines traditional clinical expertise with cutting-edge AI technology, ensuring you stay ahead in the rapidly evolving healthcare industry.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Industry-expert instructors with 10+ years experience',
              'Hands-on training with real-world case studies',
              'AI-powered personalized learning paths',
              '100% placement assistance & career coaching',
              'Flexible learning schedules for working professionals',
              'Lifetime access to course materials & updates',
              'Globally recognized certifications',
              'Active alumni network & community support',
            ].map(f => (
              <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />{f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 px-8 bg-white">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-blue-100">What We Offer</span>
          <h2 className="text-4xl font-bold mb-4">Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive solutions to support your career growth and industry needs, including:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: GraduationCap, title: 'Professional Training Programs',       desc: 'Structured, industry-aligned curriculum taught by domain experts.' },
            { icon: TrendingUp,    title: 'Dedicated Placement Assistance',        desc: '100% placement support with 300+ hiring partners across India.' },
            { icon: Handshake,     title: 'End-to-End Recruitment Services',       desc: 'Resume building, interview prep, and direct recruiter referrals.' },
            { icon: BarChart2,     title: 'Technical Project Support & Guidance', desc: 'Live project mentorship and portfolio development for job readiness.' },
          ].map(s => (
            <div key={s.title} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition group">
              <s.icon className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h5 className="font-bold text-gray-900 mb-2">{s.title}</h5>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Courses ─────────────────────────────────────────────────────────── */}
      <section id="courses" className="px-8 py-20 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-blue-100">Our Programs</span>
          <h2 className="text-4xl font-bold mb-4">Explore Our <span className="text-blue-600">Courses</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Industry-aligned training programs designed to prepare you for successful careers in clinical research and healthcare.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {courses.map((course, idx) => (
            <motion.div
              id={`course-${course.id}`}
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
              whileHover={{
                y: -8,
                rotateX: idx % 2 === 0 ? 2 : -2,
                rotateY: idx % 3 === 0 ? 1.5 : -1.5,
                scale: 1.02,
              }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-shadow flex flex-col group"
              style={{ perspective: 800 }}
            >
              {/* Image area */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Badge */}
                {course.badge && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className={`absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md ${
                      course.badge === 'MOST POPULAR' ? 'bg-yellow-500' :
                      course.badge === 'HIGH DEMAND' ? 'bg-purple-600' : 'bg-orange-500'
                    }`}
                  >
                    {course.badge}
                  </motion.span>
                )}

                {/* Rating pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-sm shadow">
                  <Star size={12} className="text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-gray-800 text-xs">{course.rating}</span>
                </div>

                {/* Duration + Level bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-white/90 text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <Clock size={12} /> {course.duration}
                  </span>
                  <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className={`w-10 h-10 ${course.iconBg} rounded-xl flex items-center justify-center text-lg shrink-0`}
                  >
                    {course.emoji}
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                </div>

                <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed">{course.description}</p>

                {/* Students counter */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-5 border-t border-gray-100 pt-4">
                  <CourseStudentCount count={course.students} />
                  <span className={`${course.color} text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full`}>{course.shortTitle}</span>
                </div>

                {/* View Details */}
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm p-3.5 rounded-xl transition-colors"
                >
                  View Details <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Placement ───────────────────────────────────────────────────────── */}
      <section id="placement" className="py-20 px-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <div>
            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-blue-100">Placement</span>
            <h2 className="text-4xl font-bold mb-6">Placement-Aligned<br />Delivery Model</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Inspired by top clinical training institutes, the learning flow combines mentor-led sessions, weekly assessments, interview labs and recruiter-ready project documentation.</p>
            <div className="space-y-4">
              {[
                { icon: '🎙️', label: 'Mock interviews' },
                { icon: '📄', label: 'Resume clinic' },
                { icon: '📁', label: 'Portfolio review' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xl font-bold mb-2 text-center">Placement Mentorship Program</h4>
            <p className="text-gray-600 text-sm text-center mb-8">Our structured 3-step placement support ensures you land your dream job</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '01', title: 'Skill Enrichment',  desc: 'Technical training + soft skills + aptitude preparation with industry-standard tools and live projects' },
                { step: '02', title: 'Profile Grooming',  desc: 'Resume building, LinkedIn optimization, mock interviews, portfolio development & professional branding' },
                { step: '03', title: 'Direct Referrals',  desc: 'Interview scheduling with 300+ partner companies, salary negotiation support & career mentoring' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-3">{item.step}</div>
                  <h5 className="font-bold text-sm mb-2">{item.title}</h5>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold mb-6 text-center">Your 4-Step Journey to <span className="text-blue-600">Success</span></h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { step: '01', title: 'Apply',      desc: 'Submit application & take aptitude test' },
                  { step: '02', title: 'Learn',      desc: 'Live classes + AI-powered self-paced modules' },
                  { step: '03', title: 'Practice',   desc: 'Hands-on with industry tools & real datasets' },
                  { step: '04', title: 'Get Placed', desc: 'Mock interviews + direct hiring partner intros' },
                ].map(item => (
                  <div key={item.step} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                    <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm mx-auto mb-2">{item.step}</div>
                    <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modes of Training ───────────────────────────────────────────────── */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Modes of Training</h2>
          <p className="text-gray-600">Choose the learning mode that fits your lifestyle and career goals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Monitor,   title: 'Online Live', desc: 'Interactive live sessions with expert trainers', color: 'bg-blue-500',   features: ['Live Interactive Classes', 'Recorded Backup', 'Real-time Doubt Clearing', 'LMS Access'] },
            { icon: Building2, title: 'Classroom',   desc: 'In-person training at Hyderabad & Bangalore',  color: 'bg-purple-500', features: ['Face-to-Face Learning', 'Lab Access', 'Peer Networking', 'Hands-on Practice'] },
            { icon: Wifi,      title: 'Hybrid',      desc: 'Best of both learning worlds',                  color: 'bg-orange-500', features: ['Flexible Schedule', 'Live + Recorded', 'Weekend Batches', 'Project Work'] },
            { icon: Laptop,    title: 'Self-Paced',  desc: 'Learn at your own pace',                        color: 'bg-green-500',  features: ['24/7 Access', 'Lifetime Content', 'Self Assessment', 'Certificate'] },
          ].map(mode => (
            <div key={mode.title} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className={`w-12 h-12 ${mode.color} rounded-xl flex items-center justify-center mb-4`}>
                <mode.icon className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">{mode.title}</h4>
              <p className="text-gray-500 text-sm mb-4">{mode.desc}</p>
              <ul className="space-y-2">
                {mode.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-600 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hiring Companies ─────────────────────────────────────────────────── */}
      <section id="companies" className="py-14 bg-white overflow-hidden border-y border-gray-200">
        <h4 className="text-center text-gray-500 mb-6 font-semibold tracking-wide uppercase text-sm">Hiring Companies</h4>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

          {/* Two identical groups make the marquee loop without jumping. */}
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map(group => (
              <div key={group} className="flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap">
                {companies.map((c, i) => (
                  <span
                    key={`${group}-${i}-${c}`}
                    className="text-lg font-bold text-gray-400 hover:text-blue-600 transition cursor-default"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-8 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 border border-blue-100">Get In Touch</span>
          <h2 className="text-4xl font-bold mb-4">Contact <span className="text-blue-600">Us</span></h2>
          <p className="text-gray-600 max-w-xl mx-auto">Have questions about our courses? Reach out and our team will get back to you within 24 hours.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-5">
            {[
              { icon: Mail,    label: 'Email',   val: 'hr@skillitiq@gmail.com',  href: 'mailto:hr@skillitiq@gmail.com' },
              { icon: Phone,   label: 'Phone',   val: '+91 79951 34506',     href: 'tel:+917995134506' },
              { icon: MapPin,  label: 'Address', val: 'Hyderabad, India',    href: 'https://maps.google.com/?q=Hyderabad' },
            ].map(item => (
              <a key={item.label} href={item.href} target={item.label === 'Address' ? '_blank' : undefined} rel={item.label === 'Address' ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition">
                  <item.icon size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="font-bold text-gray-900">{item.val}</div>
                </div>
              </a>
            ))}
            
            {/* Social Media Links */}
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-400 mb-3">Follow Us</div>
              <div className="flex gap-3">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-90 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-500 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.99 2.99 0 0 0-2.106-2.117C19.536 3.568 12 3.568 12 3.568s-7.536 0-9.392.501A2.99 2.99 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.99 2.99 0 0 0 2.106 2.117c1.856.501 9.392.501 9.392.501s7.536 0 9.392-.501a2.99 2.99 0 0 0 2.106-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.982 12 9.75 15.568z"/></svg>
                </a>
                <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-black hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on X">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                </a>
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 hover:scale-110 transition text-white shadow-md" title="Chat on WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="john@example.com" className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" placeholder="+91 79951 34506" className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                <select className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea placeholder="Tell us about your requirements..." rows={4} className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full shadow-md">
              Enquire Now →
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="py-14 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={42} />
              <h1 className="text-2xl font-extrabold leading-none">
                <span className="text-white">SKILL</span><span className="text-purple-400">L</span><span className="text-blue-400">ITIQ</span><span className="text-amber-400">AI</span>
              </h1>
            </div>
            <p className="mb-4 leading-relaxed">Empowering healthcare professionals with cutting-edge clinical skills training. Your gateway to a successful career in clinical research.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Quick Links</h5>
            {navLinks.map(l => (
              <a key={l.name} href={l.link} className="block mb-3 text-gray-300 hover:text-white transition text-base">
                {l.name}
              </a>
            ))}
            <button
              onClick={() => setActiveQuickLink('placement')}
              className="block mb-3 text-left text-gray-300 hover:text-white transition text-base"
            >
              Placement Policy
            </button>
            <button onClick={() => setPortalOpen(true)} className="block mt-2 text-green-400 font-semibold hover:text-green-300 transition text-left">Student Login →</button>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Our Courses</h5>
            {courses.map(c => (
              <button key={c.id} onClick={() => setSelectedCourse(c)} className="block mb-2 text-left hover:text-white transition">{c.title}</button>
            ))}
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Contact</h5>
            <a href="mailto:hr@skillitiq@gmail.com"  className="flex items-center gap-2 mb-3 hover:text-white transition"><Mail size={14} />hr@skillitiq@gmail.com</a>
            <a href="tel:+917995134506"           className="flex items-center gap-2 mb-3 hover:text-white transition"><Phone size={14} />+91 79951 34506</a>
            <span className="flex items-center gap-2 mb-4"><MapPin size={14} />Hyderabad, India</span>
            
            {/* Social Media Links */}
            <div className="flex gap-3 mt-4">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-90 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-500 hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.99 2.99 0 0 0-2.106-2.117C19.536 3.568 12 3.568 12 3.568s-7.536 0-9.392.501A2.99 2.99 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.99 2.99 0 0 0 2.106 2.117c1.856.501 9.392.501 9.392.501s7.536 0 9.392-.501a2.99 2.99 0 0 0 2.106-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.982 12 9.75 15.568z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-black hover:scale-110 transition text-white shadow-md" title="SKILLITIQ on X">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 hover:scale-110 transition text-white shadow-md" title="Chat on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>© 2026 SKILLITIQ. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ── Quick Link Content Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {activeQuickLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setActiveQuickLink(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 22 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveQuickLink(null)}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                aria-label="Close quick link content"
              >
                <X size={18} />
              </button>

              <div className="border-b border-gray-100 bg-gray-50 px-8 py-8">
                <span className="mb-3 inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-sm font-bold text-orange-600">
                  Quick Links
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                  {quickLinkContent[activeQuickLink].title}
                </h2>
                <p className="mt-3 max-w-2xl text-gray-600">
                  {quickLinkContent[activeQuickLink].subtitle}
                </p>
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-2">
                {quickLinkContent[activeQuickLink].sections.map(section => (
                  <div key={section.heading} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{section.heading}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-gray-600">{section.body}</p>
                    <ul className="space-y-3">
                      {section.bullets.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-8 py-5">
                <p className="text-sm text-gray-500">Need more details? Contact our admissions team for guidance.</p>
                <a
                  href="#contact"
                  onClick={() => setActiveQuickLink(null)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Contact Us →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Student Portal (Login + Dashboard) ──────────────────────────────── */}
      <StudentPortal open={portalOpen} onClose={() => setPortalOpen(false)} />

      {/* ── Course Detail Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 relative max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header colored band */}
              <div className={`${selectedCourse.color} rounded-t-3xl p-6 text-white`}>
                <button onClick={() => setSelectedCourse(null)} className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 rounded-full p-1 transition">
                  <X size={18} />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">{selectedCourse.level}</span>
                <h3 className="text-3xl font-extrabold mt-1">{selectedCourse.title}</h3>
                <p className="mt-2 text-white/80 text-sm leading-relaxed">{selectedCourse.description}</p>
              </div>

              <div className="p-8">
                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {[
                    { icon: Clock, val: selectedCourse.duration,            label: 'Duration' },
                    { icon: Users, val: `${selectedCourse.students.toLocaleString()}+`, label: 'Students' },
                    { icon: Star,  val: `${selectedCourse.rating}/5`,       label: 'Rating' },
                    { icon: Award, val: selectedCourse.level,               label: 'Level' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                      <item.icon className="mx-auto mb-1 text-blue-600" size={18} />
                      <div className="font-bold text-gray-900 text-sm">{item.val}</div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Modules */}
                <h4 className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-900">
                  <BookOpen size={20} className="text-blue-600" /> Course Modules
                </h4>
                <div className="space-y-2 mb-8">
                  {selectedCourse.modules.map((m, i) => (
                    <div key={m} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <span className="text-gray-700 text-sm">{m}</span>
                    </div>
                  ))}
                </div>

                {/* What You Get */}
                <h4 className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-900">
                  <CheckCircle size={20} className="text-green-600" /> What You Get
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {selectedCourse.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />{f}
                    </div>
                  ))}
                </div>

                <a href="#contact" onClick={() => setSelectedCourse(null)} className="block bg-blue-600 text-white text-center px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
                  Enquire Now →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
