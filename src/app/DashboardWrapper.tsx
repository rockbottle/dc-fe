"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-[#080b12] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {!isAuthPage && <Sidebar />}
      <main
        className={`flex flex-col w-full py-7 px-9 transition-all duration-300 ${
          isAuthPage ? "" : isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        {!isAuthPage && <Navbar />}
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;