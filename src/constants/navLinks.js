// src/constants/navLinks.js
export const navLinks = {
  admin: [
    { icon: "manage_accounts", text: "إدارة المسؤولين", link: "/admins" },
    { icon: "manage_accounts", text: "إدارة المشرفين", link: "/moderators" },
    { icon: "group", text: "قائمة الطلاب", link: "/students" },
    { icon: "quiz", text: "الاختبارات", link: "/admin/quizes" },
    { icon: "assignment", text: "الواجبات", link: "/admin/homeworks" },
    { icon: "video_library", text: "المحاضرات", link: "/video/upload" },
  ],
  moderator: [
    { icon: "group", text: "الطلاب", link: "/students" },
    { icon: "quiz", text: "الاختبارات", link: "/admin/quizes" },
    { icon: "assignment", text: "الواجبات", link: "/admin/homeworks" },
    { icon: "video_library", text: "المحاضرات", link: "/admin/sessions" },
  ],
  student: [
    { icon: "quiz", text: "الاختبارات", link: "/exams" },
    { icon: "assignment", text: "الواجبات الدراسية", link: "/homeworks" },
    { icon: "task", text: "النتائج والتقييمات", link: "/results" },
    { icon: "payments", text: "إدارة الاشتراكات", link: "/subscriptions" },
  ],
};
