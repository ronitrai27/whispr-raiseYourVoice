"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Newspaper,
  House,
  Flame,
  Users,
  Tent,
  UserRoundPen,
  CalendarDays,
} from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { label: "feed", href: "/", icon: House },
  { label: "partners", href: "/messages", icon: Users },
  { label: "campaign", href: "/123", icon: Tent },
  { label: "events", href: "/123", icon: CalendarDays },
  { label: "trend", href: "/123", icon: Flame },
  { label: "profile", href: "/profile", icon: UserRoundPen },
];
const Sidebar = () => {
  const { user, darkMode } = useAppContext();
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-2">
      {links.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link key={label} href={href} className="w-full">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isActive
                  ? darkMode
                    ? "var(--sidebar-accent-foreground)" // ✅ your custom OKLCH color
                    : "#a855f7" // ✅ your light mode purple
                  : "#ffffff",
                scale: 1,
              }}
              whileHover={{ scale: 1.03 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded-lg"
            >
              <div
                className={`bg-accent rounded-md flex items-center justify-center w-8 h-8 transition-colors duration-300`}
              >
                <Icon className="text-gray-800" size={18} />
              </div>
              <h2
                className={`capitalize tracking-wide font-medium text-[16px] ${
                  isActive ? "text-white" : "text-black"
                }`}
              >
                {label}
              </h2>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
