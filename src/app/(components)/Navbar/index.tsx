"use client";
import { 
  Bell, Menu, Moon, Search, Settings, Sun, User, Lock, LogOut, ChevronDown 
} from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed, setIsDarkMode, setSearchTerm } from "@/state"; 

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const searchTerm = useAppSelector((state) => state.global.searchTerm);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE: Sidebar Toggle & Search */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4 dark:text-white" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Start typing to search Devices"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            // Added dark:bg-gray-700 and dark:text-white
            className="pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} strokeWidth={2} className="text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Actions & Profile */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            {isDarkMode ? (
              <Sun className="text-orange-400" size={24} />
            ) : (
              <Moon className="text-gray-500" size={24} />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
            <Bell className="text-gray-500 dark:text-gray-400" size={24} />
            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div>

          <hr className="w-0 h-7 border-l border-gray-300 dark:border-gray-700 mx-3" />
          
          {/* USER PROFILE DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <div 
              className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">P</div>
              <div className="hidden lg:block text-left">
                <span className="block text-sm font-bold text-gray-800 dark:text-white">Pramod</span>
              </div>
              <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
            </div>

            {/* DROPDOWN MENU */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-150">
                <Link 
                  href="/Profile" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User size={16} className="text-gray-400" /> Update Profile
                </Link>
                
                <Link 
                  href="/Settings" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings size={16} className="text-gray-400" /> System Settings
                </Link>

                <Link 
                  href="/Settings/Password" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Lock size={16} className="text-gray-400" /> Change Password
                </Link>

                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                
                <Link 
                  href="/Logout"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;