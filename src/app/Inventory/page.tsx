"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/app/redux";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Edit, MoreHorizontal, 
  X, Server, Zap, Building2, Save, AlertTriangle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// --- TYPES ---
interface InventoryGaugeProps {
  title: string;
  value: number;
  max: number;
  color: string;
}

interface Device {
  id: string;
  device_type: string;
  device_hostname: string;
  device_model: string;
  device_serial: string;
  rack_name: string;
  rack_unit: string;
  rack_uspace: number;
  device_power: number;
  device_nports: number;
  device_sports: number;
  power_status: boolean;
  device_status: boolean;
}

// --- GAUGE COMPONENT ---
const InventoryGauge = ({ title, value, max, color }: InventoryGaugeProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const data = [{ value: value }, { value: max - value }];
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center shadow-sm">
      <span className="text-xs font-semibold text-gray-400 uppercase mb-1">{title}</span>
      <div className="w-full h-20 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius="60%" outerRadius="100%" dataKey="value" stroke="none">
              <Cell fill={color} />
              <Cell fill={isDarkMode ? "#374151" : "#f3f4f6"} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <span className="text-lg font-bold dark:text-white -mt-2">{value} / {max}</span>
    </div>
  );
};

// --- DELETE MODAL COMPONENT ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, deviceName }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={28} />
          <h3 className="text-xl font-bold">Confirm Deletion</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{deviceName}</span>? This action is permanent.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">Delete Asset</button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, deviceId: "", deviceName: "" });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      device_type: "Server",
      device_hostname: "PROD-WEB-01",
      device_model: "Dell R740",
      device_serial: "ABC-123-XYZ",
      rack_name: "RACK-A1",
      rack_unit: "12",
      rack_uspace: 2,
      device_power: 450,
      device_nports: 4,
      device_sports: 2,
      power_status: true,
      device_status: true,
    },
    {
      id: "2",
      device_type: "Switch",
      device_hostname: "CORE-SW-01",
      device_model: "Cisco 9300",
      device_serial: "SN-998877",
      rack_name: "RACK-B2",
      rack_unit: "42",
      rack_uspace: 1,
      device_power: 150,
      device_nports: 48,
      device_sports: 0,
      power_status: true,
      device_status: true,
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredDevices = devices.filter((d) =>
    d.device_hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.device_serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    setDevices(devices.filter(d => d.id !== deleteModal.deviceId));
    setDeleteModal({ isOpen: false, deviceId: "", deviceName: "" });
    setOpenMenuId(null);
  };

  return (
    <div className="relative flex flex-col gap-6 pb-24">
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen} 
        deviceName={deleteModal.deviceName}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
      />

      {/* 1. GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InventoryGauge title="Total Devices" value={devices.length} max={500} color="#3b82f6" />
        <InventoryGauge title="Total Power (W)" value={devices.reduce((acc, d) => acc + d.device_power, 0)} max={5000} color="#ef4444" />
        <InventoryGauge title="Network Ports" value={devices.reduce((acc, d) => acc + d.device_nports, 0)} max={1000} color="#10b981" />
        <InventoryGauge title="SAN Ports" value={devices.reduce((acc, d) => acc + d.device_sports, 0)} max={200} color="#f59e0b" />
      </div>

      {/* 2. HEADER */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Device Inventory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Asset
        </button>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-5 w-12 text-center">
                <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? devices.map(d => d.id) : [])} />
              </th>
              <th className="px-4 py-5 text-sm font-extrabold uppercase whitespace-nowrap">Hostname / Model</th>
              <th className="px-4 py-5 text-sm font-extrabold uppercase whitespace-nowrap">Type</th>
              <th className="px-4 py-5 text-sm font-extrabold uppercase whitespace-nowrap text-center">Power (W)</th>
              <th className="px-4 py-5 text-sm font-extrabold uppercase whitespace-nowrap text-center">Status</th>
              <th className="px-4 py-5 text-sm font-extrabold uppercase whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {filteredDevices.map((device) => (
              <tr 
                key={device.id}
                onClick={() => toggleRow(device.id)}
                className={`transition-colors cursor-pointer ${selectedRows.includes(device.id) ? "bg-blue-50/50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
              >
                <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedRows.includes(device.id)} onChange={() => toggleRow(device.id)} />
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold dark:text-white">{device.device_hostname}</div>
                  <div className="text-xs text-gray-400">{device.device_model}</div>
                </td>
                <td className="px-4 py-4 dark:text-gray-300">{device.device_type}</td>
                <td className="px-4 py-4 text-center font-semibold text-orange-600 dark:text-orange-400">{device.device_power}W</td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${device.device_status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {device.device_status ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <div ref={openMenuId === device.id ? menuRef : null}>
                    <button onClick={() => setOpenMenuId(openMenuId === device.id ? null : device.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                    {openMenuId === device.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-50 py-1">
                        <button 
                          onClick={() => router.push(`/inventory/update/${device.id}`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 dark:text-white"
                        >
                          <Edit className="w-4 h-4" /> Update Fields
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, deviceId: device.id, deviceName: device.device_hostname })}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Asset
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. ADD ASSET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-xl font-black dark:text-white uppercase">Provision Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-400"><X size={24} /></button>
            </div>
            <form className="p-8 max-h-[75vh] overflow-y-auto" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-full border-b dark:border-gray-700 pb-2 mb-2 flex items-center gap-2">
                  <Server size={14} className="text-blue-500" />
                  <span className="text-[11px] font-black text-gray-500 uppercase">Identification</span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Hostname</label>
                  <input type="text" placeholder="PROD-WEB-01" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Serial Number</label>
                  <input type="text" placeholder="ABC-123-XYZ" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white font-mono outline-none" />
                </div>
                <div className="col-span-full border-b dark:border-gray-700 pb-2 mb-2 mt-4 flex items-center gap-2">
                  <Building2 size={14} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-gray-500 uppercase">Rack Placement</span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rack Name</label>
                  <input type="text" placeholder="RACK-A1" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white font-bold outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rack Unit</label>
                  <input type="text" placeholder="12" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none" />
                </div>
                <div className="col-span-full border-b dark:border-gray-700 pb-2 mb-2 mt-4 flex items-center gap-2">
                  <Zap size={14} className="text-orange-500" />
                  <span className="text-[11px] font-black text-gray-500 uppercase">Resources</span>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Power (W)</label>
                  <input type="number" placeholder="450" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-12">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border dark:border-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 uppercase text-xs tracking-widest">Cancel Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"><Save size={18} /> Provision Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. BULK BAR */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4">
          <span className="font-bold border-r border-gray-700 pr-6">{selectedRows.length} Assets Selected</span>
          <div className="flex gap-4">
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 font-semibold"><Edit className="w-4 h-4" /> Bulk Update</button>
            <button className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 font-semibold"><Trash2 className="w-4 h-4" /> Bulk Delete</button>
          </div>
          <button onClick={() => setSelectedRows([])} className="ml-4 p-1 hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
};

export default Inventory;