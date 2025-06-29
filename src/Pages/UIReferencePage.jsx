import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiAward,
  FiHome,
  FiBook,
  FiActivity,
  FiZap,
  FiBell,
  FiLogOut,
  FiSettings,
  FiChevronLeft,
  FiSearch,
  FiBookmark,
  FiHeart,
  FiX,
} from "react-icons/fi";

const UIReferencePage = () => {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    "لديك درس جديد متاح!",
    "حصلت على شارة جديدة 🎉",
    "تحدي اليوم ينتظرك!",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const lessons = [
    { id: 1, title: "الفيزياء الأساسية", desc: "فيديو + أسئلة تفاعلية" },
    { id: 2, title: "الكيمياء العضوية", desc: "محاضرات وتدريبات" },
    { id: 3, title: "الرياضيات التطبيقية", desc: "تمارين وحلول" },
    { id: 4, title: "الفيزياء المتقدمة", desc: "تجارب وشرح مفصل" },
    { id: 5, title: "البرمجة بلغة بايثون", desc: "مشاريع وتمارين" },
  ];
  const filteredLessons = lessons.filter((l) =>
    l.title.includes(searchTerm)
  );
  return (
    <div
      dir="rtl"
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white"
    >
      {/* Sidebar for desktop */}
      <aside
        className={`hidden lg:flex flex-col w-72 bg-white/70 dark:bg-gray-900/80 backdrop-blur border-l border-gray-300 dark:border-gray-700 shadow-lg sticky top-0 h-screen z-40`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-violet-600">فِزي التعليمية</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث في الدروس..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute top-2.5 left-3 text-gray-400" size={20} />
            </div>
          </div>
          <nav className="flex flex-col gap-3 px-4 mt-3 text-gray-700 dark:text-gray-300">
            <SidebarItem icon={<FiHome />} label="الرئيسية" active />
            <SidebarItem icon={<FiBook />} label="الدروس" />
            <SidebarItem icon={<FiActivity />} label="التقدم" badge={5} />
            <SidebarItem icon={<FiAward />} label="الشارات" />
            <SidebarItem icon={<FiBell />} label="الإشعارات" badge={notifications.length} />
            <SidebarItem icon={<FiSettings />} label="الإعدادات" />
            <SidebarItem icon={<FiLogOut />} label="تسجيل الخروج" />
          </nav>

          <section className="px-6 mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-violet-600">
              <FiBell /> الإشعارات
            </h3>
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                لا توجد إشعارات جديدة
              </p>
            )}
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.map((note, i) => (
                <li
                  key={i}
                  className="bg-white/80 dark:bg-gray-700/80 backdrop-blur rounded-md p-2 shadow cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900 transition"
                  onClick={() => {
                    setNotifications((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
      {/* Overlay Sidebar for Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-lg p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-violet-600">القائمة</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
              <SidebarItem icon={<FiHome />} label="الرئيسية" active />
              <SidebarItem icon={<FiBook />} label="الدروس" />
              <SidebarItem icon={<FiActivity />} label="التقدم" badge={5} />
              <SidebarItem icon={<FiAward />} label="الشارات" />
              <SidebarItem icon={<FiBell />} label="الإشعارات" badge={notifications.length} />
              <SidebarItem icon={<FiSettings />} label="الإعدادات" />
              <SidebarItem icon={<FiLogOut />} label="تسجيل الخروج" />
            </nav>
          </aside>
        </>
      )}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md bg-violet-100 dark:bg-gray-700 text-violet-600 dark:text-yellow-400 hover:bg-violet-200 dark:hover:bg-gray-600 transition"
            aria-label="فتح القائمة"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="my-[4px] p-2 rounded-full bg-violet-100 dark:bg-gray-700 text-violet-600 dark:text-yellow-400 transition"
            aria-label="تبديل الثيم"
          >
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </header>

        <main className="overflow-y-auto px-4 sm:px-6 pb-28">
          <section className="my-4 bg-violet-50 dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-bold">🔥 سلسلة يومية</h2>
              <p className="text-gray-600 dark:text-gray-300">أنت الآن في اليوم الخامس!</p>
            </div>
            <div className="w-full sm:w-1/2 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div className="bg-violet-600 h-3 rounded-full w-4/5 transition-all"></div>
            </div>
          </section>
          <section className="flex gap-3 overflow-x-auto py-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="min-w-[80px] bg-white/50 dark:bg-gray-700/50 rounded-xl p-2 text-center shadow-md backdrop-blur cursor-pointer hover:scale-105 transition"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 mx-auto mb-1 shadow-inner"></div>
                <span className="text-xs">قصة {i + 1}</span>
              </div>
            ))}
          </section>

          <section className="mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📚 دروس اليوم
              <button
                onClick={() => setModalOpen(true)}
                className="ml-auto text-violet-600 hover:text-violet-700"
                title="أضف درس جديد"
              >
                +
              </button>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
              {filteredLessons.length === 0 && (
                <p className="col-span-full text-center text-gray-600 dark:text-gray-400">
                  لا توجد دروس تطابق البحث.
                </p>
              )}
            </div>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🏅 شاراتك
              <FiZap className="text-violet-600" />
            </h2>
            <div className="flex gap-3 overflow-x-auto px-1">
              {[1, 2, 3, 4, 5].map((badge) => (
                <Badge key={badge} number={badge} />
              ))}
            </div>
          </section>

          <section className="mt-10 mb-24">
            <div className="bg-violet-600 text-white rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-2">🎯 تحدي اليوم</h3>
              <p className="mb-4">
                أنهِ درس الفيزياء بدون أخطاء واحصل على 50 نقطة XP إضافية!
              </p>
              <button className="bg-white text-violet-700 font-semibold px-6 py-2 rounded-full hover:bg-violet-100 transition">
                خوض التحدي
              </button>
            </div>
          </section>
        </main>
        {/* Bottom Navigation for Mobile */}
        <nav className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 text-sm z-40 lg:hidden">
          <NavIcon icon={<FiHome />} label="الرئيسية" active />
          <NavIcon icon={<FiBook />} label="الدروس" />
          <NavIcon icon={<FiActivity />} label="التقدم" />
          <NavIcon icon={<FiUser />} label="حسابي" />
        </nav>

        {/* Modal */}
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">إضافة درس جديد</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("تمت إضافة الدرس (تجريبيًا)");
                setModalOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="اسم الدرس"
                className="border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <textarea
                placeholder="وصف الدرس"
                className="border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={3}
                required
              />
              <button
                type="submit"
                className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
              >
                أضف الدرس
              </button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};
const SidebarItem = ({ icon, label, active, badge }) => (
  <button
    className={`flex items-center justify-between p-3 rounded-lg transition-colors w-full text-right ${
      active
        ? "bg-violet-200 dark:bg-violet-800 font-semibold text-violet-700"
        : "hover:bg-violet-100 dark:hover:bg-violet-900 text-gray-700 dark:text-gray-300"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const NavIcon = ({ icon, label, active }) => (
  <button
    className={`flex flex-col items-center ${
      active ? "text-violet-600 dark:text-violet-400" : "text-gray-600 dark:text-gray-300"
    } hover:text-violet-600 dark:hover:text-violet-400 transition`}
  >
    <div className="text-xl">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);

NavIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
};
const LessonCard = ({ lesson }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md hover:shadow-xl transition backdrop-blur flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-violet-700 dark:text-violet-300">
          {lesson.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {lesson.desc}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          aria-label="Bookmark Lesson"
          className={`text-xl transition-colors ${
            bookmarked
              ? "text-violet-600"
              : "text-gray-400 dark:text-gray-500 hover:text-violet-700"
          }`}
        >
          <FiBookmark />
        </button>
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Like Lesson"
          className={`text-xl transition-colors ${
            liked
              ? "text-red-500"
              : "text-gray-400 dark:text-gray-500 hover:text-red-600"
          }`}
        >
          <FiHeart />
        </button>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded text-sm transition">
          ابدأ الآن
        </button>
      </div>
    </div>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};
const Badge = ({ number }) => (
  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur p-4 rounded-lg shadow flex flex-col items-center gap-2 min-w-[90px] cursor-default">
    <div className="text-yellow-400 text-3xl">
      <FiAward />
    </div>
    <span className="text-sm font-semibold">Badge {number}</span>
  </div>
);

Badge.propTypes = {
  number: PropTypes.number.isRequired,
};

const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 left-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
        aria-label="Close Modal"
      >
        <FiX size={24} />
      </button>
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default UIReferencePage;
