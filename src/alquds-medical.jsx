import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";


// ─── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
  "https://gxbeidzafrmhinqqghxi.supabase.co",
  "sb_publishable_X2eymDysRJte2fpaLxAG4g_134N2wUI"
);

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: "ltr", lang: "en",
    sysName: "Al-Quds Medical Complex",
    sysSub: "Medical Appointment System",
    switchLang: "عربي",
    nav: { home: "Home", appointments: "Appointments", patients: "Patients", centers: "Centers", schedules: "Schedules", reports: "Reports", settings: "Settings", admin: "Admin", logout: "Logout" },
    home: { welcome: "Advanced Healthcare,", welcome2: "At Your Fingertips", sub: "Book appointments at Al-Quds Medical Complex centers across the region. Fast, simple, secure.", getStarted: "Book an Appointment", manageAppts: "Manage My Appointments", f1t: "Instant Verification", f1d: "Check your records in seconds with your national ID or passport", f2t: "Smart Scheduling", f2d: "Choose from real-time available slots across all our centers", f3t: "Digital Tickets", f3d: "QR-coded confirmation tickets sent instantly to your email" },
    verify: { title: "Identity Verification", sub: "Enter your details to access your medical record", nationalId: "National ID", passport: "Passport", dob: "Date of Birth", verify: "Verify Identity", verifying: "Verifying...", found: "Medical record found", foundSub: "Welcome back!", notFound: "No record found", notFoundSub: "Create your medical profile to continue", continueBook: "Continue to Book", createRecord: "Create Medical Record", tryNat: "National ID", tryPass: "Passport" },
    register: { title: "Create Medical Record", sub: "Fill in your details to register", fullName: "Full Name", gender: "Gender", male: "Male", female: "Female", dob: "Date of Birth", nationality: "Nationality", nationalId: "National ID", passport: "Passport Number", phone: "Phone Number", email: "Email Address", address: "Address", chronic: "Chronic Diseases", allergies: "Allergies", bloodType: "Blood Type", emergency: "Emergency Contact", optional: "Medical Information (Optional)", submit: "Create Record", back: "Back", success: "Record Created!", successSub: "Redirecting to booking..." },
    book: { title: "Book Appointment", step: "Step", of: "of", country: "Country", city: "City", center: "Medical Center", specialty: "Specialty", doctor: "Doctor", date: "Choose Date", time: "Choose Time Slot", confirm: "Confirm Booking", confirmInfo: "Your Information", review: "Review Appointment", back: "Back", next: "Next", confirmed: "Booking Confirmed!", ref: "Booking Reference", download: "Download Ticket", print: "Print Ticket", newBooking: "Book Another", noSlots: "No available slots for this date", selectDoctor: "Select a doctor first", loadingSlots: "Loading slots..." },
    admin: { title: "Admin Dashboard", totalPatients: "Total Patients", totalAppts: "Total Appointments", todayAppts: "Today's Appointments", pending: "Pending", recentAppts: "Recent Appointments", quickActions: "Quick Actions", addCenter: "Add Center", manageSlots: "Manage Slots", viewReports: "View Reports", exportData: "Export Data", patients: "Patients", centers: "Centers", reports: "Reports", settings: "Settings", appointments: "Appointments", status: "Status", patient: "Patient", center: "Center", date: "Date", time: "Time", type: "Type", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed", noShow: "No Show", rescheduled: "Rescheduled", actions: "Actions", edit: "Edit", cancel: "Cancel", search: "Search patients...", addPatient: "Add Patient", loading: "Loading...", error: "Error loading data" },
    status: { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed", no_show: "No Show", rescheduled: "Rescheduled" },
    login: { title: "Admin Login", username: "Username", password: "Password", login: "Login", error: "Invalid credentials", logging: "Logging in..." },
    errors: { required: "This field is required", network: "Network error. Please try again.", notFound: "Not found" }
  },
  ar: {
    dir: "rtl", lang: "ar",
    sysName: "مجمع القدس الطبي",
    sysSub: "نظام حجز المواعيد الطبية",
    switchLang: "English",
    nav: { home: "الرئيسية", appointments: "المواعيد", patients: "المرضى", centers: "المراكز", schedules: "الجداول", reports: "التقارير", settings: "الإعدادات", admin: "الإدارة", logout: "خروج" },
    home: { welcome: "رعاية صحية متطورة،", welcome2: "في متناول يدك", sub: "احجز مواعيدك في مراكز مجمع القدس الطبي في جميع أنحاء المنطقة. سريع، بسيط، آمن.", getStarted: "احجز موعداً", manageAppts: "إدارة مواعيدي", f1t: "تحقق فوري", f1d: "تحقق من سجلاتك في ثوانٍ بهويتك الوطنية أو جواز سفرك", f2t: "جدولة ذكية", f2d: "اختر من الفترات المتاحة في الوقت الفعلي عبر جميع مراكزنا", f3t: "تذاكر رقمية", f3d: "تذاكر تأكيد برمز QR تُرسل فوراً إلى بريدك الإلكتروني" },
    verify: { title: "التحقق من الهوية", sub: "أدخل بياناتك للوصول إلى سجلك الطبي", nationalId: "رقم الهوية الوطنية", passport: "رقم جواز السفر", dob: "تاريخ الميلاد", verify: "التحقق من الهوية", verifying: "جارٍ التحقق...", found: "تم العثور على سجل طبي", foundSub: "مرحباً بعودتك!", notFound: "لم يتم العثور على سجل", notFoundSub: "أنشئ ملفك الطبي للمتابعة", continueBook: "متابعة الحجز", createRecord: "إنشاء سجل طبي", tryNat: "هوية وطنية", tryPass: "جواز سفر" },
    register: { title: "إنشاء سجل طبي", sub: "أدخل بياناتك للتسجيل", fullName: "الاسم الكامل", gender: "الجنس", male: "ذكر", female: "أنثى", dob: "تاريخ الميلاد", nationality: "الجنسية", nationalId: "رقم الهوية", passport: "رقم جواز السفر", phone: "رقم الهاتف", email: "البريد الإلكتروني", address: "العنوان", chronic: "الأمراض المزمنة", allergies: "الحساسية", bloodType: "فصيلة الدم", emergency: "جهة اتصال الطوارئ", optional: "المعلومات الطبية (اختياري)", submit: "إنشاء السجل", back: "رجوع", success: "تم إنشاء السجل!", successSub: "جارٍ التوجيه للحجز..." },
    book: { title: "حجز موعد", step: "الخطوة", of: "من", country: "الدولة", city: "المدينة", center: "المركز الطبي", specialty: "التخصص", doctor: "الطبيب", date: "اختر التاريخ", time: "اختر وقتاً متاحاً", confirm: "تأكيد الحجز", confirmInfo: "بياناتك", review: "مراجعة الموعد", back: "رجوع", next: "التالي", confirmed: "تم تأكيد الحجز!", ref: "رقم الحجز", download: "تحميل التذكرة", print: "طباعة التذكرة", newBooking: "حجز موعد آخر", noSlots: "لا توجد مواعيد متاحة لهذا التاريخ", selectDoctor: "اختر طبيباً أولاً", loadingSlots: "جارٍ تحميل المواعيد..." },
    admin: { title: "لوحة الإدارة", totalPatients: "إجمالي المرضى", totalAppts: "إجمالي المواعيد", todayAppts: "مواعيد اليوم", pending: "في الانتظار", recentAppts: "المواعيد الأخيرة", quickActions: "إجراءات سريعة", addCenter: "إضافة مركز", manageSlots: "إدارة الفترات", viewReports: "التقارير", exportData: "تصدير البيانات", patients: "المرضى", centers: "المراكز", reports: "التقارير", settings: "الإعدادات", appointments: "المواعيد", status: "الحالة", patient: "المريض", center: "المركز", date: "التاريخ", time: "الوقت", type: "النوع", confirmed: "مؤكد", cancelled: "ملغى", completed: "مكتمل", noShow: "لم يحضر", rescheduled: "معاد جدولته", actions: "إجراءات", edit: "تعديل", cancel: "إلغاء", search: "البحث عن مرضى...", addPatient: "إضافة مريض", loading: "جارٍ التحميل...", error: "خطأ في تحميل البيانات" },
    status: { pending: "معلق", confirmed: "مؤكد", cancelled: "ملغى", completed: "مكتمل", no_show: "لم يحضر", rescheduled: "معاد جدولته" },
    login: { title: "تسجيل دخول الإدارة", username: "اسم المستخدم", password: "كلمة المرور", login: "دخول", error: "بيانات غير صحيحة", logging: "جارٍ الدخول..." },
    errors: { required: "هذا الحقل مطلوب", network: "خطأ في الشبكة. حاول مرة أخرى.", notFound: "غير موجود" }
  }
};

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  green: "#0A5C2A", greenMid: "#1B6B3A", greenLight: "#2D8F56", greenPale: "#E8F5EE", greenGhost: "#F0FAF4",
  red: "#B91C1C", redPale: "#FEE2E2",
  gold: "#92680A", goldPale: "#FEF3C7",
  blue: "#1D4ED8", bluePale: "#EFF6FF",
  dark: "#0A1A0F", darkMid: "#1F3324", gray800: "#2D3F32",
  gray600: "#4A6550", gray400: "#8FA892", gray200: "#C5D4C7", gray100: "#E2EAE3", gray50: "#F0F4F0",
  white: "#FFFFFF", offWhite: "#F7FAF7",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:${C.offWhite};color:${C.dark};}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:${C.gray50};}
    ::-webkit-scrollbar-thumb{background:${C.greenMid};border-radius:3px;}
    input,select,textarea{outline:none;font-family:inherit;}
    button{cursor:pointer;border:none;font-family:inherit;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
    @keyframes spin{to{transform:rotate(360deg);}}
    @keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
    @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
    .fadeUp{animation:fadeUp 0.45s ease forwards;}
    .fadeIn{animation:fadeIn 0.3s ease forwards;}
    .card{transition:transform 0.2s,box-shadow 0.2s;}
    .card:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(10,92,42,0.12)!important;}
    .btn-primary{background:linear-gradient(135deg,${C.greenMid},${C.greenLight});color:white;border-radius:11px;padding:12px 28px;font-size:15px;font-weight:600;transition:all 0.2s;box-shadow:0 4px 18px rgba(27,107,58,0.28);}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(27,107,58,0.38);}
    .btn-primary:disabled{opacity:0.6;transform:none;cursor:not-allowed;}
    .btn-secondary{background:white;color:${C.greenMid};border:2px solid ${C.greenMid};border-radius:11px;padding:11px 28px;font-size:15px;font-weight:600;transition:all 0.2s;}
    .btn-secondary:hover{background:${C.greenPale};}
    .btn-danger{background:linear-gradient(135deg,${C.red},#DC2626);color:white;border-radius:11px;padding:12px 28px;font-size:15px;font-weight:600;transition:all 0.2s;}
    .btn-ghost{background:transparent;color:${C.gray600};border:2px solid ${C.gray200};border-radius:11px;padding:9px 20px;font-size:14px;font-weight:500;transition:all 0.2s;}
    .btn-ghost:hover{border-color:${C.greenMid};color:${C.greenMid};background:${C.greenGhost};}
    .field{width:100%;padding:13px 16px;border:2px solid ${C.gray100};border-radius:10px;font-size:15px;background:white;color:${C.dark};transition:border-color 0.2s,box-shadow 0.2s;}
    .field:focus{border-color:${C.greenMid};box-shadow:0 0 0 4px rgba(27,107,58,0.08);}
    .label{display:block;font-size:12px;font-weight:700;color:${C.gray600};margin-bottom:7px;text-transform:uppercase;letter-spacing:0.06em;}
    .badge-pending{background:${C.goldPale};color:${C.gold};padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .badge-confirmed{background:${C.greenPale};color:${C.greenMid};padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    /* ── Responsive ── */
    html,body,#root{width:100%;min-height:100vh;}
    .nav-inner{max-width:1200px;margin:0 auto;padding:0 16px;display:flex;align-items:center;height:66px;gap:12px;flex-wrap:nowrap;}
    .nav-logo-text{display:block;}
    .nav-links{display:flex;gap:4px;}
    .admin-layout{display:flex;min-height:calc(100vh - 66px);}
    .admin-sidebar{width:230px;flex-shrink:0;}
    .admin-main{flex:1;padding:32px 36px;overflow:auto;}
    .form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
    .form-grid-2-book{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
    .register-container{max-width:860px;margin:0 auto;padding:40px 24px;}
    .book-container{max-width:780px;margin:0 auto;padding:40px 24px;}
    .verify-container{min-height:calc(100vh - 66px);display:flex;align-items:center;justify-content:center;padding:24px;}
    .section-card{background:white;border-radius:20px;padding:36px;box-shadow:0 4px 30px rgba(0,0,0,0.07);margin-bottom:24px;}
    .hero-section{min-height:80vh;display:flex;align-items:center;position:relative;overflow:hidden;}
    .hero-content{max-width:1200px;margin:0 auto;padding:80px 24px;position:relative;z-index:1;}
    @media(max-width:900px){
      .admin-sidebar{width:200px;}
      .admin-main{padding:20px 18px;}
      .form-grid-2{grid-template-columns:1fr;}
      .form-grid-2-book{grid-template-columns:1fr;}
    }
    @media(max-width:700px){
      .admin-layout{flex-direction:column;}
      .admin-sidebar{width:100%;flex-direction:row;}
      .admin-sidebar aside{width:100%!important;flex-direction:column;}
      .admin-main{padding:16px 12px;}
      .section-card{padding:20px 16px;border-radius:14px;}
      .register-container{padding:20px 12px;}
      .book-container{padding:20px 12px;}
      .nav-links{display:none;}
      .nav-logo-text{display:none;}
      .hero-content{padding:48px 16px;}
      .hero-section{min-height:60vh;}
      .form-grid-2{grid-template-columns:1fr;}
      .form-grid-2-book{grid-template-columns:1fr;}
      .verify-container{padding:12px;}
    }
    @media(max-width:480px){
      .admin-main{padding:12px 8px;}
      .section-card{padding:16px 12px;}
      .register-container,.book-container{padding:12px 8px;}
    }
    .badge-cancelled{background:${C.redPale};color:${C.red};padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .badge-completed{background:${C.bluePale};color:${C.blue};padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .badge-no_show{background:#F3F4F6;color:#6B7280;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .badge-rescheduled{background:#FDF4FF;color:#7C3AED;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .navlink{padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;color:${C.gray600};background:transparent;border:none;transition:all 0.2s;}
    .navlink:hover,.navlink.active{background:${C.greenPale};color:${C.greenMid};}
    .navlink.active{font-weight:700;}
    .slot-btn{padding:10px 16px;border:2px solid ${C.gray100};border-radius:9px;font-size:13px;font-weight:500;background:white;transition:all 0.2s;cursor:pointer;color:${C.dark};}
    .slot-btn:hover:not(.booked){border-color:${C.greenMid};background:${C.greenPale};color:${C.greenMid};}
    .slot-btn.selected{border-color:${C.greenMid};background:${C.greenMid};color:white;}
    .slot-btn.booked{background:${C.gray50};color:${C.gray400};cursor:not-allowed;text-decoration:line-through;border-color:${C.gray100};}
    .date-btn{padding:14px 10px;border:2px solid ${C.gray100};border-radius:11px;text-align:center;cursor:pointer;transition:all 0.2s;background:white;}
    .date-btn:hover{border-color:${C.greenMid};background:${C.greenPale};}
    .date-btn.selected{border-color:${C.greenMid};background:${C.greenMid};color:white;}
    .skeleton{background:linear-gradient(90deg,${C.gray100} 25%,${C.gray50} 50%,${C.gray100} 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px;}
  `}</style>
);

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
const Logo = ({ size = 200}) => (
  <img
    src="data:image/png;base64,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"
    alt="مجمع القدس الطبي"
    width={size}
    height={size}
    style={{ objectFit: "contain" }}
  />
);

// ─── SVG Icon Library (Heroicons-style) ──────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", style = {} }) => {
  const paths = {
    // Nav & UI
    home:         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    calendar:     <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
    users:        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
    hospital:     <><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></>,
    chartBar:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
    cog:          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    logout:       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
    user:         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    lock:         <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
    // Forms & Verification
    idCard:       <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />,
    passport:     <><rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8zM8 12h8M12 8v8" /></>,
    phone:        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
    email:        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    location:     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
    // Medical
    heart:        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
    stethoscope:  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9a3 3 0 100 6 3 3 0 000-6zm6 0a3 3 0 100 6 3 3 0 000-6zm-3-6v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M1 12h3m16 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />,
    bolt:         <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
    ticket:       <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75a3 3 0 010 5.25v.75m-9-6.75v.75a3 3 0 000 5.25v.75m-3 4.5h15M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75z" />,
    check:        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    xmark:        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    warning:      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    clock:        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
    arrowRight:   <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />,
    chevronLeft:  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />,
    printer:      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />,
    download:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    blood:        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 4.15-7 7.08-7 9.5a7 7 0 0014 0c0-2.42-2.03-5.35-7-9.5z" />,
    emergency:    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
    search:       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />,
    plus:         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    hourglass:    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    star:         <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
    eye:          <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
    flag:         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} style={{ display: "inline-block", flexShrink: 0, ...style }}>
      {paths[name] || <circle cx="12" cy="12" r="9" />}
    </svg>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 18, color = "white" }) => (
  <span style={{ width: size, height: size, border: `2.5px solid ${color}40`, borderTopColor: color, borderRadius: "50%", display: "inline-block", animation: "spin 0.75s linear infinite", flexShrink: 0 }} />
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skel = ({ h = 20, w = "100%" }) => <div className="skeleton" style={{ height: h, width: w }} />;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genRef = () => "QMC-" + new Date().getFullYear() + "-" + String(Math.floor(1000 + Math.random() * 9000));
const getAvailDates = (days = 21) => {
  const out = [];
  const today = new Date();
  for (let i = 1; i <= days * 2 && out.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow !== 5 && dow !== 6) out.push(d); // skip Fri/Sat (Gulf weekend)
  }
  return out;
};
const fmt = (d, lang) => new Date(d).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = parseInt(h); return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`; };
const statusBadge = (s) => <span className={`badge-${s}`}>{s?.replace("_", " ")}</span>;

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ lang, setLang, view, setView, isAdmin, setIsAdmin, adminUser }) => {
  const t = T[lang];
  return (
    <nav style={{ background: "white", borderBottom: `1px solid ${C.gray100}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}>
      <div className="nav-inner">
        <button onClick={() => { setView("home"); setIsAdmin(false); }} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <Logo size={50} />
          <div className="nav-logo-text" style={{ textAlign: "start" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark, lineHeight: 1.1 }}>{t.sysName}</div>
            <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500 }}>{t.sysSub}</div>
          </div>
        </button>

        <div style={{ flex: 1 }} />

        {!isAdmin && (
          <div className="nav-links">
            <button className={`navlink ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}>{t.nav.home}</button>
            <button className={`navlink ${view === "verify" ? "active" : ""}`} onClick={() => setView("verify")}>{t.nav.appointments}</button>
          </div>
        )}

        <button className="btn-ghost" style={{ padding: "7px 12px", fontSize: 13, flexShrink: 0 }} onClick={() => setLang(lang === "en" ? "ar" : "en")}>{t.switchLang}</button>

        {!isAdmin ? (
          <button className="btn-primary" style={{ padding: "9px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} onClick={() => setView("adminLogin")}><Icon name="lock" size={14} color="white" />{t.nav.admin}</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.gray600 }}><Icon name="user" size={14} color={C.gray400} /><span style={{ display: "none" }}>{adminUser?.full_name || "Admin"}</span><span style={{ display: "inline" }}>{(adminUser?.full_name || "Admin").split(" ")[0]}</span></div>
            <button className="btn-ghost" style={{ padding: "7px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }} onClick={() => { setIsAdmin(false); setView("home"); }}><Icon name="logout" size={14} color={C.gray600} />{t.nav.logout}</button>
          </div>
        )}
      </div>
    </nav>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ lang, setView }) => {
  const t = T[lang];
  const isRtl = lang === "ar";
  const ff = isRtl ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";

  return (
    <div style={{ fontFamily: ff }}>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.greenMid} 60%, ${C.greenLight} 100%)`, minHeight: "80vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(45,143,86,0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(185,28,28,0.15) 0%, transparent 40%)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1 }}>
          <div className="fadeUp" style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "7px 18px", marginBottom: 28, border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", display: "inline-block", boxShadow: "0 0 8px #4ADE80" }} />
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>Al-Quds Medical Complex • مجمع القدس الطبي</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: 12 }}>
              {t.home.welcome}<br /><span style={{ color: "#86EFAC" }}>{t.home.welcome2}</span>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, lineHeight: 1.7, maxWidth: 540 }}>{t.home.sub}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setView("verify")}>{t.home.getStarted} →</button>
              <button style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 11, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }} onClick={() => setView("verify")}>{t.home.manageAppts}</button>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", opacity: 0.06, pointerEvents: "none", userSelect: "none" }}><Icon name="hospital" size={220} color="white" /></div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {[
            { iconName: "bolt", title: t.home.f1t, desc: t.home.f1d, color: C.goldPale, accent: C.gold },
            { iconName: "calendar", title: t.home.f2t, desc: t.home.f2d, color: C.greenPale, accent: C.greenMid },
            { iconName: "ticket", title: t.home.f3t, desc: t.home.f3d, color: C.bluePale, accent: C.blue },
          ].map((f, i) => (
            <div key={i} className="card" style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 20px rgba(0,0,0,0.06)", animationDelay: `${i * 0.1}s` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><Icon name={f.iconName} size={26} color={f.accent} /></div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: C.gray600, lineHeight: 1.65, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── VERIFY PAGE ──────────────────────────────────────────────────────────────
const VerifyPage = ({ lang, setView, setPatientData }) => {
  const t = T[lang];
  const [idType] = useState("national");
  const [idNum, setIdNum] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | {found, patient}
  const [err, setErr] = useState("");

  const handleVerify = async () => {
    if (!idNum) { setErr(t.errors.required); return; }
    setLoading(true); setErr("");
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("national_id", idNum)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPatientData(data);
        setView("book");
        return;
      } else {
        setResult({ found: false });
      }
    } catch (e) {
      setErr(t.errors.network);
    } finally {
      setLoading(false);
    }
  };

  const ff = lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";
  return (
    <div className="fadeUp" style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: `linear-gradient(160deg, ${C.offWhite} 60%, ${C.greenPale})`, fontFamily: ff }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }}>
          <div style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`, padding: "36px 40px", textAlign: "center" }}>
            <Logo size={50} />
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "white", marginTop: 16, marginBottom: 8 }}>{t.verify.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15 }}>{t.verify.sub}</p>
          </div>
          <div style={{ padding: "36px 40px" }}>
            {/* ID Type - National only */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "12px 16px", background: C.greenPale, borderRadius: 12, border: `1.5px solid ${C.greenMid}20` }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="idCard" size={18} color="white" /></div>
              <div>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 13 }}>{t.verify.nationalId}</div>
                <div style={{ color: C.gray600, fontSize: 11 }}>10-digit national ID number</div>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="label">{t.verify.nationalId}</label>
              <div style={{ position: "relative" }}>
                <input className="field" placeholder="e.g. 1234567890" value={idNum} onChange={e => { setIdNum(e.target.value); setResult(null); setErr(""); }} style={{ paddingLeft: 44 }} />
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Icon name="idCard" size={18} color={C.gray400} /></div>
              </div>
            </div>


            {err && <div style={{ background: C.redPale, color: C.red, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="warning" size={16} color={C.red} />{err}</div>}

            {result?.found && (
              <div className="fadeIn" style={{ background: C.greenPale, border: `2px solid ${C.greenMid}`, borderRadius: 14, padding: 20, marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={24} color="white" /></div></div>
                <div style={{ fontWeight: 700, color: C.greenMid, fontSize: 17, marginBottom: 4 }}>{t.verify.found}</div>
                <div style={{ color: C.gray600, fontSize: 14, marginBottom: 16 }}>{t.verify.foundSub}</div>
                <button className="btn-primary" onClick={() => setView("book")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{t.verify.continueBook} <Icon name="arrowRight" size={16} color="white" /></button>
              </div>
            )}

            {result && !result.found && (
              <div className="fadeIn" style={{ background: C.redPale, border: `2px solid ${C.red}`, borderRadius: 14, padding: 20, marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="xmark" size={24} color="white" /></div></div>
                <div style={{ fontWeight: 700, color: C.red, fontSize: 17, marginBottom: 4 }}>{t.verify.notFound}</div>
                <div style={{ color: C.gray600, fontSize: 14, marginBottom: 16 }}>{t.verify.notFoundSub}</div>
                <button className="btn-danger" onClick={() => setView("register")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{t.verify.createRecord} <Icon name="arrowRight" size={16} color="white" /></button>
              </div>
            )}

            {!result && (
              <button className="btn-primary" onClick={handleVerify} disabled={loading} style={{ width: "100%", fontSize: 16, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {loading ? <><Spinner />{t.verify.verifying}</> : <>{t.verify.verify} <Icon name="arrowRight" size={16} color="white" /></>}
              </button>
            )}

            <p style={{ textAlign: "center", color: C.gray400, fontSize: 12, marginTop: 16 }}>
              Demo: ID <strong>1234567890</strong> · DOB <strong>1990-05-15</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FORM FIELD (standalone to prevent focus loss) ────────────────────────────
// IMPORTANT: This must be defined OUTSIDE RegisterPage. If defined inside,
// React recreates the component on every render, causing the input to lose focus.
const FormField = ({ label, fieldKey, form, upd, type = "text", placeholder = "", required = false, icon = null }) => (
  <div>
    <label className="label">{label}{required && <span style={{ color: C.red }}>*</span>}</label>
    <div style={{ position: "relative" }}>
      {icon && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }}><Icon name={icon} size={17} color={C.gray400} /></div>}
      <input
        type={type}
        className="field"
        placeholder={placeholder}
        value={form[fieldKey]}
        onChange={e => upd(fieldKey, e.target.value)}
        style={icon ? { paddingLeft: 44 } : {}}
      />
    </div>
  </div>
);

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
const RegisterPage = ({ lang, setView, setPatientData }) => {
  const t = T[lang];
  const ff = lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";
  const [form, setForm] = useState({ fullName: "", fullNameAr: "", gender: "", dob: "", nationality: "", nationalId: "", phone: "", email: "", address: "", chronic: "", allergies: "", bloodType: "", emergency: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.gender || !form.dob) { setErr(t.errors.required); return; }
    setLoading(true); setErr("");
    try {
      const payload = {
        id_type: "national_id",
        national_id: form.nationalId || null,
        full_name_en: form.fullName,
        full_name_ar: form.fullNameAr || form.fullName,
        gender: form.gender,
        date_of_birth: form.dob,
        nationality: form.nationality || null,
        phone: form.phone,
        email: form.email || null,
        address_en: form.address || null,
        chronic_diseases: form.chronic || null,
        allergies: form.allergies || null,
        blood_type: form.bloodType || null,
        emergency_contact_name: form.emergency || null,
      };
      const { data, error } = await supabase.from("patients").insert([payload]).select().single();
      if (error) throw error;
      // تأكد من حفظ البيانات الكاملة مع الاسم الصحيح
      setPatientData({ ...data, full_name_en: form.fullName, full_name_ar: form.fullNameAr || form.fullName });
      setSuccess(true);
      setTimeout(() => setView("book"), 2000);
    } catch (e) {
      // If patient already exists, fetch their record and send them to booking
      if (e.code === "23505" || (e.message && e.message.includes("idx_patients_nid"))) {
        try {
          const { data: existing } = await supabase
            .from("patients")
            .select("*")
            .eq("national_id", form.nationalId)
            .maybeSingle();
          if (existing) {
            setPatientData(existing);
            setSuccess(true);
            setTimeout(() => setView("book"), 2000);
            return;
          }
        } catch { }
        // السجل موجود - وجهه مباشرة للحجز
        if (!existing) {
          setErr("A record with this National ID already exists. Please verify your identity instead.");
        }
      } else {
        setErr(e.message || t.errors.network);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="fadeIn" style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.greenPale, border: `3px solid ${C.greenMid}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulse 1s ease" }}><Icon name="check" size={44} color={C.greenMid} /></div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: C.greenMid, marginBottom: 12 }}>{t.register.success}</h2>
        <p style={{ color: C.gray600 }}>{t.register.successSub}</p>
      </div>
    </div>
  );

  return (
    <div className="fadeUp register-container" style={{ fontFamily: ff }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 700, color: C.dark, marginBottom: 8 }}>{t.register.title}</h1>
        <p style={{ color: C.gray600, fontSize: 16 }}>{t.register.sub}</p>
      </div>

      {err && <div style={{ background: C.redPale, color: C.red, borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="warning" size={16} color={C.red} />{err}</div>}

      <div style={{ background: "white", borderRadius: 20, padding: 36, boxShadow: "0 4px 30px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, color: C.dark, fontSize: 17, marginBottom: 24, paddingBottom: 14, borderBottom: `2px solid ${C.gray50}` }}>Personal Information • المعلومات الشخصية</h3>
        <div className="form-grid-2">
          <div style={{ gridColumn: "1/-1" }}><FormField label={t.register.fullName} fieldKey="fullName" form={form} upd={upd} placeholder="Full name as in ID" required icon="user" /></div>
          <div style={{ gridColumn: "1/-1" }}><FormField label={t.register.fullName + " (AR)"} fieldKey="fullNameAr" form={form} upd={upd} placeholder="الاسم بالعربية" icon="user" /></div>
          <div>
            <label className="label">{t.register.gender}<span style={{ color: C.red }}>*</span></label>
            <select className="field" value={form.gender} onChange={e => upd("gender", e.target.value)}>
              <option value="">Select / اختر</option>
              <option value="male">{t.register.male}</option>
              <option value="female">{t.register.female}</option>
            </select>
          </div>
          <FormField label={t.register.dob} fieldKey="dob" form={form} upd={upd} type="date" required icon="calendar" />
          <FormField label={t.register.nationality} fieldKey="nationality" form={form} upd={upd} placeholder="e.g. Saudi" icon="flag" />
          <FormField label={t.register.nationalId} fieldKey="nationalId" form={form} upd={upd} placeholder="10-digit national ID" icon="idCard" />
          <FormField label={t.register.phone} fieldKey="phone" form={form} upd={upd} type="tel" placeholder="+966 5X XXXXXXX" required icon="phone" />
          <FormField label={t.register.email} fieldKey="email" form={form} upd={upd} type="email" placeholder="you@email.com" icon="email" />
          <div style={{ gridColumn: "1/-1" }}><FormField label={t.register.address} fieldKey="address" form={form} upd={upd} placeholder="City, Street, Neighborhood" icon="location" /></div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 20, padding: 36, boxShadow: "0 4px 30px rgba(0,0,0,0.07)", marginBottom: 28 }}>
        <h3 style={{ fontWeight: 700, color: C.dark, fontSize: 17, marginBottom: 6, paddingBottom: 14, borderBottom: `2px solid ${C.gray50}` }}>{t.register.optional} <span style={{ fontWeight: 400, color: C.gray400, fontSize: 13 }}>(Optional)</span></h3>
        <div className="form-grid-2" style={{ marginTop: 20 }}>
          <FormField label={t.register.chronic} fieldKey="chronic" form={form} upd={upd} placeholder="e.g. Diabetes, Hypertension" icon="heart" />
          <FormField label={t.register.allergies} fieldKey="allergies" form={form} upd={upd} placeholder="e.g. Penicillin, Pollen" icon="warning" />
          <div>
            <label className="label">{t.register.bloodType}</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }}><Icon name="blood" size={17} color={C.gray400} /></div>
              <select className="field" value={form.bloodType} onChange={e => upd("bloodType", e.target.value)} style={{ paddingLeft: 44 }}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <FormField label={t.register.emergency} fieldKey="emergency" form={form} upd={upd} placeholder="Contact Name" icon="emergency" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, justifyContent: "flex-end" }}>
        <button className="btn-secondary" onClick={() => setView("verify")}>{t.register.back}</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ fontSize: 15, padding: "13px 36px", display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? <><Spinner />{t.register.submit}...</> : `${t.register.submit} →`}
        </button>
      </div>
    </div>
  );
};

// ─── STEP BAR ─────────────────────────────────────────────────────────────────
const StepBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, justifyContent: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all 0.3s", background: i < current ? C.greenMid : i === current ? C.greenMid : C.gray100, color: i <= current ? "white" : C.gray400, border: i === current ? `3px solid ${C.greenLight}` : "none", boxShadow: i === current ? `0 0 0 4px ${C.greenPale}` : "none" }}>
          {i < current ? "✓" : i + 1}
        </div>
        {i < total - 1 && <div style={{ width: 40, height: 2, borderRadius: 1, background: i < current ? C.greenMid : C.gray100, transition: "background 0.3s" }} />}
      </div>
    ))}
  </div>
);

// ─── QR Code ──────────────────────────────────────────────────────────────────
const QRCode = ({ value, size = 180 }) => {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value || "")}&color=0A1A0F&bgcolor=FFFFFF&margin=2`;
  return (
    <div style={{ padding: 12, background: "white", borderRadius: 12, border: `3px solid ${C.greenMid}`, display: "inline-block" }}>
      <img src={url} alt="QR Code" width={size} height={size} style={{ display: "block", borderRadius: 6 }} />
    </div>
  );
};

// ─── BOOK PAGE ────────────────────────────────────────────────────────────────
const BookPage = ({ lang, patientData, setView }) => {
  const t = T[lang];
  const ff = lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";
  const [step, setStep] = useState(0);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [centers, setCenters] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [booking, setBooking] = useState({ countryId: "", cityId: "", centerId: "", specialtyId: "", doctorId: "", date: null, slotId: "", slotTime: "" });
  const [loading, setLoading] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [bookRef] = useState(genRef);
  const [submitLoading, setSubmitLoading] = useState(false);

  const setLoad = (k, v) => setLoading(l => ({ ...l, [k]: v }));
  const upd = (k, v) => setBooking(b => ({ ...b, [k]: v }));

  // Load countries
  useEffect(() => {
    supabase.from("countries").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setCountries(data || []));
  }, []);

  // Load cities on country change
  useEffect(() => {
    if (!booking.countryId) { setCities([]); return; }
    setLoad("cities", true);
    supabase.from("cities").select("*").eq("country_id", booking.countryId).eq("is_active", true).order("sort_order")
      .then(({ data }) => { setCities(data || []); setLoad("cities", false); });
  }, [booking.countryId]);

  // Load centers on city change
  useEffect(() => {
    if (!booking.cityId) { setCenters([]); return; }
    setLoad("centers", true);
    supabase.from("medical_centers").select("*").eq("city_id", booking.cityId).eq("status", "active").order("name_en")
      .then(({ data }) => { setCenters(data || []); setLoad("centers", false); });
  }, [booking.cityId]);

  // Load specialties on center change
  useEffect(() => {
    if (!booking.centerId) { setSpecialties([]); return; }
    setLoad("specialties", true);
    supabase.from("center_specialties").select("specialty_id, specialties(*)").eq("center_id", booking.centerId)
      .then(({ data }) => { setSpecialties((data || []).map(d => d.specialties).filter(Boolean)); setLoad("specialties", false); });
  }, [booking.centerId]);

  // Load doctors on specialty+center change
  useEffect(() => {
    if (!booking.specialtyId || !booking.centerId) { setDoctors([]); return; }
    setLoad("doctors", true);
    supabase.from("doctors").select("*").eq("center_id", booking.centerId).eq("specialty_id", booking.specialtyId).eq("status", "active")
      .then(({ data }) => { setDoctors(data || []); setLoad("doctors", false); });
  }, [booking.specialtyId, booking.centerId]);

  // Load slots on doctor+date change
  useEffect(() => {
    if (!booking.doctorId || !booking.date) { setSlots([]); return; }
    setLoad("slots", true);
    const dateStr = booking.date.toISOString().split("T")[0];
    supabase.from("appointment_slots").select("*")
      .eq("doctor_id", booking.doctorId).eq("slot_date", dateStr)
      .order("start_time")
      .then(({ data }) => { setSlots(data || []); setLoad("slots", false); });
  }, [booking.doctorId, booking.date]);

  const avDates = getAvailDates();

  const canNext = [
    booking.countryId && booking.cityId && booking.centerId && booking.specialtyId && booking.doctorId,
    booking.date && booking.slotId,
    true,
  ];

  const handleConfirm = async () => {
    if (!patientData) return;
    setSubmitLoading(true);
    try {
      const center = centers.find(c => c.id == booking.centerId);
      const doc = doctors.find(d => d.id == booking.doctorId);
      const spec = specialties.find(s => s.id == booking.specialtyId);
      const { error } = await supabase.from("appointments").insert([{
        patient_id: patientData.id,
        doctor_id: Number(booking.doctorId),
        center_id: Number(booking.centerId),
        specialty_id: Number(booking.specialtyId),
        slot_id: booking.slotId ? Number(booking.slotId) : null,
        appointment_date: booking.date.toISOString().split("T")[0],
        start_time: booking.slotTime,
        status: "pending",
        type: spec?.name_en || "General",
        notes: null,
      }]);
      if (error) throw error;
      // Mark slot as booked
      if (booking.slotId) {
        await supabase.from("appointment_slots").update({ status: "booked" }).eq("id", booking.slotId);
      }
      setConfirmed(true);
    } catch (e) {
      alert(e.message || t.errors.network);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (confirmed) {
    const center = centers.find(c => c.id == booking.centerId);
    const doc = doctors.find(d => d.id == booking.doctorId);
    const spec = specialties.find(s => s.id == booking.specialtyId);
    return (
      <div className="fadeUp" style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px", textAlign: "center", fontFamily: ff }}>
        <div style={{ background: "white", borderRadius: 24, padding: 44, boxShadow: "0 24px 64px rgba(0,0,0,0.10)", border: `3px solid ${C.greenMid}` }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenPale, border: `3px solid ${C.greenMid}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulse 0.8s ease" }}><Icon name="check" size={40} color={C.greenMid} /></div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: C.greenMid, marginBottom: 8 }}>{t.book.confirmed}</h2>
          <p style={{ color: C.gray600, marginBottom: 28 }}>Your appointment has been successfully booked • تم حجز موعدك بنجاح</p>
          <div style={{ background: C.gray50, borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.gray400, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.book.ref}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.dark, letterSpacing: "0.06em", fontFamily: "monospace" }}>{bookRef}</div>
          </div>
          <QRCode value={[
            `REF:${bookRef}`,
            `Patient:${patientData?.full_name_ar || patientData?.full_name_en || ""}`,
            `Center:${center ? center.name_en : ""}`,
            `Doctor:${doc ? doc.full_name_en : ""}`,
            `Date:${booking.date ? booking.date.toISOString().split("T")[0] : ""}`,
            `Time:${booking.slotTime || ""}`,
          ].join(" | ")} />
          <div style={{ marginTop: 24, background: C.greenPale, borderRadius: 14, padding: 20, textAlign: lang === "ar" ? "right" : "left" }}>
            {[
              { iconName: "user",        val: patientData?.full_name_ar || patientData?.full_name_en || "Patient" },
              { iconName: "hospital",    val: center ? (lang === "ar" ? center.name_ar : center.name_en) : "" },
              { iconName: "stethoscope", val: spec ? (lang === "ar" ? spec.name_ar : spec.name_en) : "" },
              { iconName: "user",        val: doc ? `${doc.title_en} ${lang === "ar" ? doc.full_name_ar : doc.full_name_en}` : "" },
              { iconName: "calendar",    val: booking.date ? fmt(booking.date, lang) : "" },
              { iconName: "clock",       val: booking.slotTime ? fmtTime(booking.slotTime) : "" },
            ].map(({ iconName, val }) => val ? (
              <div key={iconName + val} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 15, color: C.dark, alignItems: "center" }}>
                <Icon name={iconName} size={16} color={C.greenMid} /><span style={{ fontWeight: 500 }}>{val}</span>
              </div>
            ) : null)}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => window.print()}><Icon name="printer" size={16} color="white" />{t.book.print}</button>
            <button className="btn-secondary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setView("home")}>{t.book.newBooking}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fadeUp book-container" style={{ fontFamily: ff }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{t.book.title}</h1>
        <p style={{ color: C.gray400, fontSize: 14 }}>{t.book.step} {step + 1} {t.book.of} 3</p>
      </div>
      <StepBar current={step} total={3} />

      <div style={{ background: "white", borderRadius: 20, padding: 36, boxShadow: "0 4px 30px rgba(0,0,0,0.07)", minHeight: 340 }}>

        {/* Step 0: Location & Doctor */}
        {step === 0 && (
          <div className="fadeIn form-grid-2-book">
            <div style={{ gridColumn: "1/-1" }}>
              <label className="label">{t.book.country}</label>
              <select className="field" value={booking.countryId} onChange={e => { upd("countryId", e.target.value); upd("cityId", ""); upd("centerId", ""); upd("specialtyId", ""); upd("doctorId", ""); }}>
                <option value="">-- {t.book.country} --</option>
                {countries.map(c => <option key={c.id} value={c.id}>{lang === "ar" ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t.book.city}</label>
              <select className="field" value={booking.cityId} onChange={e => { upd("cityId", e.target.value); upd("centerId", ""); upd("specialtyId", ""); upd("doctorId", ""); }} disabled={!booking.countryId}>
                <option value="">-- {loading.cities ? "..." : t.book.city} --</option>
                {cities.map(c => <option key={c.id} value={c.id}>{lang === "ar" ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t.book.center}</label>
              <select className="field" value={booking.centerId} onChange={e => { upd("centerId", e.target.value); upd("specialtyId", ""); upd("doctorId", ""); }} disabled={!booking.cityId}>
                <option value="">-- {loading.centers ? "..." : t.book.center} --</option>
                {centers.map(c => <option key={c.id} value={c.id}>{lang === "ar" ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t.book.specialty}</label>
              <select className="field" value={booking.specialtyId} onChange={e => { upd("specialtyId", e.target.value); upd("doctorId", ""); }} disabled={!booking.centerId}>
                <option value="">-- {loading.specialties ? "..." : t.book.specialty} --</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{lang === "ar" ? s.name_ar : s.name_en}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label className="label">{t.book.doctor}</label>
              {loading.doctors ? <div style={{ display: "flex", gap: 8, flexDirection: "column" }}><Skel h={44} /></div> :
                doctors.length === 0 && booking.specialtyId ? (
                  <div style={{ padding: 14, background: C.gray50, borderRadius: 10, color: C.gray400, fontSize: 14 }}>No doctors available for this specialty at this center.</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {doctors.map(d => (
                      <div key={d.id} onClick={() => upd("doctorId", d.id)} style={{ border: `2px solid ${booking.doctorId == d.id ? C.greenMid : C.gray100}`, borderRadius: 12, padding: 16, cursor: "pointer", background: booking.doctorId == d.id ? C.greenPale : "white", transition: "all 0.2s" }}>
                        <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{d.title_en} {lang === "ar" ? d.full_name_ar : d.full_name_en}</div>
                        <div style={{ fontSize: 12, color: C.gray400, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="star" size={12} color={C.gold} /> {d.rating} · {d.experience_years}y exp · {d.consultation_fee} SAR</div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="fadeIn">
            <div style={{ marginBottom: 28 }}>
              <label className="label">{t.book.date}</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
                {avDates.map((d, i) => (
                  <div key={i} className={`date-btn ${booking.date?.toDateString() === d.toDateString() ? "selected" : ""}`} onClick={() => { upd("date", d); upd("slotId", ""); upd("slotTime", ""); }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, opacity: 0.7 }}>{d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en", { weekday: "short" })}</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{d.getDate()}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en", { month: "short" })}</div>
                  </div>
                ))}
              </div>
            </div>

            {booking.date && (
              <div>
                <label className="label">{t.book.time}</label>
                {loading.slots ? (
                  <p style={{ color: C.gray400, fontSize: 14 }}>{t.book.loadingSlots}</p>
                ) : slots.length === 0 ? (
                  <div style={{ padding: 16, background: C.gray50, borderRadius: 10, color: C.gray400, fontSize: 14 }}>
                    {t.book.noSlots} — Generating standard slots...
                    {/* Fallback time grid when no slots exist in DB */}
                    <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                      {["08:00","08:30","09:00","09:30","10:00","10:30","11:00","13:00","13:30","14:00","14:30","15:00","15:30"].map(t2 => (
                        <button key={t2} className={`slot-btn ${booking.slotTime === t2 ? "selected" : ""}`} onClick={() => { upd("slotId", null); upd("slotTime", t2); }}>{fmtTime(t2 + ":00")}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                    {slots.map(s => (
                      <button key={s.id} className={`slot-btn ${s.status === "booked" || s.status === "blocked" ? "booked" : ""} ${booking.slotId == s.id ? "selected" : ""}`} disabled={s.status === "booked" || s.status === "blocked"} onClick={() => { upd("slotId", s.id); upd("slotTime", s.start_time); }}>
                        {fmtTime(s.start_time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review & Confirm */}
        {step === 2 && (
          <div className="fadeIn">
            <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 20, fontSize: 18 }}>{t.book.review}</h3>
            {(() => {
              const country = countries.find(c => c.id == booking.countryId);
              const city = cities.find(c => c.id == booking.cityId);
              const center = centers.find(c => c.id == booking.centerId);
              const spec = specialties.find(s => s.id == booking.specialtyId);
              const doc = doctors.find(d => d.id == booking.doctorId);
              return (
                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    { iconName: "user", label: t.book.confirmInfo, val: patientData?.full_name_en || "Patient" },
                    { iconName: "location", label: "Location", val: `${city ? (lang === "ar" ? city.name_ar : city.name_en) : ""}, ${country ? (lang === "ar" ? country.name_ar : country.name_en) : ""}` },
                    { iconName: "hospital", label: t.book.center, val: center ? (lang === "ar" ? center.name_ar : center.name_en) : "" },
                    { iconName: "stethoscope", label: t.book.specialty, val: spec ? (lang === "ar" ? spec.name_ar : spec.name_en) : "" },
                    { iconName: "user", label: t.book.doctor, val: doc ? `${doc.title_en} ${lang === "ar" ? doc.full_name_ar : doc.full_name_en}` : "" },
                    { iconName: "calendar", label: t.book.date, val: booking.date ? fmt(booking.date, lang) : "" },
                    { iconName: "clock", label: t.book.time, val: booking.slotTime ? fmtTime(booking.slotTime) : "" },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", gap: 14, background: C.gray50, borderRadius: 12, padding: "14px 18px", alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={row.iconName} size={18} color={C.greenMid} /></div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{row.label}</div>
                        <div style={{ fontWeight: 600, color: C.dark, fontSize: 15 }}>{row.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button className="btn-secondary" onClick={() => step === 0 ? setView("verify") : setStep(s => s - 1)}>{t.book.back}</button>
        {step < 2 ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}>
            {t.book.next} →
          </button>
        ) : (
          <button className="btn-primary" onClick={handleConfirm} disabled={submitLoading} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {submitLoading ? <><Spinner />{t.book.confirm}...</> : `${t.book.confirm} ✓`}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN LOGIN PAGE ─────────────────────────────────────────────────────────
const AdminLoginPage = ({ lang, setView, setIsAdmin, setAdminUser }) => {
  const t = T[lang];
  const ff = lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    if (!form.username || !form.password) { setErr(t.errors.required); return; }
    setLoading(true); setErr("");
    try {
      const { data, error } = await supabase.from("admin_users").select("*").eq("username", form.username).eq("is_active", true).maybeSingle();
      if (!error && data) {
        setAdminUser(data); setIsAdmin(true); setView("admin"); return;
      }
      if (form.username === "superadmin") {
        setAdminUser({ full_name: "Super Admin", username: "superadmin", role: "superadmin" });
        setIsAdmin(true); setView("admin"); return;
      }
      setErr(t.login.error);
    } catch (e) {
      if (form.username === "superadmin") {
        setAdminUser({ full_name: "Super Admin", username: "superadmin", role: "superadmin" });
        setIsAdmin(true); setView("admin"); return;
      }
      setErr(t.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fadeUp" style={{ minHeight: "calc(100vh - 66px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: `linear-gradient(160deg, ${C.offWhite} 60%, ${C.greenPale})`, fontFamily: ff }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }}>
          <div style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.greenMid})`, padding: "36px 40px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon name="lock" size={30} color="white" /></div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 6 }}>{t.login.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{t.sysName}</p>
          </div>
          <div style={{ padding: "32px 36px" }}>
            {err && <div style={{ background: C.redPale, color: C.red, borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="warning" size={16} color={C.red} />{err}</div>}
            <div style={{ marginBottom: 18 }}>
              <label className="label">{t.login.username}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Icon name="user" size={17} color={C.gray400} /></div>
                <input className="field" placeholder="superadmin" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={{ paddingLeft: 44 }} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">{t.login.password}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Icon name="lock" size={17} color={C.gray400} /></div>
                <input type="password" className="field" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ paddingLeft: 44 }} />
              </div>
            </div>
            <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: "100%", fontSize: 16, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><Spinner />{t.login.logging}</> : t.login.login}
            </button>
            <p style={{ textAlign: "center", color: C.gray400, fontSize: 12, marginTop: 16 }}>Demo: username <strong>superadmin</strong> · any password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = ({ lang, adminUser, setIsAdmin, setView }) => {
  const t = T[lang];
  const ff = lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apptFilter, setApptFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [apptPage, setApptPage] = useState(0);
  const PAGE = 10;

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [ptRes, apptRes, todayRes, pendingRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", new Date().toISOString().split("T")[0]),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({ patients: ptRes.count || 0, appointments: apptRes.count || 0, today: todayRes.count || 0, pending: pendingRes.count || 0 });
    } catch { }
    setLoading(false);
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase.from("appointments").select(`
        id, reference_no, appointment_date, start_time, type, status, created_at,
        patients(full_name_en, full_name_ar),
        medical_centers(name_en, name_ar),
        doctors(full_name_en, full_name_ar, title_en)
      `).order("appointment_date", { ascending: false }).range(apptPage * PAGE, (apptPage + 1) * PAGE - 1);
      if (apptFilter !== "all") q = q.eq("status", apptFilter);
      const { data } = await q;
      setAppointments(data || []);
    } catch { }
    setLoading(false);
  }, [apptFilter, apptPage]);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase.from("patients").select("*").order("created_at", { ascending: false }).limit(50);
      if (searchTerm) q = q.ilike("full_name_en", `%${searchTerm}%`);
      const { data } = await q;
      setPatients(data || []);
    } catch { }
    setLoading(false);
  }, [searchTerm]);

  const loadCenters = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("medical_centers").select("*, cities(name_en, name_ar)").order("name_en");
    setCenters(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { if (section === "appointments") loadAppointments(); }, [section, loadAppointments]);
  useEffect(() => { if (section === "patients") loadPatients(); }, [section, loadPatients]);
  useEffect(() => { if (section === "centers") loadCenters(); }, [section, loadCenters]);

  const updateApptStatus = async (id, status) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    loadAppointments();
  };

  const navItems = [
    { key: "dashboard", iconName: "chartBar", label: t.admin.title },
    { key: "appointments", iconName: "calendar", label: t.admin.appointments },
    { key: "patients", iconName: "users", label: t.admin.patients },
    { key: "centers", iconName: "hospital", label: t.admin.centers },
    { key: "reports", iconName: "chartBar", label: t.admin.reports },
    { key: "settings", iconName: "cog", label: t.admin.settings },
  ];

  return (
    <div className="admin-layout" style={{ fontFamily: ff }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ background: C.dark, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 16px 12px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Navigation</div>
          {navItems.map(n => (
            <button key={n.key} onClick={() => setSection(n.key)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: ff, fontSize: 14, fontWeight: section === n.key ? 700 : 500, color: section === n.key ? "white" : "rgba(255,255,255,0.55)", background: section === n.key ? `${C.greenMid}` : "transparent", transition: "all 0.2s", marginBottom: 3, textAlign: lang === "ar" ? "right" : "left" }}>
              <Icon name={n.iconName} size={16} color={section === n.key ? "white" : "rgba(255,255,255,0.55)"} />{n.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{adminUser?.full_name}</div>
            <div style={{ fontSize: 11 }}>{adminUser?.role}</div>
          </div>
          <button className="btn-ghost" style={{ width: "100%", fontSize: 13, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }} onClick={() => { setIsAdmin(false); setView("home"); }}>{t.nav.logout}</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main" style={{ flex: 1, overflow: "auto", background: C.offWhite }}>

        {/* Dashboard */}
        {section === "dashboard" && (
          <div className="fadeIn">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: C.dark, marginBottom: 28 }}>{t.admin.title}</h2>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
                {[1,2,3,4].map(i => <Skel key={i} h={110} />)}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
                {[
                  { label: t.admin.totalPatients, val: stats?.patients ?? "–", iconName: "users", color: C.greenMid },
                  { label: t.admin.totalAppts, val: stats?.appointments ?? "–", iconName: "calendar", color: C.blue },
                  { label: t.admin.todayAppts, val: stats?.today ?? "–", iconName: "hospital", color: C.gold },
                  { label: t.admin.pending, val: stats?.pending ?? "–", iconName: "hourglass", color: C.red },
                ].map(s => (
                  <div key={s.label} className="card" style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: C.dark }}>{s.val.toLocaleString()}</div>
                      </div>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={s.iconName} size={22} color={s.color} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick actions */}
            <div style={{ background: "white", borderRadius: 16, padding: 28, marginBottom: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 18 }}>{t.admin.quickActions}</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { label: t.admin.appointments, iconName: "calendar", s: "appointments" },
                  { label: t.admin.patients, iconName: "users", s: "patients" },
                  { label: t.admin.centers, iconName: "hospital", s: "centers" },
                  { label: t.admin.reports, iconName: "chartBar", s: "reports" },
                ].map(a => (
                  <button key={a.label} onClick={() => setSection(a.s)} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px" }}>
                    <Icon name={a.iconName} size={16} color={C.gray600} /> {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent appointments preview */}
            <RecentAppts lang={lang} t={t} onViewAll={() => setSection("appointments")} />
          </div>
        )}

        {/* Appointments */}
        {section === "appointments" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark }}>{t.admin.appointments}</h2>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["all", "pending", "confirmed", "cancelled", "completed", "no_show"].map(f => (
                  <button key={f} onClick={() => { setApptFilter(f); setApptPage(0); }} style={{ padding: "7px 16px", borderRadius: 8, border: `2px solid ${apptFilter === f ? C.greenMid : C.gray100}`, background: apptFilter === f ? C.greenMid : "white", color: apptFilter === f ? "white" : C.gray600, fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: ff, transition: "all 0.15s" }}>{f === "all" ? "All" : t.status[f]}</button>
                ))}
              </div>
            </div>
            {loading ? <Skel h={300} /> : (
              <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.gray50 }}>
                        {["Reference", t.admin.patient, t.admin.center, t.admin.date, t.admin.time, t.admin.type, t.admin.status, t.admin.actions].map(h => (
                          <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(a => (
                        <tr key={a.id} style={{ borderBottom: `1px solid ${C.gray50}` }} onMouseEnter={e => e.currentTarget.style.background = C.gray50} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                          <td style={{ padding: "13px 14px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.greenMid, whiteSpace: "nowrap" }}>{a.reference_no}</td>
                          <td style={{ padding: "13px 14px", fontWeight: 600, color: C.dark, fontSize: 13 }}>{lang === "ar" ? a.patients?.full_name_ar : a.patients?.full_name_en}</td>
                          <td style={{ padding: "13px 14px", color: C.gray600, fontSize: 12 }}>{lang === "ar" ? a.medical_centers?.name_ar : a.medical_centers?.name_en}</td>
                          <td style={{ padding: "13px 14px", color: C.gray600, fontSize: 12, whiteSpace: "nowrap" }}>{a.appointment_date}</td>
                          <td style={{ padding: "13px 14px", color: C.gray600, fontSize: 12, whiteSpace: "nowrap" }}>{a.start_time ? fmtTime(a.start_time) : "–"}</td>
                          <td style={{ padding: "13px 14px", color: C.gray600, fontSize: 12 }}>{a.type}</td>
                          <td style={{ padding: "13px 14px" }}>{statusBadge(a.status)}</td>
                          <td style={{ padding: "13px 14px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {a.status === "pending" && <button onClick={() => updateApptStatus(a.id, "confirmed")} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.greenMid}`, background: "transparent", color: C.greenMid, fontSize: 12, cursor: "pointer", fontFamily: ff }}>✓</button>}
                              {a.status !== "cancelled" && <button onClick={() => updateApptStatus(a.id, "cancelled")} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.red}`, background: "transparent", color: C.red, fontSize: 12, cursor: "pointer", fontFamily: ff }}>✗</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {appointments.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: C.gray400 }}>No appointments found</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: 16, borderTop: `1px solid ${C.gray50}` }}>
                  <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }} disabled={apptPage === 0} onClick={() => setApptPage(p => p - 1)}>← Prev</button>
                  <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: C.gray600 }}>Page {apptPage + 1}</span>
                  <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }} disabled={appointments.length < PAGE} onClick={() => setApptPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Patients */}
        {section === "patients" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark }}>{t.admin.patients}</h2>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 20, boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
              <input className="field" placeholder={t.admin.search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ maxWidth: 340 }} />
            </div>
            {loading ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>{[1,2,3,4].map(i => <Skel key={i} h={110} />)}</div> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {patients.map(p => (
                  <div key={p.id} className="card" style={{ background: "white", borderRadius: 16, padding: 22, boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${C.greenMid}, ${C.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{(p.full_name_en || "?")[0].toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{lang === "ar" ? p.full_name_ar : p.full_name_en}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: C.gray400 }}>{p.national_id || p.passport_number}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                      {p.blood_type && <span style={{ background: C.redPale, color: C.red, padding: "3px 10px", borderRadius: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="blood" size={11} color={C.red} /> {p.blood_type}</span>}
                      {p.phone && <span style={{ background: C.gray50, color: C.gray600, padding: "3px 10px", borderRadius: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><Icon name="phone" size={11} color={C.gray400} /> {p.phone}</span>}
                      <span style={{ background: C.greenPale, color: C.greenMid, padding: "3px 10px", borderRadius: 8, fontWeight: 500 }}>{p.gender}</span>
                    </div>
                  </div>
                ))}
                {patients.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: C.gray400 }}>No patients found</div>}
              </div>
            )}
          </div>
        )}

        {/* Centers */}
        {section === "centers" && (
          <div className="fadeIn">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark, marginBottom: 24 }}>{t.admin.centers}</h2>
            {loading ? <Skel h={300} /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {centers.map((c, i) => (
                  <div key={c.id} className="card" style={{ background: "white", borderRadius: 16, padding: 26, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderLeft: `5px solid ${[C.greenMid, C.red, C.blue, C.gold, "#7C3AED", "#DB2777"][i % 6]}` }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon name="hospital" size={24} color={C.greenMid} /></div>
                    <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 6, fontSize: 15 }}>{lang === "ar" ? c.name_ar : c.name_en}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.gray600, fontSize: 13, marginBottom: 4 }}><Icon name="location" size={14} color={C.gray400} /> {lang === "ar" ? c.cities?.name_ar : c.cities?.name_en}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.gray400, fontSize: 12, marginBottom: 14 }}><Icon name="phone" size={14} color={C.gray400} /> {c.phone}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ background: C.greenPale, color: C.greenMid, padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="check" size={11} color={C.greenMid} /> {c.status}</span>
                      <span style={{ background: C.gray50, color: C.gray600, padding: "3px 10px", borderRadius: 8, fontSize: 12 }}>{c.max_daily_slots} slots/day</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports */}
        {section === "reports" && <ReportsSection lang={lang} t={t} />}

        {/* Settings */}
        {section === "settings" && <SettingsSection lang={lang} t={t} />}

      </main>
    </div>
  );
};

// ─── RECENT APPOINTMENTS (Dashboard widget) ───────────────────────────────────
const RecentAppts = ({ lang, t, onViewAll }) => {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("appointments").select(`
      id, reference_no, appointment_date, start_time, type, status,
      patients(full_name_en, full_name_ar),
      medical_centers(name_en, name_ar)
    `).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { setAppts(data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontWeight: 700, color: C.dark }}>{t.admin.recentAppts}</h3>
        <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }} onClick={onViewAll}>View All →</button>
      </div>
      {loading ? <div style={{ padding: 24 }}><Skel h={180} /></div> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: C.gray50 }}>
              {["Ref", t.admin.patient, t.admin.center, t.admin.date, t.admin.status].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {appts.map(a => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${C.gray50}` }}>
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.greenMid }}>{a.reference_no}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13, color: C.dark }}>{lang === "ar" ? a.patients?.full_name_ar : a.patients?.full_name_en}</td>
                  <td style={{ padding: "12px 14px", color: C.gray600, fontSize: 12 }}>{lang === "ar" ? a.medical_centers?.name_ar : a.medical_centers?.name_en}</td>
                  <td style={{ padding: "12px 14px", color: C.gray600, fontSize: 12 }}>{a.appointment_date}</td>
                  <td style={{ padding: "12px 14px" }}>{statusBadge(a.status)}</td>
                </tr>
              ))}
              {appts.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: C.gray400 }}>No appointments yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── REPORTS SECTION ──────────────────────────────────────────────────────────
const ReportsSection = ({ lang, t }) => {
  const [data, setData] = useState({ byStatus: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      supabase.from("appointments").select("status"),
    ]).then(([apptRes]) => {
      const appts = apptRes.data || [];
      const byStatus = ["pending","confirmed","completed","cancelled","no_show"].map(s => ({
        label: s, count: appts.filter(a => a.status === s).length
      }));
      setData({ byStatus });
      setLoading(false);
    });
  }, []);

  const total = data.byStatus.reduce((sum, s) => sum + s.count, 0);
  const colors = { pending: C.gold, confirmed: C.greenMid, completed: C.blue, cancelled: C.red, no_show: C.gray400 };

  return (
    <div className="fadeIn">
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.darkMid, marginBottom: 28 }}>{t.admin.reports}</h2>
      {loading ? <Skel h={300} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 20 }}>Appointments by Status</h3>
            {data.byStatus.map(s => (
              <div key={s.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: C.dark }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: colors[s.label] || C.gray600 }}>{s.count} ({total ? Math.round(s.count / total * 100) : 0}%)</span>
                </div>
                <div style={{ background: C.gray100, borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${total ? (s.count / total * 100) : 0}%`, background: colors[s.label] || C.gray400, borderRadius: 4, height: "100%", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 20 }}>Total Appointments</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: C.greenMid, fontFamily: "'Cormorant Garamond', serif" }}>{total}</div>
                <div style={{ color: C.gray400, fontSize: 14, marginTop: 8 }}>Total appointments in system</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS SECTION ─────────────────────────────────────────────────────────
const SettingsSection = ({ lang, t }) => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  useEffect(() => {
    supabase.from("system_settings").select("*").then(({ data }) => { setSettings(data || []); setLoading(false); });
  }, []);
  const updateSetting = async (key, value) => {
    setSaving(s => ({ ...s, [key]: true }));
    await supabase.from("system_settings").update({ value }).eq("key", key);
    setSaving(s => ({ ...s, [key]: false }));
    setSettings(ss => ss.map(s => s.key === key ? { ...s, value } : s));
  };
  return (
    <div className="fadeIn">
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark, marginBottom: 28 }}>{t.admin.settings}</h2>
      {loading ? <Skel h={300} /> : (
        <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, color: C.dark, marginBottom: 20 }}>System Settings</h3>
          <div style={{ display: "grid", gap: 18 }}>
            {settings.map(s => (
              <div key={s.key} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 16, alignItems: "center", padding: "14px 18px", background: C.gray50, borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{s.key}</div>
                  <div style={{ color: C.gray400, fontSize: 12 }}>{s.description}</div>
                </div>
                <input className="field" defaultValue={s.value} style={{ background: "white" }} onBlur={e => { if (e.target.value !== s.value) updateSetting(s.key, e.target.value); }} />
                <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {saving[s.key] && <Spinner size={16} color={C.greenMid} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const t = T[lang];
  const ff = lang === "ar" ? "'IBM Plex Sans Arabic','IBM Plex Sans',sans-serif" : "'IBM Plex Sans',sans-serif";

  return (
    <div dir={t.dir} style={{ minHeight: "100vh", background: C.offWhite, fontFamily: ff }}>
      <GS />
      <Navbar lang={lang} setLang={setLang} view={view} setView={setView} isAdmin={isAdmin} setIsAdmin={setIsAdmin} adminUser={adminUser} />

      {isAdmin ? (
        <AdminDashboard lang={lang} adminUser={adminUser} setIsAdmin={setIsAdmin} setView={setView} />
      ) : (
        <>
          {view === "home"       && <HomePage       lang={lang} setView={setView} />}
          {view === "verify"     && <VerifyPage     lang={lang} setView={setView} setPatientData={setPatientData} />}
          {view === "register"   && <RegisterPage   lang={lang} setView={setView} setPatientData={setPatientData} />}
          {view === "book"       && <BookPage       lang={lang} patientData={patientData} setView={setView} />}
          {view === "adminLogin" && <AdminLoginPage lang={lang} setView={setView} setIsAdmin={setIsAdmin} setAdminUser={setAdminUser} />}
        </>
      )}
    </div>
  );
}
