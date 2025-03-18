"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./InFooter";
import Icon from "./Icon";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full p-2">
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        <img src="/demos-page/neuralseek_logo.png" alt="NS Automation Logo" className="h-10 w-10" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {sidebarLinks.map(({ category, links }) => (
          <div key={category} className="mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 py-1">
              {category}
            </h3>
            <ul>
              {links.map(({ imgURL, route, label }) => {
                const isActive = pathname === route || pathname?.startsWith(`${route}/`);
                return (
                  <li key={label} className="mb-1">
                    <Link
                      href={route}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        {
                          "bg-gray-200 dark:bg-gray-700": isActive,
                        }
                      )}
                    >
                      <Icon
                        name={imgURL}
                        className={cn("size-5", {
                          "text-blue-500 dark:text-gray-100": !isActive,
                          "brightness-[3] invert-0 dark:invert": isActive,
                        })}
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-2">
        <Footer />
      </div>
    </aside>
  );
};

export default Sidebar;
