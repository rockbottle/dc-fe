"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/app/redux";
import { 
  Search, UserPlus, Mail, Building2, 
  MoreVertical, X, Edit2, Trash2, Globe 
} from "lucide-react";

// --- TYPES ---
interface UserDetail {
  id: string;
  name: string;
  email: string;
  companyName: string;
}

const Company = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<UserDetail[]>([
    { id: "1", name: "Pramod", email: "pramod@techexample.com", companyName: "TechCorp Solutions" },
    { id: "2", name: "Anjali Sharma", email: "anjali@techexample.com", companyName: "TechCorp Solutions" },
    { id: "3", name: "Sarah Connor", email: "sarah@techexample.com", companyName: "TechCorp Solutions" },
  ]);

  // Handle clicking outside of the action menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 relative">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black dark:text-white tracking-tight">TechCorp Solutions</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
              <Globe size={14} /> Directory Management
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* USERS TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-visible shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-5 text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">USER</th>
              <th className="px-6 py-5 text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">EMAIL</th>
              <th className="px-6 py-5 text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">COMPANY</th>
              <th className="px-6 py-5 text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold dark:text-white">{user.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-bold">
                    <Mail size={14} className="text-gray-400" />
                    {user.email}
                  </div>
                </td>

                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-bold uppercase tracking-tight">
                    <Building2 size={14} className="text-blue-500/70" />
                    {user.companyName}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === user.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-6 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-bold"
                        onClick={() => { setOpenMenuId(null); }}
                      >
                        <Edit2 size={16} className="text-blue-500" /> Update User
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={16} /> Delete User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black dark:text-white">Create New User</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Add member to organization</p>
              </div>
              <X className="cursor-pointer dark:text-gray-400 hover:text-red-500 transition-colors" onClick={() => setIsModalOpen(false)} />
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" placeholder="e.g. Pramod" className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" placeholder="user@techexample.com" className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              {/* NEW COMPANY NAME FIELD */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                <div className="relative mt-1">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" defaultValue="TechCorp Solutions" className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-black shadow-lg shadow-blue-500/20 mt-4 uppercase text-xs tracking-widest transition-all active:scale-[0.98]">
                Add User to Directory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;