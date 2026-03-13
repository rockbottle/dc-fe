"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppSelector } from "@/app/redux";
import { RefreshCcw, Clock } from "lucide-react";

// --- REUSABLE GAUGE COMPONENT ---
interface GaugeProps {
  title: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
  size?: "large" | "small";
  isRefreshing?: boolean;
}

const GaugeChart = ({ title, value, max, color, unit = "", size = "small", isRefreshing }: GaugeProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const data = [{ value: value }, { value: max - value }];

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center transition-all duration-500 ${isRefreshing ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}>
      <h3 className={`text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider ${size === "large" ? "text-lg" : "text-xs"}`}>
        {title}
      </h3>
      <div className={`w-full ${size === "large" ? "h-64" : "h-32"} relative`}>
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
              animationDuration={1000}
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill={isDarkMode ? "#374151" : "#e5e7eb"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className={`${size === "large" ? "text-5xl" : "text-2xl"} font-bold dark:text-white`}>
            {value}{unit}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Capacity: {max}{unit}</p>
    </div>
  );
};

// --- MAIN DASHBOARD PAGE ---
const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate an API call
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-xl font-bold dark:text-white">Inventory Metrics</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last checked: {lastUpdated}</span>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
        >
          <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* TOP SECTION: Large Device Chart */}
      <div className="w-full">
        <GaugeChart 
          title="Number of Devices" 
          value={742} 
          max={1000} 
          color="#3b82f6" 
          size="large"
          isRefreshing={isRefreshing}
        />
      </div>

      {/* BOTTOM SECTION: 3 Smaller Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
        <GaugeChart 
          title="Total Power" 
          value={45} 
          max={100} 
          color="#ef4444" 
          unit="kW"
          isRefreshing={isRefreshing}
        />
        <GaugeChart 
          title="Network Ports" 
          value={6.2} 
          max={10} 
          color="#10b981" 
          isRefreshing={isRefreshing}
        />
        <GaugeChart 
          title="SAN Ports" 
          value={128} 
          max={256} 
          color="#f59e0b" 
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
};

export default Dashboard;