"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./InFooter";
import Icon from "./Icon";

const Sidebar = ({ sidebarOpen, toggleSidebar }: any) => {
  const pathname = usePathname();

  return (
    <section className="lg:w-80 md:80 sidebar bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 border border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col gap-4">
        <div className="flex items-center justify-between py-2 px-4">
          <img src="/neuralseek_logo.png" alt="NS Automation Logo" className="h-8 w-8" />
        </div>
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname?.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "sidebar-link dark:hover:bg-gray-700",
                { "bg-bank-gradient dark:bg-gray-700": isActive }
              )}
            >
              <div className="relative size-6">
                <Icon
                  name={item.imgURL}
                  className={cn({
                    "text-blue-500 dark:text-gray-100": !isActive,
                    "brightness-[3] invert-0 dark:invert": isActive,
                  })}
                />
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                {item.label}
              </p>

            </Link>
          );
        })}
      </nav>
      <Footer type="desktop" />
    </section>
  );
};

export default Sidebar;
