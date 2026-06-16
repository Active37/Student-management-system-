"use client";

import React, { useState, useEffect } from "react";
import { 
  Home, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  CreditCard, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Calculator, 
  Clock, 
  Wifi, 
  DollarSign, 
  Download, 
  RefreshCw, 
  User,
  Users,
  MessageSquare,
  Shield,
  Send,
  Lock,
  Unlock,
  Printer,
  FilePlus,
  BookMarked,
  MapPin,
  Compass,
  Check,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
type UserRole = "Student" | "Professor" | "Department Head" | "Administrator";

interface CourseMaterial {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  maxPoints: number;
}

interface Course {
  code: string;
  title: string;
  units: number;
  description: string;
  instructorId: string;
  materials: CourseMaterial[];
  assignments: Assignment[];
}

interface GradeRecord {
  studentId: string;
  courseCode: string;
  ca: number; // max 40
  exam: number; // max 60
  status: "DRAFT" | "PENDING_HOD" | "RELEASED";
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface Announcement {
  id: string;
  type: "GENERAL" | "COURSE";
  courseCode?: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

interface StudentState {
  hostel: string;
  room: string;
  bed: string;
  church: string;
  feePaid: number;
  feeOption: "FULL" | "60_40";
  registeredCourses: string[];
  regStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  advisorNotes: string;
}

export default function UmisPortal() {
  // Multirole sandboxed actors
  const actors = {
    Student: { id: "adewale", name: "Adewale Johnson", email: "johnson.ade@babcock.edu.ng", detail: "ID: BU/2023/1042 | CSC Level 400" },
    Professor: { id: "prof_falola", name: "Dr. Olusegun Falola", email: "falolao@babcock.edu.ng", detail: "Senior Advisor (CSC)" },
    "Department Head": { id: "hod_adebayo", name: "Dr. Mrs. Grace Adebayo", email: "adebayog@babcock.edu.ng", detail: "HOD Computer Science Dept" },
    Administrator: { id: "admin_babalola", name: "Mrs. Victoria Babalola", email: "babalolav@babcock.edu.ng", detail: "Academic Registry Controls" }
  };

  const [activeRole, setActiveRole] = useState<UserRole>("Student");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State: Consolidated Database in LocalStorage
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentDb, setStudentDb] = useState<StudentState>({
    hostel: "", room: "", bed: "", church: "",
    feePaid: 588000, feeOption: "60_40",
    registeredCourses: ["CSC 401", "CSC 405", "CSC 411", "MTH 302"],
    regStatus: "DRAFT", advisorNotes: ""
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Seeding initial data on mount
  useEffect(() => {
    const cachedCourses = localStorage.getItem("umis_courses");
    const cachedGrades = localStorage.getItem("umis_grades");
    const cachedMessages = localStorage.getItem("umis_messages");
    const cachedAnnounce = localStorage.getItem("umis_announce");
    const cachedStudent = localStorage.getItem("umis_student");

    if (cachedCourses && cachedGrades && cachedMessages && cachedAnnounce && cachedStudent) {
      setCourses(JSON.parse(cachedCourses));
      setGrades(JSON.parse(cachedGrades));
      setMessages(JSON.parse(cachedMessages));
      setAnnouncements(JSON.parse(cachedAnnounce));
      setStudentDb(JSON.parse(cachedStudent));
    } else {
      // Seed original structures
      const seedCourses: Course[] = [
        {
          code: "CSC 401", title: "Artificial Intelligence II", units: 3, description: "Advanced modern machine intelligence and logic models", instructorId: "prof_falola",
          materials: [{ id: "m1", name: "CSC401_Syllabus.pdf", type: "PDF", date: "2026-06-01" }],
          assignments: [{ id: "a1", title: "ML Classifier Models", dueDate: "2026-06-25", maxPoints: 10 }]
        },
        {
          code: "CSC 405", title: "Database Systems Mgmt", units: 3, description: "Modern indexing, security controls and architecture", instructorId: "prof_falola",
          materials: [{ id: "m2", name: "Database_Normalizations.pdf", type: "PDF", date: "2026-06-05" }],
          assignments: [{ id: "a2", title: "3NF Normalization Practice", dueDate: "2026-06-20", maxPoints: 10 }]
        },
        {
          code: "CSC 411", title: "Software Engineering II", units: 4, description: "Secure SDLC patterns, pipelines and code auditing", instructorId: "prof_falola",
          materials: [{ id: "m3", name: "SDLC_Agile_Methods.pdf", type: "PDF", date: "2026-06-03" }],
          assignments: []
        },
        {
          code: "MTH 302", title: "Numerical Analysis", units: 3, description: "Taylor sequences, interpolation and errors", instructorId: "prof_falola",
          materials: [], assignments: []
        },
        {
          code: "CSC 413", title: "Mobile Application Dev", units: 3, description: "Modern React-Native, iOS and Android hybrid frameworks", instructorId: "prof_falola",
          materials: [], assignments: []
        }
      ];

      const seedGrades: GradeRecord[] = [
        { studentId: "adewale", courseCode: "CSC 401", ca: 34, exam: 52, status: "DRAFT" },
        { studentId: "adewale", courseCode: "CSC 405", ca: 37, exam: 48, status: "DRAFT" },
        { studentId: "adewale", courseCode: "CSC 411", ca: 28, exam: 42, status: "DRAFT" },
        { studentId: "adewale", courseCode: "MTH 302", ca: 31, exam: 45, status: "DRAFT" }
      ];

      const seedMessages: Message[] = [
        { id: "msg_1", senderId: "adewale", receiverId: "prof_falola", text: "Good afternoon sir, I submitted my course form for your review. Please kindly approve.", timestamp: "12:15 PM" },
        { id: "msg_2", senderId: "prof_falola", receiverId: "adewale", text: "Hello Adewale, I noticed your registration is loaded with 20 units. Ensure you have cleared your balance first.", timestamp: "12:30 PM" }
      ];

      const seedAnnounce: Announcement[] = [
        { id: "ann_1", type: "GENERAL", title: "Sabbath Attire Regulations", content: "All Babcock students are strictly reminded to wear formal suits, modest skirts, and formal shoes for the physical sabbath chapel audits. Offending dresses attract immediate loss of points.", author: "Academic Registry", date: "2026-06-15" },
        { id: "ann_2", type: "GENERAL", title: "Tuition Deadline Notice", content: "Alpha Semester finance accounts must show at least 60% payment for registration clearance and full 100% for final grade and score visibility.", author: "Bursary Office", date: "2026-06-10" }
      ];

      const seedStudent: StudentState = {
        hostel: "Nelson Mandela Hall", room: "302", bed: "Space A", church: "Pioneer Church (BU)",
        feePaid: 588000, feeOption: "60_40",
        registeredCourses: ["CSC 401", "CSC 405", "CSC 411", "MTH 302"],
        regStatus: "DRAFT", advisorNotes: ""
      };

      setCourses(seedCourses);
      setGrades(seedGrades);
      setMessages(seedMessages);
      setAnnouncements(seedAnnounce);
      setStudentDb(seedStudent);

      localStorage.setItem("umis_courses", JSON.stringify(seedCourses));
      localStorage.setItem("umis_grades", JSON.stringify(seedGrades));
      localStorage.setItem("umis_messages", JSON.stringify(seedMessages));
      localStorage.setItem("umis_announce", JSON.stringify(seedAnnounce));
      localStorage.setItem("umis_student", JSON.stringify(seedStudent));
    }
  }, []);

  // Update master state hook helper
  const updateStore = (key: string, data: any, setter: Function) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab("dashboard");
    showToast(`Switched Role: You are now acting as ${role}!`, "info");
  };

  // Helper variables for fees
  const TOTAL_TUITION = 980000;
  const MIN_FEES_FOR_REG = 588000; // 60% of tuition
  const isPaid60 = studentDb.feePaid >= MIN_FEES_FOR_REG;
  const isPaid100 = studentDb.feePaid >= TOTAL_TUITION;

  // Grade calculation helpers on 5.0 Babcock Scale
  const calculateTotalScore = (ca: number, exam: number) => Math.min(100, ca + exam);
  
  const getBabcockGradeInfo = (score: number) => {
    if (score >= 70) return { grade: "A", points: 5, color: "text-green-600 bg-green-50 border-green-200" };
    if (score >= 60) return { grade: "B", points: 4, color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (score >= 50) return { grade: "C", points: 3, color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    if (score >= 45) return { grade: "D", points: 2, color: "text-orange-600 bg-orange-50 border-orange-200" };
    return { grade: "F", points: 0, color: "text-red-600 bg-red-50 border-red-200" };
  };

  // SGPA and CGPA computation
  const enrolledInGrades = grades.filter(g => studentDb.registeredCourses.includes(g.courseCode));
  const totalUnits = enrolledInGrades.reduce((acc, g) => {
    const course = courses.find(c => c.code === g.courseCode);
    return acc + (course?.units || 3);
  }, 0);

  const totalQP = enrolledInGrades.reduce((acc, g) => {
    const course = courses.find(c => c.code === g.courseCode);
    const units = course?.units || 3;
    const totalScore = calculateTotalScore(g.ca, g.exam);
    return acc + (getBabcockGradeInfo(totalScore).points * units);
  }, 0);

  const calculatedGPA = totalUnits > 0 ? parseFloat((totalQP / totalUnits).toFixed(2)) : 0;

  // Handler: Submitting Messages
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: activeRole === "Student" ? "adewale" : "prof_falola",
      receiverId: activeRole === "Student" ? "prof_falola" : "adewale",
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...messages, newMsg];
    updateStore("umis_messages", updated, setMessages);
    setTypedMessage("");
    showToast("Message sent to academic console");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2 text-xs font-semibold rounded shadow-lg flex items-center space-x-2 border ${
              toast.type === "success" ? "bg-green-600 text-white border-green-500" :
              toast.type === "error" ? "bg-red-600 text-white border-red-500" :
              "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP SANDBOX CONTROL DECK */}
      <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 flex items-center justify-between z-40 text-white select-none shrink-0 scale-98 shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-400 animate-pulse" />
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-slate-100 flex items-center">
              BABCOCK UMIS 2.0 <span className="ml-1.5 px-1.5 py-0.5 bg-blue-600 text-[8px] rounded uppercase font-bold text-white">Sandbox Studio</span>
            </h1>
            <p className="text-[10px] text-slate-400">Perfect role simulation: Try student, grade releases, and registration approvals!</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-2">I Want to Act as:</span>
          {Object.keys(actors).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role as UserRole)}
              className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider transition-all duration-150 transform hover:scale-102 ${
                activeRole === role 
                  ? "bg-blue-600 text-white shadow-inner border border-blue-500" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-705 border border-slate-700"
              }`}
            >
              {role}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            title="Reset sandbox simulation database to seed state"
            className="p-1 border border-slate-700 bg-slate-800 hover:bg-red-900/40 rounded transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* CENTRAL CORE SYSTEM CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ROLE-BASED NAVIGATION SIDEBAR */}
        <aside className="w-56 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
          <div className="px-5 py-4 bg-slate-900 border-b border-slate-850">
            <h2 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center">
              🎓 {activeRole} Menu
            </h2>
            <p className="text-[9px] text-slate-400 font-mono mt-1 break-words leading-relaxed select-all">
              {actors[activeRole].name}
            </p>
          </div>

          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            {/* Student Navigation Panel */}
            {activeRole === "Student" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "dashboard" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" /> Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("finance")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "finance" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-3" /> Fees & Invoices
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "courses" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-3" /> Course Registration
                </button>
                <button
                  onClick={() => setActiveTab("logistics")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "logistics" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Compass className="w-4 h-4 mr-3" /> Hostel & Church
                </button>
                <button
                  onClick={() => setActiveTab("grades")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "grades" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Award className="w-4 h-4 mr-3" /> Grade Report
                </button>
                <button
                  onClick={() => setActiveTab("academics")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "academics" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <BookMarked className="w-4 h-4 mr-3" /> Syllabus & Materials
                </button>
              </>
            )}

            {/* Professor Navigation Panel */}
            {activeRole === "Professor" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "dashboard" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" /> Dashboard Overview
                </button>
                <button
                  onClick={() => setActiveTab("grades_management")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "grades_management" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Award className="w-4 h-4 mr-3" /> Result Excel Book
                </button>
                <button
                  onClick={() => setActiveTab("course_manager")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "course_manager" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Plus className="w-4 h-4 mr-3" /> Course & Materials
                </button>
                <button
                  onClick={() => setActiveTab("advisor_approvals")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all relative ${
                    activeTab === "advisor_approvals" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-3" /> Advisor Approvals
                  {studentDb.regStatus === "SUBMITTED" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                  )}
                </button>
              </>
            )}

            {/* Department Head (HOD) Navigation Panel */}
            {activeRole === "Department Head" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "dashboard" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" /> HOD Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("release_board")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all relative ${
                    activeTab === "release_board" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Award className="w-4 h-4 mr-3" /> Release Decisions
                  {grades.some(g => g.status === "PENDING_HOD") && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-600 text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase">ACTION</span>
                  )}
                </button>
              </>
            )}

            {/* Administrator Navigation Panel */}
            {activeRole === "Administrator" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "dashboard" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" /> Admin Home
                </button>
                <button
                  onClick={() => setActiveTab("billing_control")}
                  className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                    activeTab === "billing_control" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-3" /> Global Student Ledger
                </button>
              </>
            )}

            {/* Common direct messaging and bulletin */}
            <div className="px-5 py-2 mt-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Communications
            </div>
            <button
              onClick={() => setActiveTab("direct_messages")}
              className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                activeTab === "direct_messages" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-3" /> Direct Messaging
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-l-4 transition-all ${
                activeTab === "announcements" ? "bg-slate-900 text-white border-blue-500" : "border-transparent hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4 mr-3" /> Board & News
            </button>
          </nav>

          <div className="p-4 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
            <div>Babcock Academic Session</div>
            <div className="text-slate-300 font-bold mt-0.5">2026/2027 Calendar</div>
            <div className="mt-1 text-[8px] uppercase tracking-wider text-slate-400">Semester: Alpha</div>
          </div>
        </aside>

        {/* WORKSPACE VIEW AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          
          {/* USER CONTEXT HEADER */}
          <header className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10 select-none shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 font-black text-white text-xs flex items-center justify-center shadow-inner">
                {actors[activeRole].name.split(" ").pop()?.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase">
                  {actors[activeRole].name}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  {actors[activeRole].detail}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Portal Active Connection</p>
                <div className="flex items-center justify-end text-[10px] font-bold text-green-600">
                  <Wifi className="w-3.5 h-3.5 text-green-500 animate-pulse mr-1" />
                  ONLINE SECURE SYNC
                </div>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCROLLER PANEL */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            
            {/* 🧑‍🎓 STUDENT SCREEN COMPONENT */}
            {activeRole === "Student" && (
              <>
                {/* STATUS BAR CARDS */}
                {activeTab === "dashboard" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white p-4 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Registered Units</span>
                        <p className="text-xl font-extrabold mt-0.5">{totalUnits} / 24 Units</p>
                        <span className="text-[9px] font-bold text-blue-600">Max limit: 24.0 Max</span>
                      </div>
                      <div className="bg-white p-4 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Financial Clearance</span>
                        <p className={`text-xl font-extrabold mt-0.5 ${isPaid100 ? "text-green-600" : "text-yellow-600"}`}>
                          ₦{studentDb.feePaid.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-bold text-slate-500">
                          {isPaid100 ? "Paid In Full (100%)" : "60% Approved. Balance: ₦" + (TOTAL_TUITION - studentDb.feePaid).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-4 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Advisorship Clearance</span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className={`px-2 py-0.5 text-[9px] rounded font-black uppercase ${
                            studentDb.regStatus === "APPROVED" ? "bg-green-100 text-green-700" :
                            studentDb.regStatus === "SUBMITTED" ? "bg-yellow-105 text-yellow-700 animate-pulse" :
                            studentDb.regStatus === "REJECTED" ? "bg-red-105 text-red-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {studentDb.regStatus}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 truncate">Notes: {studentDb.advisorNotes || "No notes"}</span>
                      </div>
                      <div className="bg-white p-4 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Alpha Semester GPA</span>
                        <p className="text-xl font-extrabold mt-0.5 font-mono text-slate-800">
                          {isPaid100 ? calculatedGPA.toFixed(2) : "🔒 LOCKED"}
                        </p>
                        <span className="text-[9px] text-slate-500">
                          {isPaid100 ? "Cumulative Formula Approved" : "Pay 100% tuition to unlock"}
                        </span>
                      </div>
                    </div>

                    {/* ACADEMIC ALERTS */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded text-blue-900 text-xs flex justify-between items-center shadow-inner">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-700 flex-shrink-0" />
                        <div>
                          <span className="font-bold">Babcock Academic Rule Alert:</span> Minimum 60% fee clearance is mandatory to register courses and hostels. Minimum 100% clearance, and Course Approval from Advisor, is required to unlock your released grades and download the Course Form.
                        </div>
                      </div>
                    </div>

                    {/* GENERAL SYLLABI QUICK BOARD */}
                    <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center text-slate-800">
                        <BookMarked className="w-4 h-4 text-blue-600 mr-2" />
                        Your Enrolled Courses ({studentDb.registeredCourses.length})
                      </h3>
                      <div className="space-y-2">
                        {studentDb.registeredCourses.map((cc) => {
                          const course = courses.find(c => c.code === cc);
                          return (
                            <div key={cc} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center hover:bg-slate-100/50 transition">
                              <div>
                                <span className="font-mono text-xs font-black text-blue-900">{cc}</span>
                                <h4 className="text-xs font-bold text-slate-800 mt-0.5">{course?.title || "University Core Course"}</h4>
                              </div>
                              <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded">
                                {course?.units || 3} Units
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TUITION PAYMENT PORTAL */}
                {activeTab === "finance" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                      <div className="border-b border-slate-200 pb-3.5 mb-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-xs font-black uppercase text-slate-800 flex items-center">
                            <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                            Babcock University Student billing ledger
                          </h3>
                          <p className="text-[11px] text-slate-500">Pay tuition in full or choose the 60% installment option.</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-mono block">Billing reference ID</span>
                          <span className="text-xs font-bold font-mono">BU/2023/1042_AL_FEE</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded grid grid-cols-3 gap-4 mb-4 select-none">
                        <div className="border-r border-slate-200 pr-2 text-center py-1">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Total Tuition Fee</span>
                          <span className="text-lg font-black text-slate-800">₦{TOTAL_TUITION.toLocaleString()}</span>
                        </div>
                        <div className="border-r border-slate-250 text-center py-1">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Your Total Paid</span>
                          <span className="text-lg font-black text-green-700">₦{studentDb.feePaid.toLocaleString()}</span>
                        </div>
                        <div className="text-center py-1">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Tuition Ledger Debt Balance</span>
                          <span className="text-lg font-black text-red-600">₦{(TOTAL_TUITION - studentDb.feePaid).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Fee Billing Option</label>
                          <select
                            value={studentDb.feeOption}
                            onChange={(e) => {
                              const updated = { ...studentDb, feeOption: e.target.value as "FULL" | "60_40" };
                              updateStore("umis_student", updated, setStudentDb);
                            }}
                            className="w-full bg-white text-xs border border-slate-300 rounded px-3 py-1.5 focus:outline-none"
                          >
                            <option value="60_40">60/40 Phase Installment (₦588,000 threshold)</option>
                            <option value="FULL">100% Cleared Full Tuition (₦980,000)</option>
                          </select>
                        </div>
                        <div className="col-span-5">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Make Deposit Amount (₦)</label>
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => {
                                const updated = { ...studentDb, feePaid: MIN_FEES_FOR_REG };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast("Paid 60% installment successfully!", "success");
                              }}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-bold"
                            >
                              Pay 60%
                            </button>
                            <button
                              onClick={() => {
                                const updated = { ...studentDb, feePaid: TOTAL_TUITION };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast("Paid 100% full tuition successfully!", "success");
                              }}
                              className="px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[10px] font-bold"
                            >
                              Pay 100%
                            </button>
                          </div>
                        </div>
                        <div className="col-span-3 flex justify-end">
                          <button
                            onClick={() => {
                              window.print();
                            }}
                            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded flex items-center shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5 mr-2" /> Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* COURSE REGISTRATION PIPELINE WITH ADVISOR APPROVAL */}
                {activeTab === "courses" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    
                    {/* ENFORCED FEES GATE */}
                    {!isPaid60 ? (
                      <div className="bg-red-50 border border-red-200 p-6 rounded text-center shadow-sm max-w-lg mx-auto space-y-3">
                        <Lock className="w-12 h-12 text-red-500 mx-auto" />
                        <h4 className="text-sm font-black text-red-900 uppercase">COURSE REGISTRATION LOCKED</h4>
                        <p className="text-xs text-red-700">
                          Babcock financial code dictates you must pay at least 60% of tuition (₦588,000) to clear academic courses. Currently Paid: ₦{studentDb.feePaid.toLocaleString()}.
                        </p>
                        <button
                          onClick={() => setActiveTab("finance")}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition shadow-md"
                        >
                          Proceed to Finance Portal
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-12 gap-4">
                        {/* Selected Course form checklist */}
                        <div className="col-span-7 bg-white p-4 border border-slate-200 rounded shadow-sm space-y-4 flex flex-col justify-between">
                          <div>
                            <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                              <h3 className="text-xs font-black uppercase text-slate-800">
                                Your Selected Academic Load
                              </h3>
                              <span className="text-[10px] font-bold text-blue-600">Total: {totalUnits} Units (Max 24)</span>
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {studentDb.registeredCourses.map((cc) => {
                                const course = courses.find(c => c.code === cc);
                                return (
                                  <div key={cc} className="p-3 bg-slate-50 border border-slate-250 rounded flex justify-between items-center text-xs">
                                    <div>
                                      <span className="font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black text-[10px]">{cc}</span>
                                      <h4 className="text-xs font-bold text-slate-800 mt-1">{course?.title}</h4>
                                      <span className="text-[9px] text-slate-500">{course?.units} Credits</span>
                                    </div>
                                    {studentDb.regStatus === "DRAFT" || studentDb.regStatus === "REJECTED" ? (
                                      <button
                                        onClick={() => {
                                          const updated = {
                                            ...studentDb,
                                            registeredCourses: studentDb.registeredCourses.filter(c => c !== cc)
                                          };
                                          updateStore("umis_student", updated, setStudentDb);
                                          showToast(`Removed ${cc} from registration draft.`);
                                        }}
                                        className="text-red-500 hover:text-red-700 transition"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-green-600 font-bold uppercase">Locked</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-black block">Advisor Clearance Status</span>
                              <span className={`px-2 py-0.5 text-[9px] rounded font-black uppercase ${
                                studentDb.regStatus === "APPROVED" ? "bg-green-100 text-green-700" :
                                studentDb.regStatus === "SUBMITTED" ? "bg-yellow-100 text-yellow-700" :
                                "bg-slate-100 text-slate-600"
                              }`}>
                                {studentDb.regStatus}
                              </span>
                            </div>
                            
                            {studentDb.regStatus === "APPROVED" && (
                              <button
                                onClick={() => {
                                  showToast("Generating Official Endorsed Course Form PDF...");
                                }}
                                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs rounded shadow-md flex items-center"
                              >
                                <Printer className="w-3.5 h-3.5 mr-2" /> PDF Course Form
                              </button>
                            )}

                            {studentDb.regStatus === "DRAFT" && (
                              <button
                                onClick={() => {
                                  const updated = { ...studentDb, regStatus: "SUBMITTED" as const };
                                  updateStore("umis_student", updated, setStudentDb);
                                  showToast("Course load submitted to Dr. Falola for advisor signature approval!", "success");
                                }}
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded shadow transition"
                              >
                                Submit to Advisor
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Available Electives to add */}
                        <div className="col-span-5 bg-white p-4 border border-slate-200 rounded shadow-sm">
                          <h3 className="text-xs font-black uppercase text-slate-800 border-b border-slate-200 pb-2 mb-3">
                            Offered courses directory
                          </h3>

                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {courses.map((ac) => {
                              const isAdded = studentDb.registeredCourses.includes(ac.code);
                              return (
                                <div key={ac.code} className="p-3 bg-slate-50 border border-slate-205 rounded flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-mono text-slate-900 font-bold block">{ac.code}</span>
                                    <span className="font-semibold text-slate-800 mt-0.5 block">{ac.title}</span>
                                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{ac.units} Credits</span>
                                  </div>
                                  {!isAdded ? (
                                    <button
                                      disabled={studentDb.regStatus !== "DRAFT" && studentDb.regStatus !== "REJECTED"}
                                      onClick={() => {
                                        if (studentDb.registeredCourses.length >= 6) {
                                          showToast("Cannot exceed max recommended exam loading of 6 courses per semester!", "error");
                                          return;
                                        }
                                        const updated = {
                                          ...studentDb,
                                          registeredCourses: [...studentDb.registeredCourses, ac.code]
                                        };
                                        updateStore("umis_student", updated, setStudentDb);
                                        showToast(`Added ${ac.code} to your draft registration!`);
                                      }}
                                      className="px-2 py-1 bg-slate-900 text-white font-bold rounded text-[10px] hover:bg-slate-800 disabled:opacity-40"
                                    >
                                      Add
                                    </button>
                                  ) : (
                                    <span className="text-green-600 font-bold"><Check className="w-4 h-4" /></span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* LOGISTICS: HOSTEL & CHURCH SELECTION */}
                {activeTab === "logistics" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {!isPaid60 ? (
                      <div className="bg-yellow-50 border border-yellow-250 p-6 rounded text-center max-w-md mx-auto space-y-2">
                        <Lock className="w-10 h-10 text-yellow-600 mx-auto" />
                        <h4 className="text-xs font-black uppercase text-slate-800">LOGISTICS IS LOCKED</h4>
                        <p className="text-[11px] text-slate-600">You must make at least 60% fee deposit to lock in your bedroom spaces and chapel allocations.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Hostel Selector card */}
                        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm space-y-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 flex items-center border-b border-slate-100 pb-2">
                            <MapPin className="w-4 h-4 text-blue-600 mr-2" /> Select Hall of Residence (Hostel)
                          </h3>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Pick a Hall</label>
                            <select
                              value={studentDb.hostel}
                              onChange={(e) => {
                                const rooms = ["102", "205", "302", "401"];
                                const beds = ["Space A", "Space B", "Space C"];
                                const randRoom = rooms[Math.floor(Math.random() * rooms.length)];
                                const randBed = beds[Math.floor(Math.random() * beds.length)];
                                const updated = { ...studentDb, hostel: e.target.value, room: randRoom, bed: randBed };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast(`Assigned to ${e.target.value}, Room ${randRoom} (${randBed})`);
                              }}
                              className="w-full bg-white text-xs border border-slate-300 rounded px-3 py-1.5 focus:outline-none"
                            >
                              <option value="">-- No Hostel Allotted --</option>
                              <option value="Nelson Mandela Hall">Nelson Mandela Hall (Premium - Male)</option>
                              <option value="Samuel Akande Hall">Samuel Akande Hall (Classic - Male)</option>
                              <option value="Winslow Hall">Winslow Hall (Budget - Male)</option>
                              <option value="Queen Esther Hall">Queen Esther Hall (Classic - Female)</option>
                              <option value="Felicia Adebisi Dada Hall">Felicia Adebisi Dada Hall (Premium - Female)</option>
                            </select>
                          </div>

                          {studentDb.hostel && (
                            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded text-xs space-y-1">
                              <div><span className="font-bold text-slate-500">Hall:</span> {studentDb.hostel}</div>
                              <div><span className="font-bold text-slate-500">Room Allotted:</span> Room {studentDb.room}</div>
                              <div><span className="font-bold text-slate-500">Bed Allotment:</span> {studentDb.bed}</div>
                            </div>
                          )}
                        </div>

                        {/* Church/Sabbath Chapel selector */}
                        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm space-y-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 flex items-center border-b border-slate-100 pb-2">
                            <Compass className="w-4 h-4 text-blue-600 mr-2" /> Pick Seventh-day Sabbath Worship Center
                          </h3>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Pick a Chapel</label>
                            <select
                              value={studentDb.church}
                              onChange={(e) => {
                                const updated = { ...studentDb, church: e.target.value };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast(`Chapel Registration Updated: ${e.target.value}`);
                              }}
                              className="w-full bg-white text-xs border border-slate-300 rounded px-3 py-1.5 focus:outline-none"
                            >
                              <option value="">-- No Chapel Selection --</option>
                              <option value="Pioneer Church (BU)">University Pioneer Church (Main Auditorium)</option>
                              <option value="Bethel Chapel">Bethel Chapel (Youth/Freshmen Service)</option>
                              <option value="University Amphitheatre">Amphitheatre Chapel (Outdoor Campus fellowship)</option>
                              <option value="EAS Center">Departmental Seventh-day Adventist Fellowship</option>
                            </select>
                          </div>

                          {studentDb.church && (
                            <div className="p-3 bg-green-50/50 border border-green-200 rounded text-xs">
                              <div><span className="font-bold text-slate-500">Registered Chapel:</span> {studentDb.church}</div>
                              <p className="text-[10px] text-green-700 italic mt-1">✓ Sabbath worship attendance list updated dynamically.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* GRADE REPORT WITH DYNAMIC CGPA */}
                {activeTab === "grades" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    
                    {/* FINANCIAL CLEARANCE GATED GRADES */}
                    {!isPaid100 ? (
                      <div className="bg-slate-900 text-white p-6 rounded text-center shadow-md space-y-3 max-w-lg mx-auto">
                        <Lock className="w-10 h-10 text-yellow-500 mx-auto" />
                        <h4 className="text-xs font-black uppercase text-yellow-400">SEMESTER SCOREBOARD LOCKED</h4>
                        <p className="text-xs text-slate-300">
                          To protect academic integrity, Babcock bursar locks final grade details until 100% financial clearance. You have paid ₦{studentDb.feePaid.toLocaleString()} / ₦{TOTAL_TUITION.toLocaleString()}.
                        </p>
                        <button
                          onClick={() => setActiveTab("finance")}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded transition"
                        >
                          Complete Tuition Balance
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                        <div className="border-b border-slate-200 pb-3 mb-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-xs font-black uppercase text-slate-800 flex items-center">
                              <Award className="w-4 h-4 text-blue-600 mr-2" />
                              Alpha Semester Official Grade Report Card
                            </h3>
                            <p className="text-[11px] text-slate-500">Includes continuous tests, semester examinations, unit loads, and SGPA calculations.</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 px-3.5 py-1 rounded text-right">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Computed SGPA</span>
                            <span className="text-lg font-black text-blue-900 font-mono">{calculatedGPA.toFixed(2)} / 5.00</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left high-density-table">
                            <thead>
                              <tr className="bg-slate-100 uppercase text-slate-700 font-black text-[10px]">
                                <th className="p-2">Course Code</th>
                                <th className="p-2">Title</th>
                                <th className="p-2 text-center">Units</th>
                                <th className="p-2 text-center">CA Marks (40)</th>
                                <th className="p-2 text-center">Exam Marks (60)</th>
                                <th className="p-2 text-center">Total (100)</th>
                                <th className="p-2 text-center">Babcock Grade</th>
                                <th className="p-2 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {enrolledInGrades.map((g) => {
                                const course = courses.find(c => c.code === g.courseCode);
                                const totalScore = calculateTotalScore(g.ca, g.exam);
                                const gradeInfo = getBabcockGradeInfo(totalScore);
                                return (
                                  <tr key={g.courseCode} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="font-mono py-2 text-blue-900 font-bold">{g.courseCode}</td>
                                    <td className="py-2 text-slate-800 font-medium">{course?.title}</td>
                                    <td className="text-center font-bold">{course?.units || 3}</td>
                                    {g.status === "RELEASED" ? (
                                      <>
                                        <td className="text-center font-mono text-slate-600">{g.ca}</td>
                                        <td className="text-center font-mono text-slate-600">{g.exam}</td>
                                        <td className="text-center font-mono font-bold text-slate-900">{totalScore}</td>
                                        <td className="text-center">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${gradeInfo.color}`}>
                                            {gradeInfo.grade}
                                          </span>
                                        </td>
                                      </>
                                    ) : (
                                      <td colSpan={4} className="text-center py-2 text-slate-405 font-medium italic">
                                        ⏳ Grading Pending HOD release
                                      </td>
                                    )}
                                    <td className="text-center">
                                      <span className={`status-pill ${g.status === "RELEASED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-750"}`}>
                                        {g.status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* MATERIALS TABLE */}
                {activeTab === "academics" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                      <h3 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-2 mb-3">
                        Released Course Materials Directory
                      </h3>
                      <div className="space-y-2">
                        {courses.filter(c => studentDb.registeredCourses.includes(c.code)).map((c) => (
                          <div key={c.code} className="p-3 bg-slate-50 border border-slate-150 rounded">
                            <span className="font-mono text-[10px] font-black text-blue-900">{c.code} - {c.title}</span>
                            <div className="mt-2 text-xs space-y-1">
                              {c.materials.length === 0 ? (
                                <p className="text-slate-400 italic">No course slides uploaded yet by instructor.</p>
                              ) : (
                                c.materials.map((mat) => (
                                  <div key={mat.id} className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                                    <div className="flex items-center space-x-2">
                                      <FilePlus className="w-3.5 h-3.5 text-blue-700" />
                                      <span className="font-bold text-slate-800">{mat.name} ({mat.type})</span>
                                    </div>
                                    <button
                                      onClick={() => showToast(`Downloading: ${mat.name}`)}
                                      className="text-blue-600 hover:underline text-[10px] font-bold"
                                    >
                                      Download Material
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* 👨‍🏫 PROFESSOR PORTAL CONTROLS */}
            {activeRole === "Professor" && (
              <>
                {/* Professor Dashboard overview */}
                {activeTab === "dashboard" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                      <span className="text-[9px] uppercase font-black text-slate-400 block">Assigned Courses</span>
                      <p className="text-2xl font-black text-slate-800 mt-1">{courses.length}</p>
                      <span className="text-[10px] text-blue-600">Course Advisor Clearance Seat</span>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                      <span className="text-[9px] uppercase font-black text-slate-400 block">Pending Registering Students</span>
                      <p className="text-2xl font-black text-yellow-600 mt-1">
                        {studentDb.regStatus === "SUBMITTED" ? 1 : 0}
                      </p>
                      <span className="text-[10px] text-slate-500">Requires registration review</span>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                      <span className="text-[9px] uppercase font-black text-slate-400 block">Unsubmitted Class Sheets</span>
                      <p className="text-2xl font-black text-red-600 mt-1">
                        {grades.some(g => g.status === "DRAFT") ? 1 : 0}
                      </p>
                      <span className="text-[10px] text-slate-500">Awaiting release push to HOD office</span>
                    </div>
                  </motion.div>
                )}

                {/* COURSE & MATERIALS MANAGER */}
                {activeTab === "course_manager" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                        <Plus className="w-4 h-4 text-blue-700 mr-2" />
                        Create and Manage Core Academic Courses
                      </h3>

                      {/* course list with material addition */}
                      <div className="space-y-3">
                        {courses.map((course) => (
                          <div key={course.code} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                              <div>
                                <span className="font-mono text-xs font-black text-blue-900">{course.code}</span>
                                <h4 className="text-xs font-bold text-slate-800 mt-1">{course.title} ({course.units} Credit Units)</h4>
                              </div>
                              <button
                                onClick={() => {
                                  const name = prompt("Enter slide/syllabus material document name (e.g., CSC401_Lecture3.pdf):");
                                  if (!name) return;
                                  const newMat: CourseMaterial = { id: `mat_${Date.now()}`, name, type: "PDF", date: "2026-06-16" };
                                  const updated = courses.map(c => {
                                    if (c.code === course.code) {
                                      return { ...c, materials: [...c.materials, newMat] };
                                    }
                                    return c;
                                  });
                                  updateStore("umis_courses", updated, setCourses);
                                  showToast("Course material slide uploaded to Student Portal successfully!");
                                }}
                                className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase rounded"
                              >
                                + Upload Slide Material
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span className="font-bold">Uploaded Syllabus/Slides:</span>
                              <div className="space-y-1 mt-1 pl-2">
                                {course.materials.length === 0 ? (
                                  <p className="italic text-slate-400">No slides loaded yet.</p>
                                ) : (
                                  course.materials.map(mat => (
                                    <div key={mat.id} className="flex items-center space-x-1.5 text-slate-700">
                                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                                      <span className="font-mono font-bold">{mat.name}</span>
                                      <span className="text-[9px] text-slate-400">({mat.date})</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ADVISOR COURSE APPROVALS PORTAL */}
                {activeTab === "advisor_approvals" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                      <h3 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-2 mb-3">
                        Course Advisor registration approve queue
                      </h3>

                      {studentDb.regStatus !== "SUBMITTED" ? (
                        <p className="text-xs text-slate-500 italic py-4">No pending course approval requests at this moment.</p>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-205 pb-2">
                            <div>
                              <span className="text-xs font-black text-slate-805 block">Student: {actors.Student.name}</span>
                              <span className="font-mono text-[10px] text-slate-400 block">{actors.Student.detail}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                              Clearance: {isPaid60 ? "60% Paid Approved" : "Unpaid"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-404 block mb-1">Selected Course Load Checklist:</span>
                            <div className="flex flex-wrap gap-2">
                              {studentDb.registeredCourses.map(cc => (
                                <span key={cc} className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs">
                                  {cc}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Advisor's Registry Notes</label>
                            <input
                              type="text"
                              placeholder="Write helpful suggestions / comments for advisor stamps..."
                              value={studentDb.advisorNotes}
                              onChange={(e) => {
                                const updated = { ...studentDb, advisorNotes: e.target.value };
                                updateStore("umis_student", updated, setStudentDb);
                              }}
                              className="w-full bg-white text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                            />
                          </div>

                          <div className="pt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                const updated = { ...studentDb, regStatus: "REJECTED" as const };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast("Student course form rejected and returned back to study level drafts.", "info");
                              }}
                              className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded transition"
                            >
                              Reject & Return
                            </button>
                            <button
                              onClick={() => {
                                const updated = { ...studentDb, regStatus: "APPROVED" as const };
                                updateStore("umis_student", updated, setStudentDb);
                                showToast("Course registration Approved officially dynamic stamps issued!", "success");
                              }}
                              className="px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded shadow transition"
                            >
                              Approve & Stamp Sign Form
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* GRADES AND EXCEL SPREADSHEETS */}
                {activeTab === "grades_management" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                      <div className="border-b border-slate-205 pb-2.5 mb-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-xs font-black uppercase text-slate-800">
                            Continuous Assessment and exam records spreadsheet
                          </h3>
                          <p className="text-[10px] text-slate-500">Record midterm, assignments, and exam grades before forwarding to HOD.</p>
                        </div>
                        <button
                          onClick={() => {
                            const updated = grades.map(g => {
                              if (g.status === "DRAFT") {
                                return { ...g, status: "PENDING_HOD" as const };
                              }
                              return g;
                            });
                            updateStore("umis_grades", updated, setGrades);
                            showToast("Grades pushed to Dr. Grace Adebayo (HOD) for official release!", "success");
                          }}
                          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase rounded shadow-sm"
                        >
                          Push Entire Record Book to HOD
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left high-density-table">
                          <thead>
                            <tr className="bg-slate-100 uppercase text-slate-700 font-black text-[10px]">
                              <th className="p-2">Student Name</th>
                              <th className="p-2">Course</th>
                              <th className="p-2 text-center">CA Out of (40)</th>
                              <th className="p-2 text-center">Exam Out of (60)</th>
                              <th className="p-2 text-center">Total Computed</th>
                              <th className="p-2 text-center">Assigned Grade</th>
                              <th className="p-2 text-center">Ledger State</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grades.map((g) => {
                              const total = calculateTotalScore(g.ca, g.exam);
                              const letter = getBabcockGradeInfo(total).grade;
                              return (
                                <tr key={g.courseCode} className="border-b border-slate-10 hover:bg-slate-50">
                                  <td className="font-bold py-2">{actors.Student.name}</td>
                                  <td className="font-mono text-blue-900 font-bold">{g.courseCode}</td>
                                  <td className="text-center font-mono font-bold">
                                    <input
                                      type="number"
                                      disabled={g.status !== "DRAFT"}
                                      value={g.ca}
                                      onChange={(e) => {
                                        const parsed = Math.min(40, Math.max(0, parseFloat(e.target.value) || 0));
                                        const updated = grades.map(x => x.courseCode === g.courseCode ? { ...x, ca: parsed } : x);
                                        updateStore("umis_grades", updated, setGrades);
                                      }}
                                      className="w-12 bg-white text-center border border-slate-300 rounded font-bold"
                                    />
                                  </td>
                                  <td className="text-center font-mono font-bold">
                                    <input
                                      type="number"
                                      disabled={g.status !== "DRAFT"}
                                      value={g.exam}
                                      onChange={(e) => {
                                        const parsed = Math.min(60, Math.max(0, parseFloat(e.target.value) || 0));
                                        const updated = grades.map(x => x.courseCode === g.courseCode ? { ...x, exam: parsed } : x);
                                        updateStore("umis_grades", updated, setGrades);
                                      }}
                                      className="w-12 bg-white text-center border border-slate-300 rounded font-bold"
                                    />
                                  </td>
                                  <td className="text-center font-mono font-black text-slate-800">{total}</td>
                                  <td className="text-center font-bold">{letter}</td>
                                  <td className="text-center">
                                    <span className={`status-pill ${
                                      g.status === "RELEASED" ? "bg-green-105 text-green-700" :
                                      g.status === "PENDING_HOD" ? "bg-yellow-105 text-yellow-750" :
                                      "bg-slate-100 text-slate-600"
                                    }`}>
                                      {g.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* 👩‍🔬 DEPARTMENT HEAD PORTAL AREA */}
            {activeRole === "Department Head" && (
              <>
                {/* Dashboard stats */}
                {activeTab === "dashboard" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Department Size</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">1 Student (Simulation)</p>
                      </div>
                      <div className="bg-white p-4 border border-slate-205 rounded shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Pending Class Release Logs</span>
                        <p className="text-2xl font-black text-yellow-600 mt-1">
                          {grades.some(g => g.status === "PENDING_HOD") ? 1 : 0}
                        </p>
                      </div>
                      <div className="bg-white p-4 border border-slate-205 rounded shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Released Class Average GPA</span>
                        <p className="text-2xl font-black text-green-600 mt-1">4.62 / 5.0 CGPA</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <h3 className="text-xs font-black uppercase text-slate-800 border-b border-indigo-100 pb-2 mb-2">CS Department Circulars</h3>
                      <p className="text-xs text-slate-600">The computer science student senate elections have been rescheduled to align with Babcock annual schedules. General university directives apply.</p>
                    </div>
                  </motion.div>
                )}

                {/* HOD DECISIONS FOR CLASS EXAMS */}
                {activeTab === "release_board" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                      <div className="border-b border-slate-200 pb-2 mb-3.5 flex justify-between items-center animate-pulse">
                        <div>
                          <h3 className="text-xs font-black uppercase text-slate-850">Pending Results verification catalog</h3>
                          <p className="text-[11px] text-slate-500">Examine averages and compliance metrics, and sign with HOD key stamp to release.</p>
                        </div>
                        {grades.some(g => g.status === "PENDING_HOD") && (
                          <button
                            onClick={() => {
                              const updated = grades.map(g => {
                                if (g.status === "PENDING_HOD") {
                                  return { ...g, status: "RELEASED" as const };
                                }
                                return g;
                              });
                              updateStore("umis_grades", updated, setGrades);
                              showToast("All grades released and fully unlocked for cleared student portals!", "success");
                            }}
                            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase rounded shadow transition"
                          >
                            ✓ Approve and Release Results
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {grades.filter(x => x.status === "PENDING_HOD").length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-4 text-center">No class grade reports awaiting HOD check signatures presently.</p>
                        ) : (
                          grades.filter(x => x.status === "PENDING_HOD").map(g => {
                            const total = calculateTotalScore(g.ca, g.exam);
                            return (
                              <div key={g.courseCode} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-black text-[10px]">{g.courseCode}</span>
                                  <h4 className="text-xs font-bold text-slate-805 mt-1">Instructor: {actors.Professor.name}</h4>
                                </div>
                                <div className="text-right flex items-center space-x-4">
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-mono block">Class Average</span>
                                    <span className="font-bold text-slate-800 font-mono">{total} Points ({getBabcockGradeInfo(total).grade})</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* 🛡️ ADMINISTRATOR SYSTEM SCREEN */}
            {activeRole === "Administrator" && (
              <>
                {activeTab === "dashboard" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Financial statistics collection card */}
                      <div className="bg-white p-5 border border-slate-203 rounded shadow-sm">
                        <h4 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-2 mb-3">Tuition Collections Registry</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Expected Campus Revenue:</span>
                            <span className="font-bold font-mono">₦{TOTAL_TUITION.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total Cleared Income:</span>
                            <span className="font-bold font-mono text-green-700">₦{studentDb.feePaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Uncollected Outstanding Deficit:</span>
                            <span className="font-bold font-mono text-red-600">₦{(TOTAL_TUITION - studentDb.feePaid).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active directory stats */}
                      <div className="bg-slate-900 text-white p-5 rounded border border-slate-950">
                        <h4 className="text-xs font-black uppercase text-slate-300 border-b border-slate-800 pb-2 mb-3">System Directory Indexes</h4>
                        <div className="space-y-2 text-xs font-mono">
                          <div>👩‍🎓 Active Registered: 1 Student</div>
                          <div>👨‍🏫 Active Instructors: 1 Professor</div>
                          <div>🏛️ Academic Sem: Alpha Semester 2026</div>
                          <div>🛡️ Registry Key Status: Active</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* BILLING / TUITION CONTROLS */}
                {activeTab === "billing_control" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-white p-5 border border-slate-200 rounded shadow-sm">
                      <h3 className="text-xs font-black uppercase text-slate-800 border-b border-slate-100 pb-2 mb-3">
                        General Financial Ledger Adjuster
                      </h3>

                      <div className="p-4 bg-slate-50 border border-slate-205 rounded space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">Student: {actors.Student.name}</span>
                            <span className="font-mono text-[9px] text-slate-400 block">ID: BU/2023/1042</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Tuition Paid</span>
                            <span className="font-bold text-green-700 font-mono">₦{studentDb.feePaid.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Override Deposit Fee (₦)</label>
                          <input
                            type="number"
                            value={studentDb.feePaid}
                            onChange={(e) => {
                              const updated = { ...studentDb, feePaid: parseFloat(e.target.value) || 0 };
                              updateStore("umis_student", updated, setStudentDb);
                            }}
                            className="w-full bg-white text-xs border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Adjust paid tuition directly to test out student GPA blockage gates or course form access limits.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* COMMON VIEW: DIRECT MESSAGING CHATBOX */}
            {activeTab === "direct_messages" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-800 flex items-center">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-2 animate-bounce" />
                    Academic Direct Messaging Console
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Secure Chat Channel</span>
                </div>

                {/* Conversation threads list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                  {messages.map((msg) => {
                    const isSenderMe = (activeRole === "Student" && msg.senderId === "adewale") || (activeRole === "Professor" && msg.senderId === "prof_falola");
                    return (
                      <div key={msg.id} className={`flex ${isSenderMe ? "justify-end" : "justify-start"}`}>
                        <div className={`p-2.5 rounded max-w-sm text-xs shadow-sm ${
                          isSenderMe ? "bg-slate-900 border border-slate-800 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                        }`}>
                          <p className="leading-normal">{msg.text}</p>
                          <span className={`text-[8px] mt-1 block text-right ${isSenderMe ? "text-slate-400" : "text-slate-400"}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* chat typing dock */}
                <div className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type message text here to talk with academic mentor/student..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 bg-slate-50 text-xs border border-slate-300 rounded px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* COMMON VIEW: ANNOUNCEMENT BULLETIN BOARD */}
            {activeTab === "announcements" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                
                {/* Announcement bulletin creator for admin/professors */}
                {(activeRole === "Administrator" || activeRole === "Professor" || activeRole === "Department Head") && (
                  <div className="bg-white p-4 border border-slate-200 rounded shadow-sm space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-800">Post Announcement circular bulletin</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Announcement Title..."
                        id="new_ann_title"
                        className="bg-slate-50 text-xs border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      />
                      <select
                        id="new_ann_type"
                        className="bg-slate-50 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="GENERAL">General Notice</option>
                        <option value="COURSE">Course Directive</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Write the exact notification circular context here..."
                      id="new_ann_content"
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded px-3 py-2 h-20 focus:outline-none focus:border-blue-500"
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const titleEl = document.getElementById("new_ann_title") as HTMLInputElement;
                          const typeEl = document.getElementById("new_ann_type") as HTMLSelectElement;
                          const contentEl = document.getElementById("new_ann_content") as HTMLTextAreaElement;

                          if (!titleEl.value || !contentEl.value) {
                            showToast("Title and context content is required to post circular notifications!", "error");
                            return;
                          }

                          const newAnn: Announcement = {
                            id: `ann_${Date.now()}`,
                            title: titleEl.value,
                            type: typeEl.value as "GENERAL" | "COURSE",
                            content: contentEl.value,
                            author: actors[activeRole].name,
                            date: new Date().toISOString().split("T")[0]
                          };

                          const updated = [newAnn, ...announcements];
                          updateStore("umis_announce", updated, setAnnouncements);
                          titleEl.value = "";
                          contentEl.value = "";
                          showToast("Announcement circular published live to UMIS billboard!");
                        }}
                        className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded shadow transition"
                      >
                        Publish Circular live
                      </button>
                    </div>
                  </div>
                )}

                {/* Live announcements bulletin display list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-800">Academic Board Billboard ({announcements.length})</h3>
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:border-slate-350 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            ann.type === "GENERAL" ? "bg-slate-900 text-white" : "bg-blue-105 text-blue-700 border border-blue-200"
                          }`}>
                            {ann.type} Notice
                          </span>
                          <h4 className="text-xs font-black text-slate-800 mt-1.5">{ann.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed leading-normal whitespace-pre-line">{ann.content}</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-bold select-none">
                        <span>Issued by: {ann.author}</span>
                        <span className="text-slate-400">Registry Seal Active ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>

    </div>
  );
}
