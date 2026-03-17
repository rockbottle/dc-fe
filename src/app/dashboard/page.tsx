"use client";

import React, { useMemo, useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppSelector } from "@/app/redux";
import { 
  useGetInventoryQuery, 
  useGetMyDetailsQuery 
} from "@/state/api";
import { RefreshCcw, Clock, Loader2, HardDrive, Zap, Network, Database, Box, CheckCircle2 } from "lucide-react";

// --- COMPACT GAUGE COMPONENT ---
interface GaugeProps {
  title: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
  icon: React.ReactNode;
  isRefreshing?: boolean;
}

const GaugeChart = ({ title, value, max, color, unit = "", icon, isRefreshing }: GaugeProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const safeMax = max > 0 ? max : 1;
  const data = [{ value: value }, { value: Math.max(0, safeMax - value) }];

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300 ${isRefreshing ? "opacity-40 scale-[0.98]" : "opacity-100"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500">
          {icon}
        </div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>

      <div className="w-full h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="82%" 
              outerRadius="100%"
              dataKey="value"
              stroke="none"
              animationDuration={800}
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill={isDarkMode ? "#111827" : "#f9fafb"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-2xl font-black dark:text-white leading-none">
            {value.toLocaleString()}<span className="text-[10px] ml-0.5 text-gray-400 font-bold">{unit}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Limit: {max.toLocaleString()} {unit}</span>
        <div className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase">
          {Math.round((value / safeMax) * 100)}%
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [syncTime, setSyncTime] = useState<string>("");

  const { 
    data: devices = [], 
    isLoading: isInvLoading, 
    isFetching: isInvFetching, 
    refetch: refetchInv, 
    dataUpdatedAt: invUpdatedAt 
  } = useGetInventoryQuery();

  const { 
    data: myDetails, 
    isLoading: isDetLoading, 
    isFetching: isDetFetching, 
    refetch: refetchDetails,
    dataUpdatedAt: detUpdatedAt
  } = useGetMyDetailsQuery();

  const isRefreshing = isInvFetching || isDetFetching;
  const hasData = devices.length > 0 || myDetails;

  // Improved Timestamp Logic
  useEffect(() => {
    const latest = Math.max(invUpdatedAt || 0, detUpdatedAt || 0);
    if (latest > 0) {
      setSyncTime(new Date(latest).toLocaleTimeString());
    } else if (hasData && !isRefreshing) {
      // Fallback: if data is here but RTK hasn't set the timestamp yet
      setSyncTime(new Date().toLocaleTimeString());
    }
  }, [invUpdatedAt, detUpdatedAt, hasData, isRefreshing]);

  const metrics = useMemo(() => ({
    current: {
      devices: devices.length,
      uspace: devices.reduce((acc, d) => acc + (parseInt(d.rack_uspace) || 0), 0),
      power: devices.reduce((acc, d) => acc + (d.device_power || 0), 0),
      nports: devices.reduce((acc, d) => acc + (d.device_nports || 0), 0),
      sports: devices.reduce((acc, d) => acc + (d.device_sports || 0), 0),
    },
    limits: {
      devices: 100, 
      uspace: myDetails?.uspace || 42,
      power: myDetails?.dcpower || 10000,
      nports: myDetails?.nport || 200,
      sports: myDetails?.sport || 48,
    }
  }), [devices, myDetails]);

  if (isInvLoading || isDetLoading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Sync...</h2>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-4 pt-2 pb-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-black dark:text-white uppercase tracking-tighter leading-none">System Utilization</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className={isRefreshing ? "animate-pulse text-blue-500" : "text-gray-400"} />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                Last Refreshed: {syncTime || "Syncing..."}
              </span>
            </div>
            {syncTime && !isRefreshing && (
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-[8px] font-black text-green-600 dark:text-green-400 uppercase tracking-tighter">
                <CheckCircle2 size={10} />
                DATA SYNCED
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => { refetchInv(); refetchDetails(); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Syncing" : "Refresh"}
        </button>
      </div>

      {/* HARDWARE INVENTORY (Fixed Limit: 100) */}
      <div className="w-full">
        <GaugeChart 
          title="Hardware Inventory" 
          value={metrics.current.devices} 
          max={metrics.limits.devices} 
          unit="Units"
          color="#3b82f6" 
          icon={<HardDrive size={16} />}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* RESOURCE GRID */}
      <div className="grid grid-cols-2 gap-4">
        <GaugeChart 
          title="Occupied Rack Space" 
          value={metrics.current.uspace} 
          max={metrics.limits.uspace} 
          unit="U"
          color="#8b5cf6" 
          icon={<Box size={16} />}
          isRefreshing={isRefreshing}
        />
        <GaugeChart 
          title="Total Power Load" 
          value={metrics.current.power} 
          max={metrics.limits.power} 
          unit="W"
          color="#ef4444" 
          icon={<Zap size={16} />}
          isRefreshing={isRefreshing}
        />
        <GaugeChart 
          title="Network Port Usage" 
          value={metrics.current.nports} 
          max={metrics.limits.nports} 
          color="#10b981" 
          icon={<Network size={16} />}
          isRefreshing={isRefreshing}
        />
        <GaugeChart 
          title="SAN Port Usage" 
          value={metrics.current.sports} 
          max={metrics.limits.sports} 
          color="#f59e0b" 
          icon={<Database size={16} />}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
};

export default Dashboard;