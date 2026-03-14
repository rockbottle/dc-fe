"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Define which paths should not show the sidebar or navbar
  const normalizedPath = pathname.toLowerCase();
  const isAuthPage = normalizedPath === "/login" || normalizedPath === "/signup";

  // 1. Handle Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 2. Protect Routes: Redirect to login if no token is found
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token && !isAuthPage) {
      router.push("/Login");
    }
  }, [isAuthPage, router]);

  // 3. Render for Auth Pages (Login/Signup)
  // This return happens BEFORE the Sidebar/Navbar code, ensuring they are hidden.
  if (isAuthPage) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-[#080b12] text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </div>
    );
  }

  // 4. Render for Main Application (Dashboard/Inventory/etc.)
  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-200 dark:bg-[#080b12] text-gray-900 dark:text-gray-100 w-full min-h-screen transition-colors duration-300`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full py-7 px-9 bg-transparent transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        <div className="flex-1 w-full">
          {children}
        </div>
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