import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { navLinks } from "../constants/navLinks";
import { fetchWithAuth } from "../utils";

const iconMap = {
  home: "mdi:home",
  manage_accounts: "mdi:account-cog",
  group: "mdi:account-group",
  quiz: "mdi:clipboard-text",
  assignment: "mdi:clipboard-check",
  video_library: "mdi:video-outline",
  task: "mdi:chart-line",
  payments: "mdi:credit-card-outline",
  settings: "mdi:cog",
  account_circle: "mdi:account-circle",
};

const VISIBLE_COUNT = 5;

const MobileBottomNav = () => {
  const location = useLocation();
  const [baseLinks, setBaseLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [longPressedIdx, setLongPressedIdx] = useState(null);
  const centerIndex = Math.floor(VISIBLE_COUNT / 2);
  let longPressTimeout = null;

  useEffect(() => {
    fetchWithAuth("/auth/me")
      .then((data) => {
        const role = (data.user?.role) || "guest";
        const links = [
          ...(navLinks[role] || []),
          { icon: "home", text: "الرئيسية", link: "/" },
          { icon: "settings", text: "الإعدادات", link: "/settings" },
          { icon: "account_circle", text: "الحساب", link: "/account" },
        ];
        setBaseLinks(links);
      })
      .catch(() => {
        setBaseLinks([
          { icon: "home", text: "الرئيسية", link: "/" },
          { icon: "settings", text: "الإعدادات", link: "/settings" },
          { icon: "account_circle", text: "الحساب", link: "/account" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (baseLinks.length === 0) return;

    const activeIdx = baseLinks.findIndex((l) => l.link === location.pathname);
    if (activeIdx !== -1) {
      let newStart = (activeIdx - centerIndex + baseLinks.length) % baseLinks.length;
      setStartIndex(newStart);
    }
  }, [location.pathname, baseLinks]);

  const getVisibleLinks = () => {
    if (baseLinks.length === 0) return [];
    const links = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const index = (startIndex + i + baseLinks.length) % baseLinks.length;
      links.push(baseLinks[index]);
    }
    return links.filter(Boolean);
  };

  const handleLeft = () => {
    setStartIndex((prev) => (prev - 1 + baseLinks.length) % baseLinks.length);
  };

  const handleRight = () => {
    setStartIndex((prev) => (prev + 1) % baseLinks.length);
  };

  const handleIconPointerDown = (idx) => {
    longPressTimeout = setTimeout(() => {
      setLongPressedIdx(idx);
    }, 500);
  };

  const handleIconPointerUp = () => {
    clearTimeout(longPressTimeout);
    setLongPressedIdx(null);
  };

  const handleIconPointerLeave = () => {
    clearTimeout(longPressTimeout);
    setLongPressedIdx(null);
  };

  if (loading || baseLinks.length === 0) return null;

  const visibleLinks = getVisibleLinks();

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden">
      <div className="relative h-[80px] bg-white/80 dark:bg-gray-900 backdrop-blur-xl border-t border-gray-300 dark:border-gray-700 shadow-xl overflow-visible">
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 L0,0 L100,0 L100,100 C65,100 60,60 50,60 C40,60 35,100 0,100 Z"
            fill="currentColor"
            className="text-white dark:text-gray-900"
          />
        </svg>

        <div className="relative flex items-center justify-between px-3 h-full z-10">
          <button
            onClick={handleLeft}
            className="p-2 rounded-full bg-violet-500/70 dark:bg-black/40 hover:scale-105 transition cursor-pointer z-20"
          >
            <Icon icon="mdi:chevron-left" className="text-2xl rotate-180" />
          </button>

          <div
            className="flex-1 flex justify-center items-end gap-6 overflow-visible relative"
            style={{ perspective: "3000px" }}
          >
            <div
              className="flex gap-6 transform-style-3d transition-all duration-500 ease-in-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {visibleLinks.map(({ icon, link, text }, index) => {
                if (!icon || !link) return null;

                const isActive = location.pathname === link;
                const offset = index - centerIndex;
                const isCenter = offset === 0;

                const rotation = offset * 15;
                const depth = isCenter ? 100 : 0;
                const scale = isCenter ? 1.2 : 1;
                const opacity = isCenter ? 1 : 0.6;
                const translateY = isCenter ? "-20px" : "0";

                let iconClasses = "";
                if (isActive && isCenter) {
                  iconClasses = "bg-violet-600 text-white dark:bg-violet-500 dark:text-white";
                } else if (isActive && !isCenter) {
                  iconClasses = "text-violet-700 dark:text-violet-400";
                } else if (isCenter) {
                  iconClasses = "bg-violet-500 text-white dark:bg-violet-500/60 dark:text-white";
                } else {
                  iconClasses = "bg-white/60 text-gray-700 dark:bg-gray-700/40 dark:text-gray-100";
                }

                return (
                  <Link
                    key={`${link}-${index}`}
                    to={link}
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      transform: `
                        rotateY(${rotation}deg)
                        translateZ(${depth}px)
                        translateY(${translateY})
                        scale(${scale})
                      `,
                      transformOrigin: "center",
                      opacity,
                    }}
                  >
                    <div
                      className={`w-[56px] h-[56px] flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${iconClasses}`}
                      onPointerDown={() => handleIconPointerDown(index)}
                      onPointerUp={handleIconPointerUp}
                      onPointerLeave={handleIconPointerLeave}
                      style={{ position: "relative" }}
                    >
                      <Icon
                        icon={iconMap[icon] || "mdi:circle"}
                        className="text-2xl transition-all duration-300"
                      />
                      {longPressedIdx === index && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs whitespace-nowrap z-30 shadow-lg animate-fade-in">
                          {text}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRight}
            className="p-2 rounded-full bg-violet-500/70 dark:bg-black/40 hover:scale-105 transition cursor-pointer z-20"
          >
            <Icon icon="mdi:chevron-left" className="text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
