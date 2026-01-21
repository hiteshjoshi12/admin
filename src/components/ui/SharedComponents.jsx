import React from 'react';
import { X } from 'lucide-react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export const Badge = ({ status }) => {
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "Low Stock": "bg-amber-50 text-amber-700 border border-amber-100",
    "Out of Stock": "bg-red-50 text-red-700 border border-red-100",
    true: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    false: "bg-slate-100 text-slate-500 border border-slate-200",
    "Paid": "text-emerald-600",
    "Pending": "text-orange-600",
    "Shipped": "bg-indigo-50 text-indigo-700 border-indigo-100", 
  };
  
  // Custom logic for simple string matches
  let className = styles[status] || "bg-slate-100 text-slate-500 border border-slate-200";
  if(status === true) className = styles[true];
  if(status === false) className = styles[false];

  const label = status === true ? "Active" : status === false ? "Inactive" : status;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>{label}</span>;
};

export const ToggleSwitch = ({ active, onClick }) => (
  <button onClick={onClick} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${active ? "bg-slate-900" : "bg-slate-200"}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} animate-in zoom-in-95 duration-200 overflow-hidden`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};