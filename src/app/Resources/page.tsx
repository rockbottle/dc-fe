"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/redux";
import { 
  RefreshCw, ShoppingCart, Zap, Network, Box, 
  HardDrive, AlertTriangle, Info, ChevronLeft, Save, X 
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// --- GAUGE COMPONENT ---
const ResourceGauge = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const percentage = Math.min(100, Math.round((value / total) * 100));
  const data = [{ value: value }, { value: Math.max(0, total - value) }];

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full transition-all">
      <div className="h-32 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={percentage > 90 ? "#EF4444" : color} />
              <Cell fill={isDarkMode ? "#374151" : "#e5e7eb"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className={`text-2xl font-black ${percentage > 90 ? 'text-red-500' : 'dark:text-white'}`}>
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-widest text-center">{label}</p>
      <p className="text-sm font-black dark:text-gray-200 mt-1">{value.toLocaleString()} / {total.toLocaleString()}</p>
    </div>
  );
};

export default function ResourcesPage() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState<"dashboard" | "purchase">("dashboard");
  const [formData, setFormData] = useState({ power: 0, networkPorts: 0, rackSpace: 0, sanPorts: 0 });
  const [lastRefreshed, setLastRefreshed] = useState("");

  // Fix for Hydration Mismatch
  useEffect(() => {
    setLastRefreshed(new Date().toLocaleTimeString());
  }, []);

  // --- HANDLERS ---
  const handlePurchaseClick = () => setCurrentView("purchase");
  const handleBackToDashboard = () => setCurrentView("dashboard");

  // --- VIEW: PURCHASE FORM ---
  if (currentView === "purchase") {
    return (
      <div className="flex flex-col gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToDashboard} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight">Configure Procurement</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProcurementInput 
                label="Additional Power (Watts)" 
                icon={<Zap className="text-orange-500" size={16} />} 
                onChange={(v) => setFormData(prev => ({ ...prev, power: v }))} 
              />
              <ProcurementInput 
                label="Network Ports" 
                icon={<Network className="text-blue-500" size={16} />} 
                onChange={(v) => setFormData(prev => ({ ...prev, networkPorts: v }))} 
              />
              <ProcurementInput 
                label="Rack Space (U)" 
                icon={<Box className="text-emerald-500" size={16} />} 
                onChange={(v) => setFormData(prev => ({ ...prev, rackSpace: v }))} 
              />
              <ProcurementInput 
                label="SAN Ports" 
                icon={<HardDrive className="text-purple-500" size={16} />} 
                onChange={(v) => setFormData(prev => ({ ...prev, sanPorts: v }))} 
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between border border-gray-800">
            <div>
              <h3 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-8">Request Summary</h3>
              <div className="space-y-6">
                <SummaryRow label="Power Load" value={`${formData.power} W`} />
                <SummaryRow label="Total Ports" value={formData.networkPorts + formData.sanPorts} />
                <SummaryRow label="Rack footprint" value={`${formData.rackSpace} U`} />
              </div>
            </div>
            <button 
              onClick={() => { alert("Order Confirmed!"); setCurrentView("dashboard"); }}
              className="mt-12 w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              Confirm Procurement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-black dark:text-white tracking-tight uppercase">Resource Center</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Status: Operational • {lastRefreshed}</p>
        </div>
        <button 
          onClick={handlePurchaseClick} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-500/20 uppercase text-xs tracking-widest transition-all active:scale-95"
        >
          <ShoppingCart size={18} /> Purchase Resources
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceGauge label="Power Usage" value={4750} total={5000} color="#EF4444" />
        <ResourceGauge label="Network Ports" value={640} total={1000} color="#3B82F6" />
        <ResourceGauge label="SAN Connectivity" value={155} total={200} color="#8B5CF6" />
        <ResourceGauge label="Rack Capacity" value={210} total={240} color="#10B981" />
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Critical Capacity Alerts</h4>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-5 rounded-2xl flex justify-between items-center group">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-black dark:text-white uppercase tracking-tight">Power Threshold Reached</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Main UPS load is at 95%. New hardware provisioning is blocked.</p>
            </div>
          </div>
          <button 
            onClick={handlePurchaseClick}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            Procure UPS
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

const ProcurementInput = ({ label, icon, onChange }: { label: string; icon: React.ReactNode; onChange: (v: number) => void }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      type="number" 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full p-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white font-black text-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
      placeholder="0"
    />
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    <span className="font-black text-lg">{value}</span>
  </div>
);